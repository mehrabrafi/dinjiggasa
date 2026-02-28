import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateQuestionDto) {
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
                    select: { answers: true, votes: true },
                },
            },
        });
    }

    async findOne(id: string) {
        // Increment view count
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
                        _count: { select: { votes: true } },
                    },
                    orderBy: [
                        { isAccepted: 'desc' },
                        { createdAt: 'desc' },
                    ],
                },
                _count: {
                    select: { votes: true },
                },
            },
        });

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }
}
