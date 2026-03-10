import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(userId: string, dto: CreateQuestionDto) {
    const { title, body, scholarIds, isUrgent } = dto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if ((user as any).isBanned) {
      throw new BadRequestException(
        'You have been restricted from asking questions. Please contact support for more information.',
      );
    }

    if (user.role === 'SCHOLAR') {
      throw new BadRequestException(
        'Scholars cannot ask questions. Your role is intended for providing answers.',
      );
    }

    if (isUrgent) {
      const now = new Date();
      const lastReset = user.lastUrgentReset;
      const msIn30Days = 30 * 24 * 60 * 60 * 1000;
      let newQuota = user.urgentQuota;

      if (now.getTime() - lastReset.getTime() >= msIn30Days) {
        newQuota = 1; // reset quota to 1
      }

      if (newQuota <= 0) {
        throw new BadRequestException(
          'Urgent quota exceeded. You can only ask 1 urgent question per month.',
        );
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          urgentQuota: newQuota - 1,
          lastUrgentReset: newQuota !== user.urgentQuota ? now : undefined,
        },
      });
    }

    const question = await this.prisma.question.create({
      data: {
        title,
        body: body ?? '',
        isUrgent: isUrgent ?? false,
        author: {
          connect: { id: userId },
        },
        directedScholars: {
          connect: scholarIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
            isVerified: true,
          },
        },
        tags: true,
        directedScholars: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });

    // Send email notifications to directed scholars
    if (question.directedScholars && question.directedScholars.length > 0) {
      question.directedScholars.forEach((scholar) => {
        if (scholar.email) {
          this.mailService
            .sendQuestionDirectionNotification(
              { email: scholar.email, name: scholar.name },
              question.title,
              question.id,
            )
            .catch((err) =>
              console.error(
                `Failed to send direction email to ${scholar.email}:`,
                err,
              ),
            );
        }
      });
    }

    return question;
  }

  async findAll(options?: { tag?: string }) {
    const whereClause: any = {};
    if (options?.tag) {
      whereClause.tags = {
        some: {
          name: {
            equals: options.tag,
            mode: 'insensitive',
          },
        },
      };
    }

    return this.prisma.question.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
            isVerified: true,
          },
        },
        tags: true,
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                name: true,
                avatar: true,
                specialization: true,
                isVerified: true,
              },
            },
          },
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

  async findOne(id: string, userId?: string, ip?: string) {
    // Unique view record logic
    let shouldIncrement = false;

    try {
      if (userId) {
        const existingView = await this.prisma.questionView.findUnique({
          where: { userId_questionId: { userId, questionId: id } },
        });

        if (!existingView) {
          await this.prisma.questionView
            .create({
              data: { userId, questionId: id },
            })
            .catch(() => null);
          shouldIncrement = true;
        }
      } else if (ip) {
        const existingView = await this.prisma.questionView.findUnique({
          where: { ipAddress_questionId: { ipAddress: ip, questionId: id } },
        });

        if (!existingView) {
          await this.prisma.questionView
            .create({
              data: { ipAddress: ip, questionId: id },
            })
            .catch(() => null);
          shouldIncrement = true;
        }
      } else {
        // Fallback for cases where we can't identify the user/IP
        shouldIncrement = true;
      }

      if (shouldIncrement) {
        await this.prisma.question
          .update({
            where: { id },
            data: { views: { increment: 1 } },
          })
          .catch(() => null);
      }
    } catch (err) {
      console.error('Error recording view:', err);
    }

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
            gender: true,
            isVerified: true,
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
                isVerified: true,
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
        OR: [
          {
            directedScholars: {
              some: { id: scholarId },
            },
          },
          { acceptedById: scholarId },
        ],
      },
      distinct: ['id'],
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
          },
        },
        tags: true,
        answers: {
          where: { authorId: scholarId },
          select: { id: true, authorId: true },
        },
        _count: {
          select: { answers: true, ratings: true },
        },
      },
    });
  }
  async findMyQuestions(
    authorId: string,
    options: {
      status?: string;
      sort?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
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
            select: {
              id: true,
              name: true,
              role: true,
              avatar: true,
              gender: true,
            },
          },
          tags: true,
          _count: {
            select: { answers: true, ratings: true },
          },
          answers: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              author: { select: { id: true, name: true, avatar: true } },
            },
          },
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
        answers: { none: {} },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
          },
        },
        tags: true,
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: {
          select: { answers: true, ratings: true },
        },
      },
    });
  }

  async deleteQuestion(id: string, requesterId: string, role: string) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');

    const isModerator = role === 'MODERATOR' || role === 'ADMIN';
    const isOwner = question.authorId === requesterId;

    if (!isOwner && !isModerator) {
      throw new NotFoundException('Unauthorized');
    }

    // Only owners are restricted from deleting accepted questions
    if (isOwner && !isModerator && question.acceptedById) {
      throw new NotFoundException('Cannot delete an accepted question');
    }

    return this.prisma.question.delete({ where: { id } });
  }

  async acceptQuestion(id: string, scholarId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { email: true, name: true } },
      },
    });

    if (!question) throw new NotFoundException('Question not found');

    const scholar = await this.prisma.user.findUnique({
      where: { id: scholarId },
      select: { name: true },
    });

    // Make sure the scholar is allowed to accept it
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

    // Send email notification to user
    if (question.author?.email) {
      this.mailService
        .sendQuestionAcceptedNotification(
          { email: question.author.email, name: question.author.name },
          question.title,
          question.id,
          scholar?.name || 'A scholar',
        )
        .catch((err) => console.error('Failed to send acceptance email:', err));
    }

    return updated;
  }

  async declineQuestion(id: string, scholarId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { email: true, name: true } },
      },
    });

    if (!question) throw new NotFoundException('Question not found');

    const scholar = await this.prisma.user.findUnique({
      where: { id: scholarId },
      select: { name: true },
    });

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

    // Send email notification to user
    if (question.author?.email) {
      this.mailService
        .sendQuestionDeclinedNotification(
          { email: question.author.email, name: question.author.name },
          question.title,
          question.id,
          scholar?.name || 'A scholar',
        )
        .catch((err) => console.error('Failed to send decline email:', err));
    }

    return updated;
  }

  async answerQuestion(
    questionId: string,
    scholarId: string,
    content: string,
    categories: string[],
    voiceUrl?: string,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { author: { select: { email: true, name: true } } },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const scholar = await this.prisma.user.findUnique({
      where: { id: scholarId },
    });
    if ((scholar as any)?.isBanned) {
      throw new BadRequestException(
        'Your account has been restricted. You cannot provide answers at this time.',
      );
    }

    if (!categories || categories.length === 0) {
      throw new BadRequestException(
        'At least one category is required to answer a question',
      );
    }

    // Update tags and set acceptedById for the question
    await this.prisma.question.update({
      where: { id: questionId },
      data: {
        acceptedById: scholarId, // Ensure the question is marked as accepted by this scholar
        tags: {
          connectOrCreate: categories.map((cat) => ({
            where: { name: cat.trim().toLowerCase() },
            create: { name: cat.trim().toLowerCase() },
          })),
        },
      },
    });

    const answer = await this.prisma.answer.create({
      data: {
        content,
        voiceUrl,
        question: { connect: { id: questionId } },
        author: { connect: { id: scholarId } },
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });

    // Delete draft if it exists
    try {
      await this.prisma.answerDraft.delete({
        where: {
          authorId_questionId: {
            authorId: scholarId,
            questionId: questionId,
          },
        },
      });
    } catch (err) {
      // Ignore if draft doesn't exist
    }

    await this.prisma.notification.create({
      data: {
        userId: question.authorId,
        senderId: scholarId,
        type: 'QUESTION_ANSWERED',
        message: 'A scholar has answered your question.',
        questionId: question.id,
      },
    });

    // Send email notification
    if (question.author?.email) {
      this.mailService
        .sendAnswerNotification(
          { email: question.author.email, name: question.author.name },
          question.title,
          question.id,
        )
        .catch((err) => console.error('Failed to send answer email:', err));
    }

    return answer;
  }

  async saveDraft(
    questionId: string,
    scholarId: string,
    content: string,
    voiceUrl?: string,
  ) {
    const draft = await this.prisma.answerDraft.upsert({
      where: {
        authorId_questionId: {
          authorId: scholarId,
          questionId: questionId,
        },
      },
      update: {
        content,
        voiceUrl,
      },
      create: {
        content,
        voiceUrl,
        author: { connect: { id: scholarId } },
        question: { connect: { id: questionId } },
      },
    });
    return draft;
  }

  async getDraft(questionId: string, scholarId: string) {
    const draft = await this.prisma.answerDraft.findUnique({
      where: {
        authorId_questionId: {
          authorId: scholarId,
          questionId: questionId,
        },
      },
    });
    return draft;
  }

  async findAllTags() {
    const tags = await this.prisma.tag.findMany({
      select: { name: true },
    });
    return tags.map((t) => t.name);
  }

  async voteQuestion(questionId: string, userId: string, value: number) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
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
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
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

  async toggleSaveQuestion(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { savedBy: { select: { id: true } } },
    });

    if (!question) throw new NotFoundException('Question not found');

    const isSaved = question.savedBy.some((u) => u.id === userId);

    if (isSaved) {
      await this.prisma.question.update({
        where: { id },
        data: { savedBy: { disconnect: { id: userId } } },
      });
      return { isSaved: false };
    } else {
      await this.prisma.question.update({
        where: { id },
        data: { savedBy: { connect: { id: userId } } },
      });
      return { isSaved: true };
    }
  }

  async checkSaved(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { savedBy: { select: { id: true } } },
    });

    if (!question) throw new NotFoundException('Question not found');
    const isSaved = question.savedBy.some((u) => u.id === userId);
    return { isSaved };
  }

  async findSavedQuestions(userId: string) {
    return this.prisma.question.findMany({
      where: {
        savedBy: { some: { id: userId } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
          },
        },
        tags: true,
        _count: {
          select: { answers: true, ratings: true },
        },
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });
  }

  async findDraftQuestions(scholarId: string) {
    return this.prisma.question.findMany({
      where: {
        answerDrafts: { some: { authorId: scholarId } },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
            gender: true,
          },
        },
        tags: true,
        _count: {
          select: { answers: true, ratings: true },
        },
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        },
        answerDrafts: {
          where: { authorId: scholarId },
          take: 1,
        },
      },
    });
  }

  async unsaveAll(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        savedQuestions: { set: [] },
      },
    });
    return { success: true };
  }

  async getTrendingTopicsWithCounts() {
    // Get all tags and count how many questions they have
    const tagsWithCounts = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    // Default icon mapping
    const getIcon = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('spiritual') || n.includes('heart')) return '🌱';
      if (n.includes('fiqh') || n.includes('law')) return '⚖️';
      if (n.includes('family') || n.includes('marriage')) return '🏠';
      if (n.includes('history') || n.includes('seerah')) return '📜';
      if (n.includes('hadith')) return '📖';
      if (n.includes('contemporary')) return '🌐';
      if (n.includes('aqidah') || n.includes('belief')) return '🕋';
      if (n.includes('quran')) return '📗';
      if (n.includes('ramadan') || n.includes('fasting')) return '🌙';
      return '🏷️';
    };

    return tagsWithCounts
      .map((tag) => ({
        name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
        count: tag._count.questions,
        icon: getIcon(tag.name),
      }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count); // sort descending by count
  }

  async getGlobalStats() {
    const totalQuestions = await this.prisma.question.count();
    const totalAnswers = await this.prisma.answer.count();
    const totalScholars = await this.prisma.user.count({
      where: { role: 'SCHOLAR' },
    });
    const answeredQuestionsCount = await this.prisma.question.count({
      where: { answers: { some: {} } },
    });

    // People helped: sum of unique question authors who received at least one answer
    const helpedAuthors = await this.prisma.answer.findMany({
      select: {
        question: {
          select: { authorId: true },
        },
      },
      distinct: ['questionId'],
    });
    const peopleHelped = new Set(helpedAuthors.map((a) => a.question.authorId))
      .size;

    // Response rate: (Answered Questions / Total Questions) * 100
    const responseRate =
      totalQuestions > 0
        ? Math.round((answeredQuestionsCount / totalQuestions) * 100)
        : 0;

    return {
      totalQuestions,
      totalAnswers,
      totalScholars,
      peopleHelped,
      responseRate,
    };
  }

  async deleteAnswer(id: string, requesterId: string, role: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');

    const isModerator = role === 'MODERATOR' || role === 'ADMIN';
    const isOwner = answer.authorId === requesterId;

    if (!isOwner && !isModerator) {
      throw new NotFoundException('Unauthorized');
    }

    return this.prisma.answer.delete({ where: { id } });
  }

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return { questions: [], scholars: [], topics: [] };
    }

    const q = query.trim();

    const questions = await this.prisma.question.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { body: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, gender: true },
        },
        tags: true,
        answers: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { name: true, avatar: true } },
          },
        },
        _count: {
          select: { answers: true },
        },
      },
    });

    return { questions, scholars: [], topics: [] };
  }
}
