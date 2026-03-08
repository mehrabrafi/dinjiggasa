'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';
import styles from './live-list.module.css';

interface Scholar {
    id: string;
    name: string;
    avatar: string | null;
    specialization: string | null;
    bio: string | null;
    reputation: number;
    isLive?: boolean;
}

export default function LiveListPage() {
    const [liveScholars, setLiveScholars] = useState<Scholar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveScholars = async () => {
            try {
                // In a real scenario, this would be a dedicated backend endpoint like /scholars/live
                // For demonstration, we fetch all and mock the first one as live (just like scholars page)
                const res = await api.get('/scholars');

                const fetchedScholars = res.data.map((scholar: Scholar, index: number) => {
                    if (index === 0 || scholar.id === '12345') {
                        return { ...scholar, isLive: true };
                    }
                    return scholar;
                });

                const currentlyLive = fetchedScholars.filter((s: Scholar) => s.isLive);
                setLiveScholars(currentlyLive);
            } catch (error) {
                console.error('Failed to fetch live scholars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveScholars();

        // Polling to update live status every 30 seconds
        const interval = setInterval(fetchLiveScholars, 30000);
        return () => clearInterval(interval);
    }, []);

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
                                        <Users size={12} /> {Math.floor(Math.random() * 100) + 10}
                                    </div>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.name)}&size=300&background=006D5B&color=fff`}
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
                                        <p className={styles.specialization}>{scholar.specialization}</p>
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
