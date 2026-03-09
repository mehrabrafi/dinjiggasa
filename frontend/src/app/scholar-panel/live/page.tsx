'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Play, Square, AlertCircle, Headphones } from 'lucide-react';
import styles from './live.module.css';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import LiveChat from '@/components/live/LiveChat';

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
        return `wss://stream.deenjiggasa.info/app/${scholarId}?direction=send`;
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

    const startStreaming = useCallback(async () => {
        if (!mediaStream) {
            setStatus('Error: No media stream');
            return;
        }

        setStatus('Connecting to server...');

        // Initialize MediaRecorder
        try {
            recordedChunks.current = [];
            // Try audio/webm first, iOS might need audio/mp4
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
            const recorder = new MediaRecorder(mediaStream, { mimeType });

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    recordedChunks.current.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const blob = new Blob(recordedChunks.current, { type: mimeType });
                await uploadRecording(blob, mimeType);
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            console.log('[LiveStream] Started recording stream locally');
        } catch (e) {
            console.error('[LiveStream] Failed to start MediaRecorder:', e);
        }

        try {
            // Notify backend that this scholar is going live (audio-only)
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

                    // Add audio tracks only to the peer connection
                    mediaStream.getAudioTracks().forEach((track) => {
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
                            console.log('[LiveStream] Audio stream is LIVE!');
                        } else if (state === 'disconnected' || state === 'failed') {
                            setStatus('Connection lost. Please try again.');
                            stopStreaming();
                        }
                    };

                    // Build the offer SDP object
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
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop(); // This will trigger onstop and run uploadRecording
        }

        try {
            await api.post('/live/go-offline');
        } catch (e) {
            console.warn('[LiveStream] Could not notify backend go-offline:', e);
        }
        setIsStreaming(false);
        setStatus('Stream Stopped. Uploading recording...');
    }, []);

    const uploadRecording = async (blob: Blob, mimeType: string) => {
        setIsUploading(true);
        setStatus('Uploading recording to Cloudflare R2...');
        try {
            const formData = new FormData();
            const ext = mimeType.split('/')[1] || 'webm';
            formData.append('file', blob, `live_session_${Date.now()}.${ext}`);

            await api.post('/live/upload-recording', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                },
            });

            setStatus('Stream Stopped & Recording Saved!');
            setUploadProgress(100);
        } catch (e) {
            console.error('Failed to upload recording:', e);
            setStatus('Stream Stopped (Recording Upload Failed)');
        } finally {
            setIsUploading(false);
            // Reset progress after a short delay
            setTimeout(() => setUploadProgress(0), 3000);
        }
    };

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
                            <div className={styles.audioIcon}>
                                <Headphones size={64} />
                            </div>
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={200}
                                className={styles.audioCanvas}
                            />
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
                            <li>Powered by OvenMediaEngine — Sub-second latency streaming!</li>
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
