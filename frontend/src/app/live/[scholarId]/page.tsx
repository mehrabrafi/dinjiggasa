'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Headphones, Clock, AlertCircle, Hand, Mic, MicOff, Play } from 'lucide-react';
import styles from './viewer.module.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import LiveChat from '@/components/live/LiveChat';
import api from '@/lib/axios';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useLocalParticipant,
    TrackToggle,
    useTracks
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { AnimatePresence } from 'framer-motion';
import AudioPlayer from '@/components/shared/AudioPlayer/AudioPlayer';
import '@livekit/components-styles';

function ViewerInteraction({
    handRaised,
    handleRaiseHand,
    setHandRaised,
}: {
    handRaised: boolean;
    handleRaiseHand: () => void;
    setHandRaised: (val: boolean) => void;
}) {
    const { localParticipant } = useLocalParticipant();
    const canPublish = localParticipant?.permissions?.canPublish;

    useEffect(() => {
        if (canPublish && handRaised) {
            setHandRaised(false);
            // Automatically turn on microphone when approved
            if (localParticipant) {
                localParticipant.setMicrophoneEnabled(true).catch(err => {
                    console.error('Failed to auto-enable microphone:', err);
                });
            }
        }
    }, [canPublish, handRaised, setHandRaised, localParticipant]);

    if (canPublish) {
        return (
            <div className={styles.speakerControlsContainer}>
                <div className={styles.speakerHeader}>
                    <span className={styles.liveIndicator}>🎙️</span>
                    <span className={styles.speakerTitle}>You are a Speaker</span>
                </div>
                <p className={styles.speakerHint}>
                    The scholar approved your request. Your microphone was turned on automatically! You can toggle it below.
                </p>
                <div className={styles.micToggleWrapper}>
                    <TrackToggle
                        source={Track.Source.Microphone}
                        className={styles.lkTrackToggle}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.raiseHandContainer}>
            <button
                onClick={handleRaiseHand}
                className={`${styles.raiseHandBtn} ${handRaised ? styles.handRaisedActive : ''}`}
                title={handRaised ? 'Lower hand' : 'Raise hand to ask a question'}
            >
                <Hand size={20} />
                {handRaised ? 'Hand Raised ✓' : '✋ Raise Hand to Ask'}
            </button>
            {handRaised && (
                <p className={styles.raiseHandHint}>
                    Waiting for scholar to approve your request...
                </p>
            )}
        </div>
    );
}

interface LiveSession {
    id: string;
    title: string;
    audioUrl: string;
    createdAt: string;
}



import { Share2, Star, Users, MessageCircleQuestion, Heart, ExternalLink, ChevronRight, RotateCcw, RotateCw, Pause, CheckCircle2, MessageSquare } from 'lucide-react';

function LivePlayerContent({ 
    connecting, error, scholar, liveInfo, isPlaying, canvasRef, startAudioVisualizer, listenerCount, pastSessions, setActiveSession
}: any) {
    const remoteTracks = useTracks([{ source: Track.Source.Microphone, withPlaceholder: false }], { onlySubscribed: true });
    
    useEffect(() => {
        const audioTrack = remoteTracks.find(t => (t as any).track?.kind === 'audio');
        if ((audioTrack as any)?.track?.mediaStream) {
            startAudioVisualizer((audioTrack as any).track.mediaStream);
        }
    }, [remoteTracks, startAudioVisualizer]);

    return (
        <>
            {/* Player Card */}
            <div className={styles.playerCard}>
                {(connecting || !isPlaying) && (
                    <div className={styles.connectingOverlay}>
                        <div className={styles.spinner}></div>
                        <p>{connecting ? 'Connecting to stream...' : 'Waiting for scholar to start...'}</p>
                    </div>
                )}
                {error && (
                    <div className={styles.errorOverlay}>
                        <AlertCircle size={40} className={styles.errorIcon} />
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                            Retry
                        </button>
                    </div>
                )}

                <div className={styles.albumArtWrapper}>
                    <img 
                        src={scholar?.avatar || '/assets/images/mock/seerah.png'} 
                        alt={scholar?.name} 
                        className={styles.albumArt} 
                    />
                    <div className={styles.liveBadge}>
                        <div className={styles.liveDot}></div>
                        LIVE
                    </div>
                </div>

                <h1 className={styles.streamTitle}>
                    {liveInfo?.title || 'Understanding the Wisdom of Ramadan'}
                </h1>
                <p className={styles.streamSubtitle}>
                    Audio Q&A with {scholar?.name || 'Scholar Name'}
                </p>

                <div className={styles.visualizerWrapper}>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={80}
                        className={styles.audioCanvas}
                    />
                    <RoomAudioRenderer />
                </div>

                <div className={styles.playerControls}>
                    <button className={styles.controlBtn}><RotateCcw size={24} /></button>
                    <button className={styles.playPauseBtn}>
                        {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: 4 }} />}
                    </button>
                    <button className={styles.controlBtn}><RotateCw size={24} /></button>
                </div>
            </div>

            {/* Scholar Card */}
            {scholar && (
                <div className={styles.scholarCard}>
                    <img 
                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=006D5B&color=fff`} 
                        alt={scholar.name} 
                        className={styles.scholarAvatar} 
                    />
                    <div className={styles.scholarInfo}>
                        <div className={styles.scholarHeader}>
                            <h3 className={styles.scholarName}>{scholar.name}</h3>
                            <CheckCircle2 size={16} className={styles.verifiedBadge} />
                        </div>
                        <p className={styles.scholarTagline}>{scholar.specialization || 'Islamic Jurisprudence & Ethics Expert'}</p>
                        <p className={styles.scholarBio}>
                            {scholar.bio || 'Specializing in the intersection of traditional Islamic law and modern financial systems.'}
                        </p>
                    </div>
                    <div className={styles.scholarActions}>
                        <button className={styles.followBtn}>Follow Scholar</button>
                        <button className={styles.profileBtn}>View Profile</button>
                        <div className={styles.shareBtn}><Share2 size={20} /></div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Listeners</span>
                    <span className={styles.statVal}>{listenerCount.toLocaleString()}</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Duration</span>
                    <span className={styles.statVal}>45:22</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Questions</span>
                    <span className={styles.statVal}>82</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Rating</span>
                    <div className={`${styles.statVal} ${styles.ratingVal}`}>
                        <Star size={20} fill="#f59e0b" /> 4.9
                    </div>
                </div>
            </div>

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
                <div className={styles.pastSessionsContainer} style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
                    <h2 className={styles.pastSessionsTitle}>
                        <Clock size={20} /> Past Live Sessions
                    </h2>
                    <div className={styles.sessionList}>
                        {pastSessions.slice(0, 3).map((session: any) => (
                            <div key={session.id} className={styles.sessionItem}>
                                <div className={styles.sessionHeader}>
                                    <span className={styles.sessionName}>{session.title}</span>
                                    <span className={styles.sessionDate}>{new Date(session.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button className={styles.playPastBtn} onClick={() => setActiveSession(session)}>
                                    <Play size={18} fill="currentColor" /> Play Recording
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default function LiveViewer() {
    const { scholarId } = useParams();
    const lkServerUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.deenjiggasa.info';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [lkToken, setLkToken] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);
    const [pastSessions, setPastSessions] = useState<LiveSession[]>([]);
    const [viewerIdentity, setViewerIdentity] = useState<string>('');
    const [handRaised, setHandRaised] = useState(false);
    const [liveInfo, setLiveInfo] = useState<{ title?: string; description?: string } | null>(null);
    const [scholar, setScholar] = useState<any>(null);
    const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
    const [listenerCount, setListenerCount] = useState(0);
    const { user } = useAuthStore();

    // Fetch view token
    useEffect(() => {
        const fetchToken = async () => {
            if (!scholarId) return;
            try {
                setConnecting(true);
                const identity = user?.id || `anon-${Math.floor(Math.random() * 10000)}`;
                const name = user?.name || `Viewer-${Math.floor(Math.random() * 1000)}`;
                setViewerIdentity(identity);
                const { data } = await api.get(`/live/view-token/${scholarId}?userId=${encodeURIComponent(identity)}&userName=${encodeURIComponent(name)}`);
                setLkToken(data.token);

                // Fetch live info
                const { data: statusData } = await api.get(`/live/status/${scholarId}`);
                if (statusData.isLive) {
                    setLiveInfo({
                        title: statusData.title,
                        description: statusData.description,
                    });
                    setListenerCount(statusData.viewerCount || 0);
                }

                setConnecting(false);
            } catch (err) {
                console.error('Failed to fetch view token:', err);
                setError('Could not join live stream. The scholar might not be live.');
                setConnecting(false);
            }
        };
        const fetchScholar = async () => {
            if (!scholarId) return;
            try {
                const { data } = await api.get(`/scholars/${scholarId}`);
                setScholar(data);
            } catch (err) {
                console.warn('Failed to fetch scholar info:', err);
            }
        };
        fetchToken();
        fetchScholar();

        // Poll for listener count
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get(`/live/status/${scholarId}`);
                if (data.isLive) {
                    setListenerCount(data.viewerCount || 0);
                }
            } catch (e) {}
        }, 5000);

        return () => clearInterval(interval);
    }, [scholarId]);

    // Raise Hand handler
    const handleRaiseHand = async () => {
        if (!scholarId) return;
        try {
            if (handRaised) {
                await api.post('/live/lower-hand', {
                    roomName: scholarId as string,
                    participantIdentity: viewerIdentity,
                });
                setHandRaised(false);
            } else {
                await api.post('/live/raise-hand', {
                    roomName: scholarId as string,
                    participantIdentity: viewerIdentity,
                    participantName: user?.name || 'Anonymous Viewer',
                });
                setHandRaised(true);
            }
        } catch (err) {
            console.error('Failed to raise/lower hand:', err);
        }
    };

    // Fetch past sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get(`/live/sessions/${scholarId}`);
                if (res.data) setPastSessions(res.data);
            } catch (err) {
                console.error('Failed to fetch past sessions:', err);
            }
        };
        fetchSessions();
    }, [scholarId]);

    // Audio visualizer
    const startAudioVisualizer = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Smaller for cleaner bars
        source.connect(analyser);

        const draw = () => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 6;
            const barGap = 4;
            const totalWidth = bufferLength * (barWidth + barGap);
            let x = (canvas.width - totalWidth) / 2;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                
                // Teal gradient as per mockup
                ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#14b8a6';
                
                // Centered bars
                const y = (canvas.height - barHeight) / 2;
                
                // Rounded rectangles
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 4);
                ctx.fill();

                x += barWidth + barGap;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <LiveKitRoom
                    video={false}
                    audio={false}
                    token={lkToken || undefined}
                    serverUrl={lkServerUrl}
                    connect={!!lkToken}
                    onDisconnected={() => setIsPlaying(false)}
                    onConnected={() => setIsPlaying(true)}
                >
                    <div className={styles.mainLayout}>
                        {/* Left Column */}
                        <div className={styles.leftCol}>
                            <LivePlayerContent 
                                connecting={connecting}
                                error={error}
                                scholar={scholar}
                                liveInfo={liveInfo}
                                isPlaying={isPlaying}
                                canvasRef={canvasRef}
                                startAudioVisualizer={startAudioVisualizer}
                                listenerCount={listenerCount}
                                pastSessions={pastSessions}
                                setActiveSession={setActiveSession}
                            />
                        </div>

                        {/* Right Column / Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.sidebarHeader}>
                                <div className={styles.sidebarTitle}>
                                    <MessageSquare size={20} /> Live Interaction
                                </div>
                                <div className={styles.realTimeBadge}>REAL-TIME</div>
                            </div>

                            <div className={styles.sidebarContent}>
                                <LiveChat
                                    scholarId={scholarId as string}
                                    userName={user?.name || `Viewer-${Math.floor(Math.random() * 1000)}`}
                                    userId={user?.id || `anon-${Math.floor(Math.random() * 10000)}`}
                                />
                            </div>

                            <div className={styles.sidebarFooter}>
                                <button className={styles.askBtn}>
                                    <MessageCircleQuestion size={20} /> Ask a Question
                                </button>
                                <div className={styles.supportBox}>
                                    <div className={styles.supportText}>
                                        <h4>Support DinJiggasa</h4>
                                        <p>Keep our streams free and accessible.</p>
                                    </div>
                                    <button className={styles.donateBtn}>Donate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </LiveKitRoom>

                <AnimatePresence>
                    {activeSession && scholar && (
                        <AudioPlayer 
                            session={{
                                id: activeSession.id,
                                title: activeSession.title,
                                audioUrl: activeSession.audioUrl,
                                duration: null,
                                createdAt: activeSession.createdAt
                            }}
                            scholar={{
                                id: scholar.id,
                                name: scholar.name,
                                avatar: scholar.avatar
                            }}
                            relatedSessions={pastSessions.filter(s => s.id !== activeSession.id).map(s => ({
                                id: s.id,
                                title: s.title,
                                audioUrl: s.audioUrl,
                                duration: null,
                                createdAt: s.createdAt
                            }))}
                            onClose={() => setActiveSession(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
