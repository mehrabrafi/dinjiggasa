import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LiveScholarInfo {
    scholarId: string;
    clientId: string;
    startedAt: Date;
    viewerCount: number;
}

@Injectable()
export class LiveStreamService {
    // In-memory map: scholarId -> LiveScholarInfo
    private liveScholars: Map<string, LiveScholarInfo> = new Map();
    // Map clientId -> scholarId for disconnect cleanup
    private clientToScholar: Map<string, string> = new Map();

    constructor(private prisma: PrismaService) { }

    /** Mark a scholar as live */
    goLive(scholarId: string, clientId: string) {
        this.liveScholars.set(scholarId, {
            scholarId,
            clientId,
            startedAt: new Date(),
            viewerCount: 0,
        });
        this.clientToScholar.set(clientId, scholarId);
        console.log(`[LiveStream] Scholar ${scholarId} is now LIVE`);
    }

    /** Mark a scholar as offline by scholarId */
    goOffline(scholarId: string) {
        const info = this.liveScholars.get(scholarId);
        if (info) {
            this.clientToScholar.delete(info.clientId);
        }
        this.liveScholars.delete(scholarId);
        console.log(`[LiveStream] Scholar ${scholarId} went OFFLINE`);
    }

    /** Mark a scholar as offline by clientId (used on disconnect) */
    goOfflineByClientId(clientId: string) {
        const scholarId = this.clientToScholar.get(clientId);
        if (scholarId) {
            this.liveScholars.delete(scholarId);
            this.clientToScholar.delete(clientId);
            console.log(`[LiveStream] Scholar ${scholarId} went OFFLINE (client disconnected)`);
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
}
