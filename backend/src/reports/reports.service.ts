import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reason: dto.reason,
        details: dto.details,
        status: 'PENDING',
        reporterId,
        questionId: dto.questionId,
        answerId: dto.answerId,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        reporter: {
          select: { name: true, email: true },
        },
        question: {
          select: {
            title: true,
            id: true,
            author: {
              select: { id: true, name: true, isBanned: true },
            },
          },
        },
        answer: {
          select: {
            content: true,
            id: true,
            author: {
              select: { id: true, name: true, isBanned: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.delete({ where: { id } });
  }
}
