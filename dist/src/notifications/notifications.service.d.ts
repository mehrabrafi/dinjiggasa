import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserNotifications(userId: string): Promise<({
        sender: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        questionId: string | null;
        type: string;
        userId: string;
        message: string;
        isRead: boolean;
        senderId: string | null;
    })[]>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
