'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Headphones, Clock, AlertCircle } from 'lucide-react';
import styles from './viewer.module.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import LiveChat from '@/components/live/LiveChat';
import api from '@/lib/axios';
import {
    LiveKitRoom,
    RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface LiveSession {
    id: string;
    title: string;
    audioUrl: string;
    createdAt: string;
}

export default function LiveViewer() {
    const { scholarId } = useParams();
    const lkServerUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://89.167.127.36:7880';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [lkToken, setLkToken] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);
    const [pastSessions, setPastSessions] = useState<LiveSession[]>([]);
    const { user } = useAuthStore();

    // Fetch view token
    useEffect(() => {
        const fetchToken = async () => {
            if (!scholarId) return;
            try {
                setConnecting(true);
                const { data } = await api.get(`/live/view-token/${scholarId}`);
                setLkToken(data.token);
                setConnecting(false);
            } catch (err) {
                console.error('Failed to fetch view token:', err);
                setError('Could not join live stream. The scholar might not be live.');
                setConnecting(false);
            }
        };
        fetchToken();
    }, [scholarId]);

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
                    🎙️ Live Audio Session
                </h1>

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
                                {lkToken ? (
                                    <LiveKitRoom
                                        video={false}
                                        audio={true}
                                        token={lkToken}
                                        serverUrl={lkServerUrl}
                                        connect={true}
                                        onDisconnected={() => setIsPlaying(false)}
                                        onConnected={() => setIsPlaying(true)}
                                    >
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
                                    </LiveKitRoom>
                                ) : (
                                    <>
                                        <div className={styles.audioIconWrapper}>
                                            <Headphones size={56} />
                                        </div>
                                        <canvas
                                            ref={canvasRef}
                                            width={600}
                                            height={200}
                                            className={styles.audioCanvas}
                                        />
                                    </>
                                )}
                                <p className={styles.audioLabel}>
                                    {isPlaying ? '🎙️ Audio Stream — Playing' : 'Waiting for audio stream...'}
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
                                            <audio controls src={session.audioUrl} className={styles.audioPlayer} preload="none" />
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
            </div>
        </DashboardLayout>
    );
}
