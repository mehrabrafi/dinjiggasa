'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './viewer.module.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function LiveViewer() {
    const { scholarId } = useParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);

    // OvenMediaEngine WebRTC playback signalling URL
    const getSignallingUrl = () => {
        return `wss://stream.deenjiggasa.info/app/${scholarId}`;
    };

    useEffect(() => {
        let pc: RTCPeerConnection | null = null;
        let ws: WebSocket | null = null;

        const connectToStream = () => {
            setConnecting(true);
            setError(null);

            // Create RTCPeerConnection for receiving
            pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                ],
            });
            pcRef.current = pc;

            // Handle incoming tracks (video/audio from OME)
            pc.ontrack = (event) => {
                console.log('[Viewer] Received track:', event.track.kind);
                if (videoRef.current && event.streams[0]) {
                    videoRef.current.srcObject = event.streams[0];
                    videoRef.current.play().catch((e) => console.warn('Autoplay prevented:', e));
                    setIsPlaying(true);
                    setConnecting(false);
                    setError(null);
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log('[Viewer] ICE state:', pc?.iceConnectionState);
                if (pc?.iceConnectionState === 'disconnected' || pc?.iceConnectionState === 'failed') {
                    setError('Stream connection lost. The scholar may have ended the stream.');
                    setIsPlaying(false);
                }
            };

            // Connect via WebSocket to OME signalling server
            const signallingUrl = getSignallingUrl();
            console.log('[Viewer] Connecting to:', signallingUrl);

            ws = new WebSocket(signallingUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[Viewer] WebSocket connected');
                // Request offer from OME for playback
                ws?.send(JSON.stringify({ command: 'request_offer' }));
            };

            ws.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                console.log('[Viewer] OME message:', message.command);

                if (message.command === 'offer') {
                    const offer = new RTCSessionDescription({
                        type: 'offer',
                        sdp: message.sdp,
                    });

                    // Add ICE candidates from OME
                    if (message.candidates) {
                        for (const candidate of message.candidates) {
                            try {
                                await pc?.addIceCandidate(new RTCIceCandidate({
                                    candidate: candidate.candidate,
                                    sdpMLineIndex: candidate.sdpMLineIndex,
                                    sdpMid: candidate.sdpMid ? String(candidate.sdpMid) : undefined,
                                }));
                            } catch (e) {
                                console.warn('[Viewer] Error adding ICE candidate:', e);
                            }
                        }
                    }

                    await pc?.setRemoteDescription(offer);

                    // Create and send answer
                    const answer = await pc?.createAnswer();
                    if (answer) {
                        await pc?.setLocalDescription(answer);
                        ws?.send(JSON.stringify({
                            command: 'answer',
                            sdp: answer.sdp,
                        }));
                    }

                    setConnecting(false);
                }
            };

            ws.onerror = () => {
                console.error('[Viewer] WebSocket error');
                setError('Cannot connect to the streaming server. Please try again later.');
                setConnecting(false);
            };

            ws.onclose = () => {
                console.log('[Viewer] WebSocket closed');
                if (!error) {
                    setError('Stream is currently offline.');
                }
                setConnecting(false);
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
        };
    }, [scholarId]);

    const retryConnection = () => {
        // Cleanup old connection
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        // Reconnect via page reload
        window.location.reload();
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    🔴 Live Session: Scholar {scholarId}
                </h1>

                <div className={styles.videoContainer}>
                    {connecting && (
                        <div className={styles.connectingOverlay}>
                            <div className={styles.spinner}></div>
                            <p>Connecting to live stream...</p>
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
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        className={styles.videoPlayer}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                </div>

                <div className={styles.streamInfo}>
                    <p>⚡ Sub-second latency powered by OvenMediaEngine WebRTC</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
