'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Play, 
    ArrowLeft, 
    Clock, 
    Calendar, 
    Video, 
    Volume2, 
    X,
    CheckCircle2
} from 'lucide-react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import styles from '../series-detail.module.css';

interface Session {
    id: string;
    title: string;
    description: string | null;
    audioUrl: string | null;
    duration: number | null;
    createdAt: string;
}

interface Series {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    scholar: {
        id: string;
        name: string;
        avatar: string | null;
    };
    sessions: Session[];
}

export default function SeriesDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [series, setSeries] = useState<Series | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const { data } = await api.get(`/live/series/${id}`);
                setSeries(data);
            } catch (err) {
                console.error('Failed to fetch series:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSeries();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading series details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!series) {
        return (
            <DashboardLayout>
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <h2>Series not found</h2>
                    <button onClick={() => router.back()} className={styles.playBtn} style={{ marginTop: '1rem', width: 'auto', borderRadius: '8px', padding: '0 1.5rem' }}>
                        Go Back
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout>
            <div className={styles.layout}>
                {/* Hero Section */}
                <div className={styles.hero}>
                    <img 
                        src={series.thumbnailUrl || '/assets/images/mock/seerah.png'} 
                        className={styles.heroBg} 
                        alt={series.title} 
                    />
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.heroContent}>
                        <button onClick={() => router.back()} className={styles.createSeriesBtn} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={18} /> Back to Live
                        </button>
                        <span className={styles.categoryBadge}>{series.category || 'General'}</span>
                        <h1 className={styles.title}>{series.title}</h1>
                        <p className={styles.description}>{series.description}</p>
                        <div className={styles.scholarRow}>
                            <img 
                                src={series.scholar.avatar || `https://ui-avatars.com/api/?name=${series.scholar.name}`} 
                                className={styles.scholarAvatar} 
                                alt={series.scholar.name} 
                            />
                            <div>
                                <div className={styles.scholarName}>{series.scholar.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Verified Scholar</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Episodes Section */}
                <div className={styles.episodesSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Series Episodes</h2>
                        <span className={styles.episodeCount}>{series.sessions.length} Episodes</span>
                    </div>

                    <div className={styles.episodesList}>
                        {series.sessions.map((session, index) => (
                            <div 
                                key={session.id} 
                                className={styles.episodeCard}
                                onClick={() => setActiveSession(session)}
                            >
                                <div className={styles.episodeIndex}>{(index + 1).toString().padStart(2, '0')}</div>
                                <div className={styles.episodeInfo}>
                                    <h3 className={styles.episodeTitle}>{session.title}</h3>
                                    <div className={styles.episodeMeta}>
                                        <div className={styles.metaItem}>
                                            <Volume2 size={14} />
                                            Audio
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Clock size={14} />
                                            {formatDuration(session.duration)}
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Calendar size={14} />
                                            {formatDate(session.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', color: '#64748b', fontSize: '0.875rem' }}>
                                    Recorded Session
                                </div>
                                <button className={styles.playBtn}>
                                    <Play size={20} fill="white" />
                                </button>
                            </div>
                        ))}

                        {series.sessions.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                This series doesn't have any episodes yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Player Overlay */}
            {activeSession && (
                <div className={styles.playerOverlay}>
                    <div className={styles.playerContainer}>
                        <button 
                            className={styles.closePlayer}
                            onClick={() => setActiveSession(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className={styles.audioPlayerWrapper}>
                            <div className={styles.nowPlayingIcon}>
                                <Volume2 size={40} />
                            </div>
                            <div className={styles.nowPlayingInfo}>
                                <h3 className={styles.nowPlayingTitle}>{activeSession.title}</h3>
                                <p className={styles.nowPlayingScholar}>by {series.scholar.name}</p>
                            </div>
                            {activeSession.audioUrl ? (
                                <audio 
                                    src={activeSession.audioUrl} 
                                    controls 
                                    autoPlay 
                                    className={styles.customAudio}
                                    onError={(e) => {
                                        console.error("Audio playback error:", e);
                                    }}
                                />
                            ) : (
                                <div style={{ padding: '1rem', color: '#f59e0b', textAlign: 'center' }}>
                                    ⏳ Recording is being processed. Please check back shortly.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
