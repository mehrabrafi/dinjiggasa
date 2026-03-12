import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  AccessToken, 
  RoomServiceClient, 
  EgressClient, 
  IngressClient,
  IngressInput,
  CreateIngressOptions,
  EncodedFileOutput, 
  S3Upload, 
  EncodingOptionsPreset 
} from 'livekit-server-sdk';
export interface LiveScholarInfo {
  scholarId: string;
  clientId: string;
  startedAt: Date;
  viewerCount: number;
  title?: string;
  description?: string;
  streamType?: string;
  isObsMode?: boolean;
}

export interface RaisedHandInfo {
  participantIdentity: string;
  participantName: string;
  raisedAt: Date;
}

@Injectable()
export class LiveStreamService {
  // In-memory map: scholarId -> LiveScholarInfo
  private liveScholars: Map<string, LiveScholarInfo> = new Map();
  // Map clientId -> scholarId for disconnect cleanup
  private clientToScholar: Map<string, string> = new Map();
  // Map roomName -> raised hands
  private raisedHands: Map<string, RaisedHandInfo[]> = new Map();
  // LiveKit RoomServiceClient for updating participant permissions
  private roomService: RoomServiceClient;
  // LiveKit EgressClient for recording streams
  private egressClient: EgressClient;
  // LiveKit IngressClient for OBS streams
  private ingressClient: IngressClient;
  // Map scholarId -> egressId to stop recording
  private roomEgress: Map<string, string> = new Map();
  // Map scholarId -> ingressId
  private roomIngress: Map<string, string> = new Map();

  constructor(private prisma: PrismaService) {
    const lkUrl = process.env.LIVEKIT_URL || 'https://livekit.deenjiggasa.info';
    // API server needs https/http, not wss/ws
    const lkHost = lkUrl.replace('wss://', 'https://').replace('ws://', 'http://');
    
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret =
      process.env.LIVEKIT_API_SECRET ||
      'secretsecretsecretsecretsecretsecretsecret';
      
    this.roomService = new RoomServiceClient(lkHost, apiKey, apiSecret);
    this.egressClient = new EgressClient(lkHost, apiKey, apiSecret);
    this.ingressClient = new IngressClient(lkHost, apiKey, apiSecret);
  }

  /** Mark a scholar as live */
  async goLive(
    scholarId: string,
    clientId: string,
    title?: string,
    description?: string,
    streamType: string = 'audio',
    seriesId?: string,
    isObsMode: boolean = false,
  ) {
    this.liveScholars.set(scholarId, {
      scholarId,
      clientId,
      startedAt: new Date(),
      viewerCount: 0,
      title,
      description,
      streamType,
      isObsMode,
    });
    this.clientToScholar.set(clientId, scholarId);
    console.log(
      `[LiveStream] Scholar ${scholarId} is now LIVE (${streamType}) with title: ${title}`,
    );

    // Ensure the room exists on LiveKit
    try {
      await this.roomService.createRoom({
        name: scholarId,
        emptyTimeout: 10 * 60,
        maxParticipants: 100,
      });
      
      const fileExt = 'mp4';
      const timestamp = Date.now();
      const fileName = `live-recordings/${scholarId}-${timestamp}.${fileExt}`;
      const bucketName = process.env.R2_BUCKET_NAME || 'deenjiggasa';
      
      const egressInfo = await this.egressClient.startRoomCompositeEgress(
        scholarId,
        new EncodedFileOutput({
          filepath: fileName,
          output: {
            case: 's3',
            value: new S3Upload({
              accessKey: process.env.R2_ACCESS_KEY_ID,
              secret: process.env.R2_SECRET_ACCESS_KEY,
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT,
              bucket: bucketName,
            }),
          },
        }),
        {
          layout: 'grid',
          encodingOptions: streamType === 'video' ? EncodingOptionsPreset.H264_720P_30 : undefined,
          audioOnly: streamType !== 'video',
          videoOnly: false,
        }
      );
      
      this.roomEgress.set(scholarId, egressInfo.egressId);
      
      const publicUrl = process.env.R2_PUBLIC_URL || 'https://media.deenjiggasa.info';
      
      // Save session in DB
      await this.prisma.liveSession.create({
        data: {
          scholarId,
          title: title || 'Live Session',
          description,
          audioUrl: streamType === 'audio' ? `${publicUrl}/${fileName}` : null,
          videoUrl: streamType === 'video' ? `${publicUrl}/${fileName}` : null,
          type: streamType.toUpperCase(),
          seriesId: seriesId || null,
        }
      });

      // Update series episode count
      if (seriesId) {
        await this.prisma.series.update({
          where: { id: seriesId },
          data: { episodeCount: { increment: 1 } }
        });
      }
      
    } catch (err) {
      console.error(`[LiveStream] Failed to start egress for ${scholarId}:`, err);
    }
  }

  /** Mark a scholar as offline by scholarId */
  async goOffline(scholarId: string) {
    const info = this.liveScholars.get(scholarId);
    if (info) {
      this.clientToScholar.delete(info.clientId);
    }
    this.liveScholars.delete(scholarId);
    
    const egressId = this.roomEgress.get(scholarId);
    if (egressId) {
      try {
        await this.egressClient.stopEgress(egressId);
      } catch (e) {
        console.error(`[LiveStream] could not stop egress:`, e);
      }
      this.roomEgress.delete(scholarId);
    }
    
    console.log(`[LiveStream] Scholar ${scholarId} went OFFLINE`);
  }

  /** Mark a scholar as offline by clientId (used on disconnect) */
  async goOfflineByClientId(clientId: string) {
    const scholarId = this.clientToScholar.get(clientId);
    if (scholarId) {
      this.liveScholars.delete(scholarId);
      this.clientToScholar.delete(clientId);
      
      const egressId = this.roomEgress.get(scholarId);
      if (egressId) {
        try {
          await this.egressClient.stopEgress(egressId);
        } catch (e) {
          console.error(`[LiveStream] could not stop egress:`, e);
        }
        this.roomEgress.delete(scholarId);
      }
      
      console.log(
        `[LiveStream] Scholar ${scholarId} went OFFLINE (client disconnected)`,
      );
    }
  }

  /** Check if a scholar is currently live */
  isLive(scholarId: string): boolean {
    return this.liveScholars.has(scholarId);
  }

  /** Get all currently live scholar IDs */
  getLiveScholarIds(): string[] {
    return Array.from(this.liveScholars.keys());
  }

  /** Get live info for a specific scholar */
  getLiveInfo(scholarId: string): LiveScholarInfo | undefined {
    return this.liveScholars.get(scholarId);
  }

  /** Get all currently live scholars with their user profiles */
  async getLiveScholars() {
    const liveIds = this.getLiveScholarIds();

    if (liveIds.length === 0) {
      return [];
    }

    const scholars = await this.prisma.user.findMany({
      where: {
        id: { in: liveIds },
        role: { in: ['SCHOLAR', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        specialization: true,
        bio: true,
        reputation: true,
      },
    });

    // Attach live metadata
    return scholars.map((scholar) => {
      const liveInfo = this.liveScholars.get(scholar.id);
      return {
        ...scholar,
        isLive: true,
        startedAt: liveInfo?.startedAt,
        viewerCount: liveInfo?.viewerCount || 0,
        title: liveInfo?.title,
        description: liveInfo?.description,
        streamType: liveInfo?.streamType || 'audio',
      };
    });
  }

  /** Increment viewer count for a scholar */
  addViewer(scholarId: string) {
    const info = this.liveScholars.get(scholarId);
    if (info) {
      info.viewerCount++;
      this.liveScholars.set(scholarId, info);
    }
  }

  /** Decrement viewer count for a scholar */
  removeViewer(scholarId: string) {
    const info = this.liveScholars.get(scholarId);
    if (info && info.viewerCount > 0) {
      info.viewerCount--;
      this.liveScholars.set(scholarId, info);
    }
  }

  /** Generate a LiveKit access token for a room */
  async generateToken(
    roomName: string,
    participantName: string,
    isPublisher: boolean,
    identity?: string,
  ) {
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret =
      process.env.LIVEKIT_API_SECRET ||
      'secretsecretsecretsecretsecretsecretsecret';

    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity || participantName,
      name: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isPublisher,
      canSubscribe: true,
      canPublishData: true,
    });

    return at.toJwt();
  }

  // ─── Raise Hand / Speaker Management ────────────────────────────

  /** Viewer raises their hand to ask a question */
  raiseHand(
    roomName: string,
    participantIdentity: string,
    participantName: string,
  ) {
    const hands = this.raisedHands.get(roomName) || [];
    // Don't add duplicates
    if (hands.some((h) => h.participantIdentity === participantIdentity)) {
      return { alreadyRaised: true };
    }
    hands.push({ participantIdentity, participantName, raisedAt: new Date() });
    this.raisedHands.set(roomName, hands);
    console.log(
      `[LiveStream] ${participantName} raised hand in room ${roomName}`,
    );
    return { success: true };
  }

  /** Remove hand (viewer lowers hand or scholar dismisses) */
  lowerHand(roomName: string, participantIdentity: string) {
    const hands = this.raisedHands.get(roomName) || [];
    this.raisedHands.set(
      roomName,
      hands.filter((h) => h.participantIdentity !== participantIdentity),
    );
  }

  /** Get all raised hands for a room */
  getRaisedHands(roomName: string): RaisedHandInfo[] {
    return this.raisedHands.get(roomName) || [];
  }

  /** Grant canPublish to a participant (promote to speaker) */
  async grantPublish(roomName: string, participantIdentity: string) {
    try {
      await this.roomService.updateParticipant(
        roomName,
        participantIdentity,
        undefined,
        {
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
        },
      );
      // Remove from raised hands
      this.lowerHand(roomName, participantIdentity);
      console.log(
        `[LiveStream] Granted publish to ${participantIdentity} in room ${roomName}`,
      );
      return { success: true };
    } catch (err) {
      console.error(`[LiveStream] Failed to grant publish:`, err);
      return { success: false, error: err.message };
    }
  }

  /** Revoke canPublish from a participant (demote back to listener) */
  async revokePublish(roomName: string, participantIdentity: string) {
    try {
      await this.roomService.updateParticipant(
        roomName,
        participantIdentity,
        undefined,
        {
          canPublish: false,
          canSubscribe: true,
          canPublishData: true,
        },
      );
      console.log(
        `[LiveStream] Revoked publish from ${participantIdentity} in room ${roomName}`,
      );
      return { success: true };
    } catch (err) {
      console.error(`[LiveStream] Failed to revoke publish:`, err);
      return { success: false, error: err.message };
    }
  }

  /** Clear all raised hands for a room (when stream ends) */
  clearRaisedHands(roomName: string) {
    this.raisedHands.delete(roomName);
  }

  /** Create/Get an Ingress for OBS streaming */
  async createIngress(scholarId: string, roomName: string) {
    console.log(`[LiveStream] Ingress request - Scholar: ${scholarId}, Room: ${roomName}`);
    
    try {
      // Find existing ingress for this room
      const ingresses = await this.ingressClient.listIngress({ roomName });
      
      if (ingresses.length > 0) {
        // Find first one that has a URL
        const existing = ingresses.find(i => !!i.url && !!i.streamKey);
        if (existing) {
          console.log(`[LiveStream] Found valid existing ingress: ${existing.ingressId}`);
          return { url: existing.url, streamKey: existing.streamKey };
        }
      }

      console.log(`[LiveStream] No valid ingress found, creating new one...`);
      const ingress = await this.ingressClient.createIngress(
        IngressInput.RTMP_INPUT,
        {
          name: `scholar-${scholarId}`,
          roomName: roomName,
          participantIdentity: scholarId,
          participantName: 'Scholar (OBS)',
        }
      );

      let url = ingress.url;
      if (!url) {
        console.warn(`[LiveStream] Ingress created but URL is empty! Using fallback.`);
        const lkPublicUrl = process.env.LIVEKIT_URL || 'wss://livekit.deenjiggasa.info';
        const host = lkPublicUrl.replace('wss://', '').replace('ws://', '').split(':')[0];
        url = `rtmp://${host}/live`;
      }

      console.log(`[LiveStream] Ingress ready: ${url}`);
      this.roomIngress.set(scholarId, ingress.ingressId);
      return {
        url: url,
        streamKey: ingress.streamKey,
      };
    } catch (err) {
      console.error(`[LiveStream] Failed to create/list ingress:`, err);
      throw err;
    }
  }
}
