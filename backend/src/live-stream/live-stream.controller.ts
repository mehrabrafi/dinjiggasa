import { Controller, Get, Post, Param, Req, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LiveStreamService } from './live-stream.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';

import { diskStorage } from 'multer';
import { extname } from 'path';

const MAX_VOICE_SIZE = 1000 * 1024 * 1024;  // Increased to 1GB for ultra-long sessions
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
            title: info?.title,
            description: info?.description,
            streamType: info?.streamType || 'audio',
        };
    }

    /** GET /api/v1/live/token — get a LiveKit access token for the scholar */
    @Get('token')
    @UseGuards(JwtAuthGuard)
    async getToken(@Req() req: any) {
        const scholarId = req.user.id || req.user.sub;
        const userName = req.user.name || 'Scholar';
        // When going live, the scholar is the room owner and publisher
        return {
            token: await this.liveStreamService.generateToken(scholarId, userName, true),
        };
    }

    /** GET /api/v1/live/view-token/:scholarId — get a LiveKit access token for a viewer */
    @Get('view-token/:scholarId')
    async getViewerToken(
        @Param('scholarId') scholarId: string,
        @Query('userId') userId?: string,
        @Query('userName') userName?: string,
    ) {
        const identity = userId || `anon-${Math.floor(Math.random() * 100000)}`;
        const participantName = userName || `Audience_${Math.floor(Math.random() * 10000)}`;
        return {
            token: await this.liveStreamService.generateToken(scholarId, participantName, false, identity),
        };
    }

    /** POST /api/v1/live/go-live — mark the authenticated scholar as live */
    @Post('go-live')
    @UseGuards(JwtAuthGuard)
    goLive(@Req() req: any, @Body() body: { title?: string; description?: string; streamType?: string }) {
        const scholarId = req.user.id || req.user.sub;
        this.liveStreamService.goLive(scholarId, `http-${scholarId}`, body.title, body.description, body.streamType);
        return { success: true };
    }

    /** POST /api/v1/live/go-offline — mark the authenticated scholar as offline */
    @Post('go-offline')
    @UseGuards(JwtAuthGuard)
    goOffline(@Req() req: any) {
        const scholarId = req.user.id || req.user.sub;
        this.liveStreamService.goOffline(scholarId);
        this.liveStreamService.clearRaisedHands(scholarId);
        return { success: true };
    }

    // ─── Raise Hand / Speaker Management ────────────────────────────

    /** POST /api/v1/live/raise-hand — viewer raises hand to speak */
    @Post('raise-hand')
    raiseHand(@Body() body: { roomName: string; participantIdentity: string; participantName: string }) {
        return this.liveStreamService.raiseHand(body.roomName, body.participantIdentity, body.participantName);
    }

    /** POST /api/v1/live/lower-hand — viewer lowers hand */
    @Post('lower-hand')
    lowerHand(@Body() body: { roomName: string; participantIdentity: string }) {
        this.liveStreamService.lowerHand(body.roomName, body.participantIdentity);
        return { success: true };
    }

    /** GET /api/v1/live/raised-hands/:roomName — get all raised hands for a room (scholar only) */
    @Get('raised-hands/:roomName')
    @UseGuards(JwtAuthGuard)
    getRaisedHands(@Param('roomName') roomName: string) {
        return this.liveStreamService.getRaisedHands(roomName);
    }

    /** POST /api/v1/live/grant-publish — scholar grants publish permission to a viewer */
    @Post('grant-publish')
    @UseGuards(JwtAuthGuard)
    async grantPublish(@Body() body: { roomName: string; participantIdentity: string }) {
        return this.liveStreamService.grantPublish(body.roomName, body.participantIdentity);
    }

    /** POST /api/v1/live/revoke-publish — scholar revokes publish permission from a viewer */
    @Post('revoke-publish')
    @UseGuards(JwtAuthGuard)
    async revokePublish(@Body() body: { roomName: string; participantIdentity: string }) {
        return this.liveStreamService.revokePublish(body.roomName, body.participantIdentity);
    }

    /** POST /api/v1/live/upload-recording — upload the recorded stream */
    @UseGuards(JwtAuthGuard)
    @Post('upload-recording')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
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

        // Cleanup temp file after upload
        if (file.path) {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.warn('Failed to cleanup temp upload file:', err);
            }
        }

        // Get current live info to use original title
        const liveInfo = this.liveStreamService.getLiveInfo(scholarId);
        const title = liveInfo?.title || `Live Session - ${new Date().toLocaleDateString()}`;

        // Save session to Prisma
        const session = await this.prisma.liveSession.create({
            data: {
                title,
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
