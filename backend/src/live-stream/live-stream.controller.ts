import { Controller, Get, Post, Param, Req, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LiveStreamService } from './live-stream.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { PrismaService } from '../prisma/prisma.service';

const MAX_VOICE_SIZE = 100 * 1024 * 1024;  // 100MB for a live session
const ALLOWED_AUDIO_TYPES = /^(audio|video)\/(mpeg|mp3|wav|ogg|webm|mp4|m4a|aac|x-matroska)(;.*)?$/;

@Controller('live')
export class LiveStreamController {
    constructor(
        private readonly liveStreamService: LiveStreamService,
        private readonly uploadService: UploadService,
        private readonly prisma: PrismaService,
    ) { }

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

    /** POST /api/v1/live/upload-recording — upload the recorded stream */
    @UseGuards(JwtAuthGuard)
    @Post('upload-recording')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: MAX_VOICE_SIZE }
    }))
    async uploadRecording(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: MAX_VOICE_SIZE, message: 'Recording file must be smaller than 100MB' }),
                    new FileTypeValidator({ fileType: ALLOWED_AUDIO_TYPES }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Req() req: any,
    ) {
        const scholarId = req.user.id || req.user.sub;

        // Upload to Cloudflare R2 via UploadService
        const audioUrl = await this.uploadService.uploadFile(file, 'live-sessions');

        // Save session to Prisma
        const session = await this.prisma.liveSession.create({
            data: {
                title: `Live Session - ${new Date().toLocaleDateString()}`,
                audioUrl,
                scholarId,
            }
        });

        return {
            message: 'Recording uploaded successfully',
            session,
        };
    }

    /** GET /api/v1/live/sessions/:scholarId — get past live sessions of a scholar */
    @Get('sessions/:scholarId')
    async getScholarSessions(@Param('scholarId') scholarId: string) {
        return this.prisma.liveSession.findMany({
            where: { scholarId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
