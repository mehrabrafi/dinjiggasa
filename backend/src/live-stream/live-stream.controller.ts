import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('live')
export class LiveStreamController {
  constructor(
    private readonly liveStreamService: LiveStreamService,
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

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
  async getToken(@Req() req: any, @Query('isBrowserManager') isBrowserManager?: string) {
    const scholarId = req.user.id || req.user.sub;
    const userName = req.user.name || 'Scholar';
    
    // Identity must be unique, but roomName must be consistent
    const identity = isBrowserManager === 'true' ? `${scholarId}-manager` : scholarId;

    return {
      token: await this.liveStreamService.generateToken(
        scholarId, // roomName
        userName,
        true,
        identity,
      ),
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
    const participantName =
      userName || `Audience_${Math.floor(Math.random() * 10000)}`;
    return {
      token: await this.liveStreamService.generateToken(
        scholarId,
        participantName,
        false,
        identity,
      ),
    };
  }

  /** POST /api/v1/live/go-live — mark the authenticated scholar as live */
  @Post('go-live')
  @UseGuards(JwtAuthGuard)
  goLive(
    @Req() req: any,
    @Body() body: { title?: string; description?: string; streamType?: string; seriesId?: string },
  ) {
    const scholarId = req.user.id || req.user.sub;
    this.liveStreamService.goLive(
      scholarId,
      `http-${scholarId}`,
      body.title,
      body.description,
      body.streamType,
      body.seriesId,
    );
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
  raiseHand(
    @Body()
    body: {
      roomName: string;
      participantIdentity: string;
      participantName: string;
    },
  ) {
    return this.liveStreamService.raiseHand(
      body.roomName,
      body.participantIdentity,
      body.participantName,
    );
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
  async grantPublish(
    @Body() body: { roomName: string; participantIdentity: string },
  ) {
    return this.liveStreamService.grantPublish(
      body.roomName,
      body.participantIdentity,
    );
  }

  /** POST /api/v1/live/revoke-publish — scholar revokes publish permission from a viewer */
  @Post('revoke-publish')
  @UseGuards(JwtAuthGuard)
  async revokePublish(
    @Body() body: { roomName: string; participantIdentity: string },
  ) {
    return this.liveStreamService.revokePublish(
      body.roomName,
      body.participantIdentity,
    );
  }

  /** GET /api/v1/live/sessions/:scholarId — get past live sessions of a scholar */
  @Get('sessions/:scholarId')
  async getScholarSessions(@Param('scholarId') scholarId: string) {
    return this.prisma.liveSession.findMany({
      where: { scholarId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** GET /api/v1/live/overview — returns live and past sessions for home page */
  @Get('overview')
  async getOverview() {
    const live = await this.liveStreamService.getLiveScholars();
    const past = await this.prisma.liveSession.findMany({
      include: { scholar: true },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit for home page
    });
    return { live, past };
  }

  /** GET /api/v1/live/series — returns all series */
  @Get('series')
  async getSeries() {
    return this.prisma.series.findMany({
      include: { scholar: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** GET /api/v1/live/series/my — returns series owned by authenticated scholar */
  @Get('series/my')
  @UseGuards(JwtAuthGuard)
  async getMySeries(@Req() req: any) {
    const scholarId = req.user.id || req.user.sub;
    return this.prisma.series.findMany({
      where: { scholarId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** GET /api/v1/live/series/:id — returns a specific series with its sessions */
  @Get('series/:id')
  async getSeriesById(@Param('id') id: string) {
    return this.prisma.series.findUnique({
      where: { id },
      include: {
        scholar: true,
        sessions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /** POST /api/v1/live/series — create a new series */
  @Post('series')
  @UseGuards(JwtAuthGuard)
  async createSeries(
    @Req() req: any,
    @Body() body: { title: string; description?: string; category?: string; thumbnailUrl?: string },
  ) {
    const scholarId = req.user.id || req.user.sub;
    return this.prisma.series.create({
      data: {
        ...body,
        scholarId,
      },
    });
  }

  /** POST /api/v1/live/ingress — create/get OBS stream keys */
  @Post('ingress')
  @UseGuards(JwtAuthGuard)
  async getIngress(@Req() req: any) {
    const scholarId = req.user.id || req.user.sub;
    return this.liveStreamService.createIngress(scholarId, scholarId);
  }
}
