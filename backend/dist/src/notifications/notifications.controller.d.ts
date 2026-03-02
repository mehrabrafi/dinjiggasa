import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any): Promise<({
        sender: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        message: string;
        userId: string;
        questionId: string | null;
        type: string;
        isRead: boolean;
        senderId: string | null;
    })[]>;
    markAsRead(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
