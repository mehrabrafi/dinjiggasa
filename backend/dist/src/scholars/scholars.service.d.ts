import { PrismaService } from '../prisma/prisma.service';
export declare class ScholarsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        reputation: number;
        specialization: string | null;
        bio: string | null;
        isVerified: boolean;
    }[]>;
}
