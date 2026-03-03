import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ScholarsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            where: {
                role: Role.SCHOLAR,
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                specialization: true,
                bio: true,
                isVerified: true,
                reputation: true,
            }
        });
    }

    /**
     * Get comprehensive stats for a scholar's dashboard
     */
    async getScholarStats(scholarId: string) {
        // Total answers given by this scholar
        const totalAnswers = await this.prisma.answer.count({
            where: { authorId: scholarId },
        });

        // Total upvotes received on their answers and questions they've answered
        const answers = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: { id: true, questionId: true },
        });
        const answerIds = answers.map(a => a.id);
        const uniqueQuestionIds = answers.map(a => a.questionId);

        const totalUpvotes = await this.prisma.rating.count({
            where: {
                OR: [
                    { answerId: { in: answerIds }, value: { gt: 0 } },
                    { questionId: { in: uniqueQuestionIds }, value: { gt: 0 } },
                ],
            },
        });

        // Unanswered questions directed to or accepted by this scholar (pending)
        const pendingQuestions = await this.prisma.question.count({
            where: {
                OR: [
                    { directedScholars: { some: { id: scholarId } } },
                    { acceptedById: scholarId },
                ],
                answers: {
                    none: { authorId: scholarId },
                },
            },
        });

        // Answers this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const answersThisWeek = await this.prisma.answer.count({
            where: {
                authorId: scholarId,
                createdAt: { gte: startOfWeek },
            },
        });

        // People helped (unique question authors who got answers from this scholar)
        const helpedAuthors = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: {
                question: {
                    select: { authorId: true },
                },
            },
            distinct: ['questionId'],
        });
        const peopleHelped = new Set(helpedAuthors.map(a => a.question.authorId)).size;

        // Total views on questions this scholar answered
        const answeredQuestions = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: {
                question: {
                    select: { views: true },
                },
            },
        });
        const totalViews = answeredQuestions.reduce((sum, a) => sum + a.question.views, 0);

        // Top topic: find the most frequent tag from questions they've answered
        const tags = await this.prisma.tag.findMany({
            where: {
                questions: {
                    some: { id: { in: uniqueQuestionIds } },
                },
            },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: {
                questions: { _count: 'desc' },
            },
            take: 1,
        });
        const topTopic = tags.length > 0 ? tags[0].name : 'General';

        // Response rate: accepted/directed questions that got answers / total directed/accepted questions
        const totalDirected = await this.prisma.question.count({
            where: {
                OR: [
                    { directedScholars: { some: { id: scholarId } } },
                    { acceptedById: scholarId },
                ],
            },
        });
        const totalAnswered = await this.prisma.question.count({
            where: {
                OR: [
                    { directedScholars: { some: { id: scholarId } } },
                    { acceptedById: scholarId },
                ],
                answers: { some: { authorId: scholarId } },
            },
        });
        const responseRate = totalDirected > 0 ? Math.round((totalAnswered / totalDirected) * 100) : 0;

        return {
            totalAnswers,
            totalUpvotes,
            pendingQuestions,
            answersThisWeek,
            peopleHelped,
            totalViews,
            topTopic,
            responseRate,
            totalDirected,
            totalAnswered,
        };
    }

    /**
     * Get questions that this scholar has answered
     */
    async getMyAnswers(scholarId: string) {
        return this.prisma.answer.findMany({
            where: { authorId: scholarId },
            orderBy: { createdAt: 'desc' },
            include: {
                question: {
                    include: {
                        author: {
                            select: { id: true, name: true, avatar: true },
                        },
                        tags: true,
                        _count: {
                            select: { answers: true, ratings: true },
                        },
                    },
                },
                ratings: {
                    select: { value: true },
                },
            },
        });
    }

    /**
     * Get analytics data for a scholar
     */
    async getAnalytics(scholarId: string) {
        // Answer stats grouped by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentAnswers = await this.prisma.answer.findMany({
            where: {
                authorId: scholarId,
                createdAt: { gte: sixMonthsAgo },
            },
            include: {
                question: {
                    include: {
                        tags: true,
                        _count: { select: { ratings: true } },
                    },
                },
                ratings: {
                    select: { value: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Total answers
        const totalAnswers = await this.prisma.answer.count({
            where: { authorId: scholarId },
        });

        // Total upvotes on all answers and questions they've answered
        const answers = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: { id: true, questionId: true },
        });
        const ansIds = answers.map(a => a.id);
        const qIds = answers.map(a => a.questionId);

        const totalUpvotes = await this.prisma.rating.count({
            where: {
                OR: [
                    { answerId: { in: ansIds }, value: { gt: 0 } },
                    { questionId: { in: qIds }, value: { gt: 0 } },
                ],
            },
        });

        // Total views on answered questions
        const totalViews = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: {
                question: { select: { views: true } },
            },
        });
        const viewsCount = totalViews.reduce((sum, a) => sum + a.question.views, 0);

        // People helped this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const helpedThisMonth = await this.prisma.answer.findMany({
            where: {
                authorId: scholarId,
                createdAt: { gte: startOfMonth },
            },
            select: {
                question: { select: { authorId: true } },
            },
            distinct: ['questionId'],
        });
        const peopleHelpedThisMonth = new Set(helpedThisMonth.map(a => a.question.authorId)).size;

        // Top categories
        const allAnsweredQuestionIds = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            select: { questionId: true },
        });
        const categoryStats = await this.prisma.tag.findMany({
            where: {
                questions: {
                    some: { id: { in: allAnsweredQuestionIds.map(a => a.questionId) } },
                },
            },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: {
                questions: { _count: 'desc' },
            },
            take: 5,
        });

        const totalTaggedQuestions = categoryStats.reduce((sum, t) => sum + t._count.questions, 0);
        const topCategories = categoryStats.map(t => ({
            name: t.name,
            count: t._count.questions,
            percentage: totalTaggedQuestions > 0 ? Math.round((t._count.questions / totalTaggedQuestions) * 100) : 0,
        }));

        // Top performing answers (most views + upvotes)
        const topAnswers = await this.prisma.answer.findMany({
            where: { authorId: scholarId },
            include: {
                question: {
                    include: {
                        tags: true,
                    },
                },
                ratings: {
                    select: { value: true },
                },
            },
            orderBy: {
                question: { views: 'desc' },
            },
            take: 5,
        });

        const topPerforming = topAnswers.map(a => ({
            id: a.id,
            questionId: a.questionId,
            topic: a.question.title,
            category: a.question.tags?.[0]?.name || 'General',
            views: a.question.views,
            upvotes: a.ratings.filter(r => r.value > 0).length,
            isAccepted: a.isAccepted,
            createdAt: a.createdAt,
        }));

        return {
            totalAnswers,
            totalUpvotes,
            totalViews: viewsCount,
            peopleHelpedThisMonth,
            topCategories,
            topPerforming,
            recentAnswersCount: recentAnswers.length,
        };
    }

    /**
     * Get top 5 scholars by response rate
     */
    async getTopScholars() {
        const scholars = await this.prisma.user.findMany({
            where: { role: Role.SCHOLAR },
            select: {
                id: true,
                name: true,
                avatar: true,
                specialization: true,
            }
        });

        const scholarsWithRates = await Promise.all(scholars.map(async (scholar) => {
            const totalDirected = await this.prisma.question.count({
                where: {
                    OR: [
                        { directedScholars: { some: { id: scholar.id } } },
                        { acceptedById: scholar.id },
                    ],
                },
            });
            const totalAnswered = await this.prisma.question.count({
                where: {
                    OR: [
                        { directedScholars: { some: { id: scholar.id } } },
                        { acceptedById: scholar.id },
                    ],
                    answers: { some: { authorId: scholar.id } },
                },
            });
            const responseRate = totalDirected > 0 ? (totalAnswered / totalDirected) : 0;
            return { ...scholar, responseRate };
        }));

        return scholarsWithRates
            .sort((a, b) => b.responseRate - a.responseRate)
            .slice(0, 5);
    }
}
