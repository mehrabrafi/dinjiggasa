import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        reputation: number;
        createdAt: Date;
        updatedAt: Date;
        gender: string | null;
        madhab: string | null;
        specialization: string | null;
        bio: string | null;
        isVerified: boolean;
        urgentQuota: number;
        lastUrgentReset: Date;
    }>;
}
export {};
