import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getUserNotifications(@Req() req: any) {
        const user = req.user;
        return this.notificationsService.getUserNotifications(user.userId);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Req() req: any) {
        const user = req.user;
        return this.notificationsService.markAsRead(id, user.userId);
    }

    @Patch('read-all')
    async markAllAsRead(@Req() req: any) {
        const user = req.user;
        return this.notificationsService.markAllAsRead(user.userId);
    }
}
