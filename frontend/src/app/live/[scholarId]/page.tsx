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
        analyser.fftSize = 256;
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

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
                const hue = (i / bufferLength) * 120 + 140;
                ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.9)`;
                const radius = Math.min(barWidth / 2, 4);

                const y = canvas.height - barHeight;
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + barWidth - radius, y);
                ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
                ctx.lineTo(x + barWidth, canvas.height);
                ctx.lineTo(x, canvas.height);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.fill();

                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    {liveInfo?.title || '🎙️ Live Audio Session'}
                </h1>
                {liveInfo?.description && (
                    <p className={styles.streamDescription}>
                        {liveInfo.description}
                    </p>
                )}

                {lkToken ? (
                    <LiveKitRoom
                        video={false}
                        audio={false}
                        token={lkToken}
                        serverUrl={lkServerUrl}
                        connect={true}
                        onDisconnected={() => setIsPlaying(false)}
                        onConnected={() => setIsPlaying(true)}
                    >
                        <div className={styles.mainLayout}>
                            <div className={styles.leftCol}>
                                <div className={styles.audioContainer}>
                                    {connecting && (
                                        <div className={styles.connectingOverlay}>
                                            <div className={styles.spinner}></div>
                                            <p>Connecting to audio stream...</p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className={styles.errorOverlay}>
                                            <AlertCircle size={40} className={styles.errorIcon} />
                                            <p>{error}</p>
                                            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                                                Retry Connection
                                            </button>
                                        </div>
                                    )}

                                    <div className={styles.audioVisualizer}>
                                        <div className={styles.audioIconWrapper}>
                                            <Headphones size={56} />
                                        </div>
                                        <canvas
                                            ref={canvasRef}
                                            width={600}
                                            height={200}
                                            className={styles.audioCanvas}
                                        />
                                        <RoomAudioRenderer />
                                        <p className={styles.audioLabel}>
                                            {isPlaying ? '🎙️ Audio Stream — Playing' : `Waiting for stream...`}
                                        </p>
                                    </div>
                                </div>

                                {/* Raise Hand / Speaker Controls */}
                                <ViewerInteraction
                                    handRaised={handRaised}
                                    handleRaiseHand={handleRaiseHand}
                                    setHandRaised={setHandRaised}
                                />

                                <div className={styles.streamInfo}>
                                    <p>🎙️ Audio-only stream — Pro Real-time Audio powered by LiveKit</p>
                                </div>

                                {pastSessions.length > 0 && (
                                    <div className={styles.pastSessionsContainer}>
                                        <h2 className={styles.pastSessionsTitle}>
                                            <Clock size={20} /> Past Live Sessions
                                        </h2>
                                        <div className={styles.sessionList}>
                                            {pastSessions.map((session) => (
                                                <div key={session.id} className={styles.sessionItem}>
                                                    <div className={styles.sessionHeader}>
                                                        <span className={styles.sessionName}>{session.title || 'Live Session'}</span>
                                                        <span className={styles.sessionDate}>
                                                            {new Date(session.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        className={styles.playPastBtn}
                                                        onClick={() => setActiveSession(session)}
                                                    >
                                                        <Play size={18} fill="currentColor" /> Play Recording
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.rightCol}>
                                <LiveChat
                                    scholarId={scholarId as string}
                                    userName={user?.name || `Viewer-${Math.floor(Math.random() * 1000)}`}
                                    userId={user?.id || `anon-${Math.floor(Math.random() * 10000)}`}
                                />
                            </div>
                        </div>
                    </LiveKitRoom>
                ) : (
                    <div className={styles.mainLayout}>
                        <div className={styles.leftCol}>
                            <div className={styles.audioContainer}>
                                {connecting && (
                                    <div className={styles.connectingOverlay}>
                                        <div className={styles.spinner}></div>
                                        <p>Connecting to audio stream...</p>
                                    </div>
                                )}
                                {error && (
                                    <div className={styles.errorOverlay}>
                                        <AlertCircle size={40} className={styles.errorIcon} />
                                        <p>{error}</p>
                                        <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                                            Retry Connection
                                        </button>
                                    </div>
                                )}

                                <div className={styles.audioVisualizer}>
                                    <div className={styles.audioIconWrapper}>
                                        <Headphones size={56} />
                                    </div>
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={200}
                                        className={styles.audioCanvas}
                                    />
                                    <p className={styles.audioLabel}>
                                        Waiting for audio stream...
                                    </p>
                                </div>
                            </div>

                            <div className={styles.streamInfo}>
                                <p>🎙️ Audio-only stream — Pro Real-time Audio powered by LiveKit</p>
                            </div>

                            {pastSessions.length > 0 && (
                                <div className={styles.pastSessionsContainer}>
                                    <h2 className={styles.pastSessionsTitle}>
                                        <Clock size={20} /> Past Live Sessions
                                    </h2>
                                    <div className={styles.sessionList}>
                                        {pastSessions.map((session) => (
                                            <div key={session.id} className={styles.sessionItem}>
                                                <div className={styles.sessionHeader}>
                                                    <span className={styles.sessionName}>{session.title || 'Live Session'}</span>
                                                    <span className={styles.sessionDate}>
                                                        {new Date(session.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button 
                                                    className={styles.playPastBtn}
                                                    onClick={() => setActiveSession(session)}
                                                >
                                                    <Play size={18} fill="currentColor" /> Play Recording
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.rightCol}>
                            <LiveChat
                                scholarId={scholarId as string}
                                userName={user?.name || `Viewer-${Math.floor(Math.random() * 1000)}`}
                                userId={user?.id || `anon-${Math.floor(Math.random() * 10000)}`}
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {activeSession && scholar && (
                        <AudioPlayer 
                            session={{
                                id: activeSession.id,
                                title: activeSession.title,
                                audioUrl: activeSession.audioUrl,
                                duration: null, // We can calculate this or fetch it
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
