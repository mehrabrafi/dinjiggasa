'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Headphones } from 'lucide-react';
import styles from './viewer.module.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import LiveChat from '@/components/live/LiveChat';

export default function LiveViewer() {
    const { scholarId } = useParams();
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);
    const { user } = useAuthStore();

    // OvenMediaEngine WebRTC playback signalling URL
    const getSignallingUrl = () => {
        return `wss://stream.deenjiggasa.info/app/${scholarId}`;
    };

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

    useEffect(() => {
        let pc: RTCPeerConnection | null = null;
        let ws: WebSocket | null = null;

        const connectToStream = () => {
            setConnecting(true);
            setError(null);

            const signallingUrl = getSignallingUrl();
            console.log('[Viewer] Connecting to:', signallingUrl);

            ws = new WebSocket(signallingUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[Viewer] WebSocket connected');
                ws?.send(JSON.stringify({ command: 'request_offer' }));
            };

            ws.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                console.log('[Viewer] OME raw message:', JSON.stringify(message));

                if (message.error) {
                    console.error('[Viewer] OME error:', message.error);
                    setError(`Stream error: ${message.error}`);
                    setConnecting(false);
                    return;
                }

                if (message.command === 'offer') {
                    console.log('[Viewer] Received offer from OME');

                    // Build ICE server config
                    const peerConnectionConfig: RTCConfiguration = {};

                    if (message.ice_servers) {
                        peerConnectionConfig.iceServers = message.ice_servers.map((server: any) => ({
                            urls: server.urls,
                            username: server.user_name,
                            credential: server.credential,
                        }));
                        peerConnectionConfig.iceTransportPolicy = 'relay';
                    } else {
                        peerConnectionConfig.iceServers = [
                            { urls: 'stun:stun.l.google.com:19302' },
                        ];
                    }

                    // Create RTCPeerConnection for receiving
                    pc = new RTCPeerConnection(peerConnectionConfig);
                    pcRef.current = pc;

                    // Handle incoming audio tracks from OME
                    pc.ontrack = (event) => {
                        console.log('[Viewer] Received track:', event.track.kind);

                        if (event.streams[0]) {
                            if (audioRef.current) {
                                audioRef.current.srcObject = event.streams[0];
                                audioRef.current.play().catch((e) => console.warn('Autoplay prevented:', e));
                            }
                            startAudioVisualizer(event.streams[0]);
                            setIsPlaying(true);
                            setConnecting(false);
                            setError(null);
                        }
                    };

                    // Send ICE candidates to OME
                    pc.onicecandidate = (e) => {
                        if (e.candidate && e.candidate.candidate) {
                            ws?.send(JSON.stringify({
                                id: message.id,
                                peer_id: message.peer_id,
                                command: 'candidate',
                                candidates: [e.candidate],
                            }));
                        }
                    };

                    pc.oniceconnectionstatechange = () => {
                        console.log('[Viewer] ICE state:', pc?.iceConnectionState);
                        if (pc?.iceConnectionState === 'connected') {
                            setConnecting(false);
                            setError(null);
                        } else if (pc?.iceConnectionState === 'disconnected' || pc?.iceConnectionState === 'failed') {
                            setError('Stream connection lost. The scholar may have ended the stream.');
                            setIsPlaying(false);
                        }
                    };

                    // Build SDP offer
                    const offerSdp = typeof message.sdp === 'string'
                        ? message.sdp
                        : message.sdp?.sdp || message.sdp;

                    const offer = new RTCSessionDescription({
                        type: 'offer',
                        sdp: typeof offerSdp === 'string' ? offerSdp : JSON.stringify(offerSdp),
                    });

                    await pc.setRemoteDescription(offer);

                    // Add ICE candidates from OME
                    if (message.candidates) {
                        for (const candidate of message.candidates) {
                            if (candidate && candidate.candidate) {
                                try {
                                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                                } catch (e) {
                                    console.warn('[Viewer] Error adding ICE candidate:', e);
                                }
                            }
                        }
                    }

                    // Create and send answer
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    ws?.send(JSON.stringify({
                        id: message.id,
                        peer_id: message.peer_id,
                        command: 'answer',
                        sdp: answer,
                    }));

                    console.log('[Viewer] Answer sent to OME');
                }
            };

            ws.onerror = () => {
                console.error('[Viewer] WebSocket error');
                setError('Cannot connect to the streaming server. Please try again later.');
                setConnecting(false);
            };

            ws.onclose = () => {
                console.log('[Viewer] WebSocket closed');
            };
        };

        connectToStream();

        return () => {
            if (pc) {
                pc.close();
            }
            if (ws) {
                ws.close();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [scholarId]);

    const retryConnection = () => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        window.location.reload();
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
                                    <p>{error}</p>
                                    <button onClick={retryConnection} className={styles.retryBtn}>
                                        Retry Connection
                                    </button>
                                </div>
                            )}
                            <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />
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
                                    {isPlaying ? '🎙️ Audio Stream — Playing' : 'Waiting for audio stream...'}
                                </p>
                            </div>
                        </div>

                        <div className={styles.streamInfo}>
                            <p>🎙️ Audio-only stream — Sub-second latency powered by OvenMediaEngine WebRTC</p>
                        </div>
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
