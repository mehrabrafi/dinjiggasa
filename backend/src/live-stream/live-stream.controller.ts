import { Controller, Get, Param } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';

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
}
