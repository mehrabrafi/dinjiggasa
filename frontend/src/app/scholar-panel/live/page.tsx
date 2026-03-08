'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Video, Mic, MicOff, VideoOff, Play, Square, AlertCircle } from 'lucide-react';
import styles from './live.module.css';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';

const OME_SIGNALLING_URL = 'wss://stream.deenjiggasa.info/app/stream';

export default function ScholarLiveStudio() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [status, setStatus] = useState<string>('Ready to start');
    const { user } = useAuthStore();
    const scholarId = user?.id || '12345';

    // Get the signalling URL for this scholar's stream
    const getSignallingUrl = () => {
        return `wss://stream.deenjiggasa.info/app/${scholarId}`;
    };

    useEffect(() => {
        // Attempt to get camera permissions with HD resolution
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 48000,
                },
            })
            .then((stream) => {
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error('Error accessing media devices.', err);
                setStatus('Error: Camera permissions denied');
            });

        return () => {
            stopStreaming();
        };
    }, []);

    // Cleanup media stream on unmount
    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [mediaStream]);

    const toggleVideo = () => {
        if (mediaStream) {
            mediaStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoMuted(!isVideoMuted);
        }
    };

    const toggleAudio = () => {
        if (mediaStream) {
            mediaStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const startStreaming = useCallback(async () => {
        if (!mediaStream) {
            setStatus('Error: No media stream');
            return;
        }

        setStatus('Connecting to server...');

        try {
            // Notify backend that this scholar is going live
            try {
                await api.post('/live/go-live');
            } catch (e) {
                console.warn('[LiveStream] Could not notify backend go-live:', e);
            }

            // Create RTCPeerConnection
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                ],
            });
            pcRef.current = pc;

            // Add all tracks from the media stream to the peer connection
            mediaStream.getTracks().forEach((track) => {
                pc.addTrack(track, mediaStream);
            });

            // Connect to OvenMediaEngine via WebSocket signalling
            const signallingUrl = getSignallingUrl();
            console.log('[LiveStream] Connecting to OME:', signallingUrl);

            const ws = new WebSocket(signallingUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[LiveStream] WebSocket connected to OME');
                setStatus('Connected. Negotiating...');

                // Send the "request_offer" command to OME
                const requestOffer = {
                    command: 'request_offer',
                };
                ws.send(JSON.stringify(requestOffer));
            };

            ws.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                console.log('[LiveStream] OME message:', message.command);

                if (message.command === 'offer') {
                    // OME sends us an offer, we set it as remote description
                    const offer = new RTCSessionDescription({
                        type: 'offer',
                        sdp: message.sdp,
                    });

                    // Set ICE candidates from OME
                    if (message.candidates) {
                        for (const candidate of message.candidates) {
                            try {
                                await pc.addIceCandidate(new RTCIceCandidate({
                                    candidate: candidate.candidate,
                                    sdpMLineIndex: candidate.sdpMLineIndex,
                                    sdpMid: candidate.sdpMid ? String(candidate.sdpMid) : undefined,
                                }));
                            } catch (e) {
                                console.warn('[LiveStream] Error adding ICE candidate:', e);
                            }
                        }
                    }

                    await pc.setRemoteDescription(offer);

                    // Create answer
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    // Send answer back to OME
                    const answerMessage = {
                        command: 'answer',
                        sdp: answer.sdp,
                    };
                    ws.send(JSON.stringify(answerMessage));

                    setStatus('🔴 Live');
                    setIsStreaming(true);
                    console.log('[LiveStream] Stream is LIVE!');
                }
            };

            ws.onerror = (err) => {
                console.error('[LiveStream] WebSocket error:', err);
                setStatus('Error: Connection to streaming server failed');
            };

            ws.onclose = (event) => {
                console.log('[LiveStream] WebSocket closed:', event.code, event.reason);
                if (isStreaming) {
                    setStatus('Disconnected from server');
                    stopStreaming();
                }
            };

            // Monitor ICE connection state
            pc.oniceconnectionstatechange = () => {
                console.log('[LiveStream] ICE state:', pc.iceConnectionState);
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                    setStatus('Connection lost. Please try again.');
                    stopStreaming();
                }
            };

        } catch (err) {
            console.error('[LiveStream] Error starting stream:', err);
            setStatus('Error: Failed to start stream');
        }
    }, [mediaStream, scholarId]);

    const stopStreaming = useCallback(async () => {
        // Close WebRTC peer connection
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }

        // Close WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Notify backend that this scholar is going offline
        try {
            await api.post('/live/go-offline');
        } catch (e) {
            console.warn('[LiveStream] Could not notify backend go-offline:', e);
        }

        setIsStreaming(false);
        setStatus('Stream Stopped');
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Live Stream Studio</h1>
                <div className={styles.statusBadge} data-streaming={isStreaming}>
                    <div className={styles.statusDot}></div>
                    {status}
                </div>
            </div>

            <div className={styles.videoContainer}>
                {status.includes('Error') && (
                    <div className={styles.errorOverlay}>
                        <AlertCircle className={styles.alertIcon} size={40} />
                        <p>{status}</p>
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted // Muted to prevent echo in the studio
                    playsInline
                    className={styles.video}
                />
                <div className={styles.controlsOverlay}>
                    <div className={styles.mediaControls}>
                        <button onClick={toggleVideo} className={styles.controlBtn} title={isVideoMuted ? "Turn on camera" : "Turn off camera"}>
                            {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
                        </button>
                        <button onClick={toggleAudio} className={styles.controlBtn} title={isAudioMuted ? "Unmute mic" : "Mute mic"}>
                            {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                    </div>

                    <div className={styles.actionControls}>
                        {!isStreaming ? (
                            <button onClick={startStreaming} className={styles.startBtn}>
                                <Play size={20} /> Start Streaming
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
                    <li>Your live viewing URL will be: <b>deenjiggasa.info/live/{scholarId}</b></li>
                    <li>Powered by OvenMediaEngine — Sub-second latency streaming!</li>
                </ul>
            </div>
        </div>
    );
}
