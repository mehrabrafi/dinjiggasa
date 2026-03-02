import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, dto: CreateQuestionDto) {
    const { title, body, tags, scholarIds, isUrgent } = dto;

    if (isUrgent) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const now = new Date();
      const lastReset = user.lastUrgentReset;
      const msIn30Days = 30 * 24 * 60 * 60 * 1000;
      let newQuota = user.urgentQuota;

      if (now.getTime() - lastReset.getTime() >= msIn30Days) {
        newQuota = 1; // reset quota to 1
      }

      if (newQuota <= 0) {
        throw new BadRequestException('Urgent quota exceeded. You can only ask 1 urgent question per month.');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          urgentQuota: newQuota - 1,
          lastUrgentReset: newQuota !== user.urgentQuota ? now : undefined
        }
      });
    }

    return this.prisma.question.create({
      data: {
        title,
        body: body ?? '',
        isUrgent: isUrgent ?? false,
        author: {
          connect: { id: userId },
        },
        tags: {
          connectOrCreate:
            tags?.map((tag) => ({
              where: { name: tag.trim().toLowerCase() },
              create: { name: tag.trim().toLowerCase() },
            })) || [],
        },
        directedScholars: {
          connect: scholarIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: true,
        directedScholars: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: true,
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { name: true, avatar: true, specialization: true } }
          }
        },
        ratings: {
          select: { value: true, userId: true },
        },
        _count: {
          select: { answers: true, ratings: true },
        },
      },
    });
  }

  async findOne(id: string) {
    // Increment view count
    await this.prisma.question
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => null);

    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
                avatar: true,
                reputation: true,
              },
            },
            ratings: {
              select: { value: true, userId: true },
            },
            _count: { select: { ratings: true } },
          },
          orderBy: [{ isAccepted: 'desc' }, { createdAt: 'desc' }],
        },
        ratings: {
          select: { value: true, userId: true },
        },
        _count: {
          select: { ratings: true },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async findDirectedTo(scholarId: string) {
    return this.prisma.question.findMany({
      where: {
        directedScholars: {
          some: { id: scholarId },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: true,
        _count: {
          select: { answers: true, ratings: true },
        },
      },
    });
  }
  async findMyQuestions(authorId: string, options: { status?: string, sort?: string, search?: string, page?: number, limit?: number } = {}) {
    const { status, sort, search, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const where: any = { authorId };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (status && status !== 'All') {
      if (status === 'Pending Review') {
        where.acceptedById = null;
        where.answers = { none: {} };
      } else if (status === 'Answered') {
        where.answers = { some: {} };
      } else if (status === 'Accepted (Under Review)') {
        where.acceptedById = { not: null };
        where.answers = { none: {} };
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'Oldest') orderBy = { createdAt: 'asc' };
      else if (sort === 'Newest') orderBy = { createdAt: 'desc' };
      else if (sort === 'Most Viewed') orderBy = { views: 'desc' };
    }

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, role: true, avatar: true },
          },
          tags: true,
          _count: {
            select: { answers: true, ratings: true },
          },
          answers: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              author: { select: { id: true, name: true, avatar: true } }
            }
          }
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUrgentQuestions() {
    return this.prisma.question.findMany({
      where: {
        isUrgent: true,
        acceptedById: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: true,
        _count: {
          select: { answers: true, ratings: true },
        },
      },
    });
  }

  async deleteQuestion(id: string, authorId: string) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.authorId !== authorId) throw new NotFoundException('Unauthorized');
    if (question.acceptedById) throw new NotFoundException('Cannot delete an accepted question');

    return this.prisma.question.delete({ where: { id } });
  }

  async acceptQuestion(id: string, scholarId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        directedScholars: { select: { id: true } },
      },
    });

    if (!question) throw new NotFoundException('Question not found');

    // Make sure the scholar is allowed to accept it (either directed or open question scenario, assuming any scholar can accept for now but prefer directed ones)
    const updated = await this.prisma.question.update({
      where: { id },
      data: { acceptedById: scholarId },
    });

    await this.prisma.notification.create({
      data: {
        userId: question.authorId,
        senderId: scholarId,
        type: 'QUESTION_ACCEPTED',
        message: 'A scholar has accepted your question.',
        questionId: question.id,
      },
    });

    return updated;
  }

  async declineQuestion(id: string, scholarId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) throw new NotFoundException('Question not found');

    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        directedScholars: {
          disconnect: { id: scholarId },
        },
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: question.authorId,
        senderId: scholarId,
        type: 'QUESTION_DECLINED',
        message: 'A scholar has declined to answer your question.',
        questionId: question.id,
      },
    });

    return updated;
  }

  async answerQuestion(questionId: string, scholarId: string, content: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const answer = await this.prisma.answer.create({
      data: {
        content,
        question: { connect: { id: questionId } },
        author: { connect: { id: scholarId } },
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true }
        }
      }
    });

    await this.prisma.notification.create({
      data: {
        userId: question.authorId,
        senderId: scholarId,
        type: 'QUESTION_ANSWERED',
        message: 'A scholar has answered your question.',
        questionId: question.id,
      },
    });

    return answer;
  }

  async voteQuestion(questionId: string, userId: string, value: number) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const existingVote = await this.prisma.rating.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle vote (remove it)
        await this.prisma.rating.delete({ where: { id: existingVote.id } });
      } else {
        // Update vote
        await this.prisma.rating.update({
          where: { id: existingVote.id },
          data: { value },
        });
      }
    } else {
      // Create new vote
      await this.prisma.rating.create({
        data: {
          value,
          user: { connect: { id: userId } },
          question: { connect: { id: questionId } },
        },
      });
    }

    // Return the updated ratings for this question
    return this.prisma.rating.findMany({
      where: { questionId },
      select: { value: true, userId: true },
    });
  }

  async voteAnswer(answerId: string, userId: string, value: number) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) throw new NotFoundException('Answer not found');

    const existingVote = await this.prisma.rating.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle vote (remove it)
        await this.prisma.rating.delete({ where: { id: existingVote.id } });
      } else {
        // Update vote
        await this.prisma.rating.update({
          where: { id: existingVote.id },
          data: { value },
        });
      }
    } else {
      // Create new vote
      await this.prisma.rating.create({
        data: {
          value,
          user: { connect: { id: userId } },
          answer: { connect: { id: answerId } },
        },
      });
    }

    // Return the updated ratings for this answer
    return this.prisma.rating.findMany({
      where: { answerId },
      select: { value: true, userId: true },
    });
  }
}
