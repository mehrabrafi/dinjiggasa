import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('live')
export class LiveStreamController {
    constructor(private readonly liveStreamService: LiveStreamService) { }

    /** GET /api/v1/live/scholars — returns all currently live scholars */
    @Get('scholars')
    async getLiveScholars() {
        return this.liveStreamService.getLiveScholars();
    }

    /** GET /api/v1/live/status/:scholarId — check if a specific scholar is live */
    @Get('status/:scholarId')
    getScholarLiveStatus(@Param('scholarId') scholarId: string) {
        const isLive = this.liveStreamService.isLive(scholarId);
        const info = this.liveStreamService.getLiveInfo(scholarId);
        return {
            scholarId,
            isLive,
            startedAt: info?.startedAt || null,
            viewerCount: info?.viewerCount || 0,
        };
    }

    /** POST /api/v1/live/go-live — mark the authenticated scholar as live */
    @Post('go-live')
    @UseGuards(JwtAuthGuard)
    goLive(@Req() req: any) {
        const scholarId = req.user.id || req.user.sub;
        this.liveStreamService.goLive(scholarId, `http-${scholarId}`);
        return { success: true };
    }

    /** POST /api/v1/live/go-offline — mark the authenticated scholar as offline */
    @Post('go-offline')
    @UseGuards(JwtAuthGuard)
    goOffline(@Req() req: any) {
        const scholarId = req.user.id || req.user.sub;
        this.liveStreamService.goOffline(scholarId);
        return { success: true };
    }
}
