'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Play, Square, AlertCircle, Headphones, Settings, LogOut } from 'lucide-react';
import styles from './live.module.css';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import LiveChat from '@/components/live/LiveChat';
import {
    LiveKitRoom,
    AudioTrack,
    ControlBar,
    RoomAudioRenderer,
    useTracks,
    TrackLoop,
    GridLayout
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

export default function ScholarLiveStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [status, setStatus] = useState<string>('Ready to start');
    const { user } = useAuthStore();
    const scholarId = user?.id || '12345';

    // Get the signalling URL for this scholar's stream (with ?direction=send for ingest)
    const getSignallingUrl = () => {
        return `wss://livekit.deenjiggasa.info/app/${scholarId}?direction=send`;
    };

    // Initialize audio-only media
    const initMedia = useCallback(async () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 48000,
                },
            });

            setMediaStream(stream);
            startAudioVisualizer(stream);
            setStatus('Ready to start');
        } catch (err) {
            console.error('Error accessing microphone.', err);
            setStatus('Error: Microphone permissions denied');
        }
    }, []);

    useEffect(() => {
        initMedia();

        return () => {
            stopStreaming();
        };
    }, []);

    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mediaStream]);

    // Prevent accidental page close while uploading
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isUploading]);

    // Audio Visualizer
    const startAudioVisualizer = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const draw = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
                const hue = (i / bufferLength) * 120 + 140; // teal-blue gradient
                ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.9)`;
                const radius = Math.min(barWidth / 2, 4);

                // Draw rounded bars from the bottom
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

    const toggleAudio = () => {
        if (mediaStream) {
            mediaStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const [lkToken, setLkToken] = useState<string | null>(null);
    const lkServerUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.deenjiggasa.info';

    const startStreaming = useCallback(async () => {
        try {
            setStatus('Getting access token...');
            const { data } = await api.get('/live/token');
            setLkToken(data.token);
            setIsStreaming(true);
            setStatus('🔴 Live');

            // Notify backend
            try {
                await api.post('/live/go-live');
            } catch (e) {
                console.warn('[LiveStream] Could not notify backend go-live:', e);
            }
        } catch (err) {
            console.error('[LiveStream] Error fetching token:', err);
            setStatus('Error: Failed to get streaming token');
        }
    }, []);

    const stopStreaming = useCallback(async () => {
        setLkToken(null);
        setIsStreaming(false);
        setStatus('Ready to start');

        try {
            await api.post('/live/go-offline');
        } catch (e) {
            console.warn('[LiveStream] Could not notify backend go-offline:', e);
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>🎙️ Audio Live Studio</h1>
                <div className={styles.statusBadge} data-streaming={isStreaming}>
                    <div className={styles.statusDot}></div>
                    {status}
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.leftCol}>
                    <div className={styles.streamContainer}>
                        {status.includes('Error') && (
                            <div className={styles.errorOverlay}>
                                <AlertCircle className={styles.alertIcon} size={40} />
                                <p>{status}</p>
                            </div>
                        )}

                        <div className={styles.audioVisualizerContainer}>
                            {lkToken ? (
                                <LiveKitRoom
                                    video={false}
                                    audio={true}
                                    token={lkToken}
                                    serverUrl={lkServerUrl}
                                    connect={true}
                                >
                                    <div className={styles.audioIcon}>
                                        <Headphones size={64} />
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
                                    <div className={styles.audioIcon}>
                                        <Headphones size={64} />
                                    </div>
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={200}
                                        className={styles.audioCanvas}
                                    />
                                </>
                            )}
                            <p className={styles.audioModeLabel}>
                                {isStreaming ? '🔴 Audio Stream — Live' : 'Audio Only Mode'}
                            </p>
                        </div>

                        <div className={styles.controlsOverlay}>
                            <div className={styles.mediaControls}>
                                <button onClick={toggleAudio} className={styles.controlBtn} title={isAudioMuted ? "Unmute mic" : "Mute mic"}>
                                    {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>
                            </div>

                            <div className={styles.actionControls}>
                                {isUploading && (
                                    <div className={styles.uploadProgressWrapper}>
                                        <div className={styles.progressBarBg}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <span className={styles.progressText}>Uploading: {uploadProgress}%</span>
                                    </div>
                                )}
                                {!isStreaming ? (
                                    <button onClick={startStreaming} className={styles.startBtn} disabled={isUploading}>
                                        <Play size={20} /> {isUploading ? 'Finalizing...' : 'Start Streaming'}
                                    </button>
                                ) : (
                                    <button onClick={stopStreaming} className={styles.stopBtn}>
                                        <Square size={20} /> End Stream
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <h3>Quick Tips:</h3>
                        <ul>
                            <li>Ensure you have a stable internet connection.</li>
                            <li>Use a headset for better audio quality.</li>
                            <li>Viewers will hear your voice with a beautiful audio visualizer.</li>
                            <li>Your live listening URL will be: <b>{typeof window !== 'undefined' ? window.location.host : 'deenjiggasa.info'}/live/{scholarId}</b></li>
                            <li>Powered by LiveKit — Pro Real-time Audio Streaming!</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <LiveChat
                        scholarId={scholarId}
                        userName={user?.name || 'Scholar'}
                        userId={user?.id || '12345'}
                        isScholar={true}
                    />
                </div>
            </div>
        </div>
    );
}
