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
}
