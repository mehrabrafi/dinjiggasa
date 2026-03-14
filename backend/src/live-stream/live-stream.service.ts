import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  AccessToken, 
  RoomServiceClient, 
  EgressClient, 
  EncodedFileOutput, 
  S3Upload, 
  EncodingOptionsPreset,
  TrackSource
} from 'livekit-server-sdk';
import { EncodedFileType } from '@livekit/protocol';
export interface LiveScholarInfo {
  scholarId: string;
  clientId: string;
  startedAt: Date;
  viewerCount: number;
  title?: string;
  description?: string;
  category?: string;
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
  // Map scholarId -> egressId to stop recording
  private roomEgress: Map<string, string> = new Map();
  // Map scholarId -> liveSessionId to update audioUrl after egress completes
  private scholarToSession: Map<string, string> = new Map();

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

    // Run cleanup every 10 minutes to prune stale in-memory sessions
    setInterval(() => this.cleanupStaleSessions(), 10 * 60 * 1000);
  }

  /** Prune sessions that no longer have a physical room in LiveKit */
  private async cleanupStaleSessions() {
    try {
      const rooms = await this.roomService.listRooms();
      const activeRoomNames = new Set(rooms.map(r => r.name));
      
      for (const scholarId of this.liveScholars.keys()) {
        if (!activeRoomNames.has(scholarId)) {
          console.log(`[LiveStream] Pruning stale session for scholar: ${scholarId}`);
          await this.goOffline(scholarId);
        }
      }
    } catch (err) {
      console.error('[LiveStream] Cleanup failed:', err);
    }
  }

  /** Mark a scholar as live */
  async goLive(
    scholarId: string,
    clientId: string,
    title?: string,
    description?: string,
    seriesId?: string,
    category?: string,
  ) {
    this.liveScholars.set(scholarId, {
      scholarId,
      clientId,
      startedAt: new Date(),
      viewerCount: 0,
      title,
      description,
      category,
    });
    this.clientToScholar.set(clientId, scholarId);
    console.log(
      `[LiveStream] Scholar ${scholarId} is now LIVE with title: ${title}`,
    );

    // Ensure the room exists on LiveKit
    try {
      await this.roomService.createRoom({
        name: scholarId,
        emptyTimeout: 10 * 60,
        maxParticipants: 100,
      });

      // Generate filename now so audioUrl is available instantly
      const timestamp = Date.now();
      const fileName = `live-recordings/${scholarId}-${timestamp}.ogg`;
      const publicUrl = process.env.R2_PUBLIC_URL || 'https://media.deenjiggasa.info';
      const audioUrl = `${publicUrl}/${fileName}`;

      // Save session in DB with audioUrl set immediately
      const session = await this.prisma.liveSession.create({
        data: {
          scholarId,
          title: title || 'Live Session',
          description,
          audioUrl,
          seriesId: seriesId || null,
          category: category || null,
        }
      });
      this.scholarToSession.set(scholarId, session.id);
      console.log(`[LiveStream] Session created: ${session.id}, audioUrl: ${audioUrl}`);

      // Update series episode count
      if (seriesId) {
        await this.prisma.series.update({
          where: { id: seriesId },
          data: { episodeCount: { increment: 1 } }
        });
      }
      
    } catch (err) {
      console.error(`[LiveStream] Failed to create room/session for ${scholarId}:`, err);
    }
  }

  /**
   * Start Track Composite Egress recording after the scholar has published audio.
   * Called from the frontend after connecting to LiveKit and getting the audio track SID.
   * This uses direct audio pipeline capture (no headless Chrome) for clean recordings.
   */
  async startRecording(scholarId: string, audioTrackId: string) {
    // Don't start if scholar is not live or already recording
    if (!this.isLive(scholarId)) {
      console.warn(`[LiveStream] Scholar ${scholarId} is not live, cannot start recording`);
      return { success: false, error: 'Not live' };
    }
    if (this.roomEgress.has(scholarId)) {
      console.log(`[LiveStream] Egress already running for ${scholarId}`);
      return { success: true, message: 'Already recording' };
    }

    try {
      // Get the audioUrl from the session to extract the filename
      const sessionId = this.scholarToSession.get(scholarId);
      if (!sessionId) {
        console.warn(`[LiveStream] No session found for ${scholarId}`);
        return { success: false, error: 'No session' };
      }

      const session = await this.prisma.liveSession.findUnique({
        where: { id: sessionId },
        select: { audioUrl: true },
      });

      // Extract filename from the audioUrl
      const publicUrl = process.env.R2_PUBLIC_URL || 'https://media.deenjiggasa.info';
      const fileName = session?.audioUrl?.replace(`${publicUrl}/`, '') 
        || `live-recordings/${scholarId}-${Date.now()}.ogg`;
      const bucketName = process.env.R2_BUCKET_NAME || 'deenjiggasa';

      const egressInfo = await this.egressClient.startTrackCompositeEgress(
        scholarId,
        new EncodedFileOutput({
          fileType: EncodedFileType.OGG,
          filepath: fileName,
          disableManifest: true,
          output: {
            case: 's3',
            value: new S3Upload({
              accessKey: process.env.R2_ACCESS_KEY_ID,
              secret: process.env.R2_SECRET_ACCESS_KEY,
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT,
              bucket: bucketName,
              forcePathStyle: true,
            }),
          },
        }),
        {
          audioTrackId,
        }
      );

      this.roomEgress.set(scholarId, egressInfo.egressId);
      console.log(`[LiveStream] Track Composite Egress started: ${egressInfo.egressId} for track ${audioTrackId} in room ${scholarId}`);
      return { success: true, egressId: egressInfo.egressId };
    } catch (err) {
      console.error(`[LiveStream] Failed to start track egress for ${scholarId}:`, err);
      return { success: false, error: String(err) };
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
        const egressResult = await this.egressClient.stopEgress(egressId);
        // Update DB with actual recorded file URL
        await this.updateSessionAudioUrl(scholarId, egressResult);
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
          const egressResult = await this.egressClient.stopEgress(egressId);
          await this.updateSessionAudioUrl(scholarId, egressResult);
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

  /** Update the liveSession audioUrl from the egress result */
  private async updateSessionAudioUrl(scholarId: string, egressResult: any) {
    try {
      const sessionId = this.scholarToSession.get(scholarId);
      if (!sessionId) {
        console.warn(`[LiveStream] No session found for scholar ${scholarId}, cannot update audioUrl`);
        return;
      }

      // Get the actual filename from egress result
      let actualFilename: string | null = null;
      
      // Check file_results first (newer API)
      if (egressResult.fileResults && egressResult.fileResults.length > 0) {
        actualFilename = egressResult.fileResults[0].filename;
      }
      // Fallback to legacy file result
      else if (egressResult.file?.filename) {
        actualFilename = egressResult.file.filename;
      }

      if (actualFilename) {
        const publicUrl = process.env.R2_PUBLIC_URL || 'https://media.deenjiggasa.info';
        const audioUrl = `${publicUrl}/${actualFilename}`;
        
        await this.prisma.liveSession.update({
          where: { id: sessionId },
          data: { audioUrl },
        });
        console.log(`[LiveStream] Updated session ${sessionId} audioUrl to: ${audioUrl}`);
      } else {
        console.warn(`[LiveStream] No filename found in egress result for ${scholarId}`);
        console.log(`[LiveStream] Egress result:`, JSON.stringify(egressResult, null, 2));
      }
      
      this.scholarToSession.delete(scholarId);
    } catch (err) {
      console.error(`[LiveStream] Failed to update session audioUrl:`, err);
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
        scholarId: scholar.id,
        isLive: true,
        startedAt: liveInfo?.startedAt,
        viewerCount: liveInfo?.viewerCount || 0,
        title: liveInfo?.title,
        description: liveInfo?.description,
        category: liveInfo?.category,
        streamType: 'audio',
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
      ttl: '2h',
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
}


