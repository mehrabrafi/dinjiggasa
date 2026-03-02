"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionsService = class QuestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const { title, body, tags, scholarIds, isUrgent } = dto;
        if (isUrgent) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const now = new Date();
            const lastReset = user.lastUrgentReset;
            const msIn30Days = 30 * 24 * 60 * 60 * 1000;
            let newQuota = user.urgentQuota;
            if (now.getTime() - lastReset.getTime() >= msIn30Days) {
                newQuota = 1;
            }
            if (newQuota <= 0) {
                throw new common_1.BadRequestException('Urgent quota exceeded. You can only ask 1 urgent question per month.');
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
                    connectOrCreate: tags?.map((tag) => ({
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
    async findOne(id) {
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
                        _count: { select: { ratings: true } },
                    },
                    orderBy: [{ isAccepted: 'desc' }, { createdAt: 'desc' }],
                },
                _count: {
                    select: { ratings: true },
                },
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        return question;
    }
    async findDirectedTo(scholarId) {
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
    async findMyQuestions(authorId) {
        return this.prisma.question.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
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
        });
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
    async deleteQuestion(id, authorId) {
        const question = await this.prisma.question.findUnique({ where: { id } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.authorId !== authorId)
            throw new common_1.NotFoundException('Unauthorized');
        if (question.acceptedById)
            throw new common_1.NotFoundException('Cannot delete an accepted question');
        return this.prisma.question.delete({ where: { id } });
    }
    async acceptQuestion(id, scholarId) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                directedScholars: { select: { id: true } },
            },
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
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
    async declineQuestion(id, scholarId) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
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
    async answerQuestion(questionId, scholarId, content) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
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
    async voteQuestion(questionId, userId, value) {
        const question = await this.prisma.question.findUnique({ where: { id: questionId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
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
                await this.prisma.rating.delete({ where: { id: existingVote.id } });
            }
            else {
                await this.prisma.rating.update({
                    where: { id: existingVote.id },
                    data: { value },
                });
            }
        }
        else {
            await this.prisma.rating.create({
                data: {
                    value,
                    user: { connect: { id: userId } },
                    question: { connect: { id: questionId } },
                },
            });
        }
        return this.prisma.rating.findMany({
            where: { questionId },
            select: { value: true, userId: true },
        });
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map