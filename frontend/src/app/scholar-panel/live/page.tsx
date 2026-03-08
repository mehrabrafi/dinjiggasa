'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Video, Mic, MicOff, VideoOff, Play, Square, AlertCircle } from 'lucide-react';
import styles from './live.module.css';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';

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

    // Get the signalling URL for this scholar's stream (with ?direction=send for ingest)
    const getSignallingUrl = () => {
        return `wss://stream.deenjiggasa.info/app/${scholarId}?direction=send`;
    };

    useEffect(() => {
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

            // Connect to OvenMediaEngine via WebSocket signalling
            const signallingUrl = getSignallingUrl();
            console.log('[LiveStream] Connecting to OME:', signallingUrl);

            const ws = new WebSocket(signallingUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[LiveStream] WebSocket connected to OME');
                setStatus('Connected. Negotiating...');

                // Send the "request_offer" command to OME
                ws.send(JSON.stringify({
                    command: 'request_offer',
                }));
            };

            ws.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                console.log('[LiveStream] OME raw message:', JSON.stringify(message));

                if (message.error) {
                    console.error('[LiveStream] OME error:', message.error);
                    setStatus(`Error: ${message.error}`);
                    return;
                }

                if (message.command === 'offer') {
                    console.log('[LiveStream] Received offer from OME');

                    // Build ICE server config from OME response
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

                    // Create RTCPeerConnection
                    const pc = new RTCPeerConnection(peerConnectionConfig);
                    pcRef.current = pc;

                    // Add all tracks from the media stream to the peer connection
                    mediaStream.getTracks().forEach((track) => {
                        pc.addTrack(track, mediaStream);
                    });

                    // Handle ICE candidate events - send them to OME
                    pc.onicecandidate = (e) => {
                        if (e.candidate && e.candidate.candidate) {
                            ws.send(JSON.stringify({
                                id: message.id,
                                peer_id: message.peer_id,
                                command: 'candidate',
                                candidates: [e.candidate],
                            }));
                        }
                    };

                    // Monitor ICE connection state
                    pc.oniceconnectionstatechange = () => {
                        const state = pc.iceConnectionState;
                        console.log('[LiveStream] ICE state:', state);
                        if (state === 'connected') {
                            setStatus('🔴 Live');
                            setIsStreaming(true);
                            console.log('[LiveStream] Stream is LIVE!');
                        } else if (state === 'disconnected' || state === 'failed') {
                            setStatus('Connection lost. Please try again.');
                            stopStreaming();
                        }
                    };

                    // Build the offer SDP object
                    // message.sdp can be a string or an object with {type, sdp}
                    const offerSdp = typeof message.sdp === 'string'
                        ? message.sdp
                        : message.sdp?.sdp || message.sdp;

                    const offer = new RTCSessionDescription({
                        type: 'offer',
                        sdp: typeof offerSdp === 'string' ? offerSdp : JSON.stringify(offerSdp),
                    });

                    // Set remote description (OME's offer)
                    await pc.setRemoteDescription(offer);

                    // Add ICE candidates from OME
                    if (message.candidates) {
                        for (const candidate of message.candidates) {
                            if (candidate && candidate.candidate) {
                                try {
                                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                                } catch (e) {
                                    console.warn('[LiveStream] Error adding ICE candidate:', e);
                                }
                            }
                        }
                    }

                    // Create answer
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    // Send answer back to OME (include id and peer_id!)
                    ws.send(JSON.stringify({
                        id: message.id,
                        peer_id: message.peer_id,
                        command: 'answer',
                        sdp: answer,
                    }));

                    console.log('[LiveStream] Answer sent to OME');
                    setStatus('Connecting...');
                }
            };

            ws.onerror = (err) => {
                console.error('[LiveStream] WebSocket error:', err);
                setStatus('Error: Connection to streaming server failed');
            };

            ws.onclose = (event) => {
                console.log('[LiveStream] WebSocket closed:', event.code, event.reason);
            };

        } catch (err) {
            console.error('[LiveStream] Error starting stream:', err);
            setStatus('Error: Failed to start stream');
        }
    }, [mediaStream, scholarId]);

    const stopStreaming = useCallback(async () => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
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
                    muted
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
