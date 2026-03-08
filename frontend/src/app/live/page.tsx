'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';
import styles from './live-list.module.css';

interface LiveScholar {
    id: string;
    name: string;
    avatar: string | null;
    specialization: string | null;
    bio: string | null;
    reputation: number;
    isLive: boolean;
    startedAt: string | null;
    viewerCount: number;
}

export default function LiveListPage() {
    const [liveScholars, setLiveScholars] = useState<LiveScholar[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveScholars = async () => {
        try {
            const res = await api.get('/live/scholars');
            setLiveScholars(res.data);
        } catch (error) {
            console.error('Failed to fetch live scholars:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveScholars();

        // Poll every 15 seconds to keep live status updated
        const interval = setInterval(fetchLiveScholars, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatDuration = (startedAt: string | null) => {
        if (!startedAt) return '';
        const diff = Date.now() - new Date(startedAt).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just started';
        if (minutes < 60) return `${minutes}m live`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m live`;
    };

    return (
        <DashboardLayout>
            <main className={styles.container}>
                <section className={styles.header}>
                    <div className={styles.titleContainer}>
                        <div className={styles.liveIndicator}>
                            <span className={styles.pulse}></span>
                            <Video size={28} color="#ef4444" />
                        </div>
                        <h1 className={styles.title}>Live Streams</h1>
                    </div>
                    <p className={styles.subtitle}>
                        Join interactive live sessions with our esteemed verified scholars in real-time.
                    </p>
                </section>

                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Looking for live sessions...</p>
                    </div>
                ) : liveScholars.length > 0 ? (
                    <div className={styles.grid}>
                        {liveScholars.map((scholar) => (
                            <div key={scholar.id} className={styles.liveCard}>
                                <div className={styles.thumbnailContainer}>
                                    <div className={styles.liveBadge}>LIVE</div>
                                    <div className={styles.viewersBadge}>
                                        <Users size={12} /> {scholar.viewerCount}
                                    </div>
                                    <img
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.name)}&size=300&background=006D5B&color=fff`}
                                        alt={scholar.name}
                                        className={styles.thumbnail}
                                    />
                                    <div className={styles.overlay}>
                                        <Link href={`/live/${scholar.id}`}>
                                            <button className={styles.playBtn}>
                                                <Video size={20} /> Watch Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.cardInfo}>
                                    <img
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.name)}&background=006D5B&color=fff`}
                                        alt={scholar.name}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.scholarDetails}>
                                        <h3 className={styles.scholarName}>{scholar.name}</h3>
                                        <p className={styles.specialization}>
                                            {scholar.specialization}
                                            {scholar.startedAt && (
                                                <span style={{ marginLeft: '0.5rem', color: '#ef4444', fontSize: '0.7rem', fontWeight: 600 }}>
                                                    • {formatDuration(scholar.startedAt)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Video size={48} className={styles.emptyIcon} />
                        <h2>No Live Sessions Right Now</h2>
                        <p>Our scholars are currently offline. Check back later or browse through recorded answers.</p>
                        <Link href="/scholars">
                            <button className={styles.browseBtn}>Browse Scholars</button>
                        </Link>
                    </div>
                )}
            </main>
        </DashboardLayout>
    );
}
