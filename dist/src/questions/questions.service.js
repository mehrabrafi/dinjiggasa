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
        const { title, body, tags } = dto;
        return this.prisma.question.create({
            data: {
                title,
                body,
                author: {
                    connect: { id: userId },
                },
                tags: {
                    connectOrCreate: tags?.map((tag) => ({
                        where: { name: tag.trim().toLowerCase() },
                        create: { name: tag.trim().toLowerCase() },
                    })) || [],
                },
            },
            include: {
                author: {
                    select: { id: true, name: true, role: true, avatar: true },
                },
                tags: true,
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
                _count: {
                    select: { answers: true, ratings: true },
                },
            },
        });
    }
    async findOne(id) {
        await this.prisma.question.update({
            where: { id },
            data: { views: { increment: 1 } },
        }).catch(() => null);
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, role: true, avatar: true, reputation: true },
                },
                tags: true,
                answers: {
                    include: {
                        author: { select: { id: true, name: true, role: true, avatar: true, reputation: true } },
                        _count: { select: { ratings: true } },
                    },
                    orderBy: [
                        { isAccepted: 'desc' },
                        { createdAt: 'desc' },
                    ],
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
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map