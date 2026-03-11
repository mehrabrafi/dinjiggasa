'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    Play,
    Square,
    Video,
    VideoOff,
    Mic,
    MicOff,
    Hand,
    Check,
    X,
    Volume2,
    Timer,
    Users,
    CheckCircle2
} from 'lucide-react';
import styles from './live.module.css';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import LiveChat from '@/components/live/LiveChat';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    TrackToggle,
    useLocalParticipant,
    VideoTrack,
    useTracks
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

export default function ScholarLiveStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [listenerCount, setListenerCount] = useState(0);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [status, setStatus] = useState<string>('Ready to start');
    const [streamTitle, setStreamTitle] = useState('Understanding the Wisdom of Ramadan');
    const [streamDescription, setStreamDescription] = useState('Join us for a deep dive into the spiritual and practical aspects of Ramadan.');
    const [streamType, setStreamType] = useState<'audio' | 'video'>('audio');
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user } = useAuthStore();
    const scholarId = user?.id || '12345';

    // Raised hand state
    interface RaisedHandInfo {
        participantIdentity: string;
        participantName: string;
        raisedAt: string;
    }
    const [raisedHands, setRaisedHands] = useState<RaisedHandInfo[]>([]);
    const [activeSpeakers, setActiveSpeakers] = useState<{ identity: string, name: string }[]>([]);

    // Get the signalling URL for this scholar's stream (with ?direction=send for ingest)
    const getSignallingUrl = () => {
        return `wss://livekit.deenjiggasa.info/app/${scholarId}?direction=send`;
    };

    // Initialize audio-only media
    // Initialize media
    const initMedia = useCallback(async () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: streamType === 'video',
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 48000,
                },
            });

            setMediaStream(stream);

            if (streamType === 'audio') {
                startAudioVisualizer(stream);
            } else if (streamType === 'video' && videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setStatus('Ready to start');
        } catch (err) {
            console.error('Error accessing media.', err);
            setStatus('Error: Media permissions denied');
        }
    }, [streamType]);

    useEffect(() => {
        if (streamType === 'video' && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [streamType, mediaStream]);


    useEffect(() => {
        initMedia();

        // Check if scholar is currently live (e.g. after page refresh)
        const checkLiveStatus = async () => {
            if (!scholarId || scholarId === '12345') return;
            try {
                const { data } = await api.get(`/live/status/${scholarId}`);
                if (data.isLive) {
                    // Scholar is still live on backend, auto-reconnect
                    console.log('[LiveStream] Scholar is still live, auto-reconnecting...');
                    const tokenRes = await api.get('/live/token');
                    setLkToken(tokenRes.data.token);
                    setIsStreaming(true);
                    setStatus('🔴 Live');
                    if (data.title) setStreamTitle(data.title);
                    if (data.description) setStreamDescription(data.description);
                    if (data.streamType) setStreamType(data.streamType as 'audio' | 'video');
                }
            } catch (err) {
                console.warn('[LiveStream] Could not check live status:', err);
            }
        };
        checkLiveStatus();

        return () => {
            // Don't call stopStreaming on unmount during refresh
            // The backend keeps the live state
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

    const toggleVideo = () => {
        if (mediaStream && streamType === 'video') {
            mediaStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoMuted(!isVideoMuted);
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
            setElapsedSeconds(0);

            // Start timer
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);

            // Notify backend
            try {
                await api.post('/live/go-live', {
                    title: streamTitle,
                    description: streamDescription,
                    streamType: streamType,
                });
            } catch (e) {
                console.warn('[LiveStream] Could not notify backend go-live:', e);
            }
        } catch (err) {
            console.error('[LiveStream] Error fetching token:', err);
            setStatus('Error: Failed to get streaming token');
        }
    }, [streamTitle, streamDescription, streamType]);

    const stopStreaming = useCallback(async () => {
        setLkToken(null);
        setIsStreaming(false);
        setStatus('Ready to start');
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        try {
            await api.post('/live/go-offline');
        } catch (e) {
            console.warn('[LiveStream] Could not notify backend go-offline:', e);
        }
    }, []);

    const formatElapsedTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Poll for raised hands every 3 seconds while streaming
    useEffect(() => {
        if (!isStreaming) return;
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get(`/live/raised-hands/${scholarId}`);
                setRaisedHands(data);

                // Update listener count too
                const statusRes = await api.get(`/live/status/${scholarId}`);
                setListenerCount(statusRes.data.viewerCount || 0);
            } catch (err) {
                // Silently fail
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [isStreaming, scholarId]);

    // Approve a viewer to speak
    const handleApprove = async (participantIdentity: string, participantName: string) => {
        try {
            await api.post('/live/grant-publish', {
                roomName: scholarId,
                participantIdentity,
            });
            setActiveSpeakers(prev => [...prev, { identity: participantIdentity, name: participantName }]);
            // Remove from raised hands locally
            setRaisedHands(prev => prev.filter(h => h.participantIdentity !== participantIdentity));
        } catch (err) {
            console.error('Failed to approve speaker:', err);
        }
    };

    // Dismiss a raised hand
    const handleDismiss = async (participantIdentity: string) => {
        try {
            await api.post('/live/lower-hand', {
                roomName: scholarId,
                participantIdentity,
            });
            setRaisedHands(prev => prev.filter(h => h.participantIdentity !== participantIdentity));
        } catch (err) {
            console.error('Failed to dismiss hand:', err);
        }
    };

    // Revoke speaking permission
    const handleRevoke = async (participantIdentity: string) => {
        try {
            await api.post('/live/revoke-publish', {
                roomName: scholarId,
                participantIdentity,
            });
            setActiveSpeakers(prev => prev.filter(s => s.identity !== participantIdentity));
        } catch (err) {
            console.error('Failed to revoke speaker:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>{streamType === 'video' ? 'Live Video Stream' : 'Live Audio Stream'}</h1>
                    <p className={styles.subtitle}>Broadcasting to DinJiggasa Community</p>
                </div>
                <div className={styles.headerRight}>
                    {isStreaming && (
                        <>
                            <div className={styles.listenersBadge}>
                                <Users size={16} />
                                <span>{listenerCount.toLocaleString()} listeners</span>
                            </div>
                            <div className={styles.timerBadge}>
                                <Timer size={16} />
                                <span>{formatElapsedTime(elapsedSeconds)}</span>
                            </div>
                        </>
                    )}
                    <div className={styles.statusBadge} data-streaming={isStreaming}>
                        <div className={styles.statusDot}></div>
                        {status}
                    </div>
                </div>
            </div>

            {lkToken ? (
                <LiveKitRoom
                    video={streamType === 'video' && !isVideoMuted}
                    audio={!isAudioMuted}
                    token={lkToken}
                    serverUrl={lkServerUrl}
                    connect={true}
                    options={{ disconnectOnPageLeave: false }}
                >
                    <div className={styles.mainLayout}>
                        <div className={styles.leftCol}>
                            <div className={styles.streamCard}>
                                <div className={styles.audioVisualizerContainer}>
                                    {streamType === 'audio' ? (
                                        <canvas
                                            ref={canvasRef}
                                            width={600}
                                            height={200}
                                            className={styles.audioCanvas}
                                        />
                                    ) : (
                                        <div className={styles.videoStreamContainer}>
                                            <LocalVideoPreview streamType={streamType} videoRef={videoRef} mediaStream={mediaStream} />
                                        </div>
                                    )}
                                    <RoomAudioRenderer />
                                </div>

                                <div className={styles.sessionInfo}>
                                    <h2 className={styles.sessionTitle}>{streamTitle}</h2>
                                    {streamDescription && <p className={styles.streamDescription}>{streamDescription}</p>}
                                    <div className={styles.scholarInfo}>
                                        <span className={styles.scholarName}>{user?.name || 'Scholar Name'}</span>
                                        <CheckCircle2 size={16} className={styles.verifiedIcon} />
                                    </div>
                                </div>

                                <div className={styles.controlsSection}>
                                    <button onClick={toggleAudio} className={styles.roundControlBtn} title={isAudioMuted ? "Unmute mic" : "Mute mic"}>
                                        {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                    </button>

                                    <button onClick={stopStreaming} className={styles.stopBtnLarge}>
                                        <div className={styles.stopInner}>
                                            <Square size={24} fill="white" />
                                        </div>
                                    </button>

                                    {streamType === 'video' ? (
                                        <button onClick={toggleVideo} className={styles.roundControlBtn} title={isVideoMuted ? "Turn on camera" : "Turn off camera"}>
                                            {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
                                        </button>
                                    ) : (
                                        <button className={styles.roundControlBtn}>
                                            <Volume2 size={24} />
                                        </button>
                                    )}
                                </div>


                            </div>

                            {/* Raised Hands Panel */}
                            {isStreaming && (
                                <div className={styles.raisedHandsPanel}>
                                    <h3 className={styles.raisedHandsTitle}>
                                        <Hand size={18} /> Raised Hands ({raisedHands.length})
                                    </h3>

                                    {/* Active Speakers */}
                                    {activeSpeakers.length > 0 && (
                                        <div className={styles.activeSpeakersSection}>
                                            <h4 className={styles.activeSpeakersLabel}>
                                                <Volume2 size={14} /> Active Speakers
                                            </h4>
                                            {activeSpeakers.map((speaker) => (
                                                <div key={speaker.identity} className={styles.speakerItem}>
                                                    <span className={styles.speakerName}>🎙️ {speaker.name}</span>
                                                    <button
                                                        onClick={() => handleRevoke(speaker.identity)}
                                                        className={styles.revokeBtn}
                                                        title="Revoke speaking permission"
                                                    >
                                                        <MicOff size={14} /> Mute
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Waiting List */}
                                    {raisedHands.length === 0 && activeSpeakers.length === 0 && (
                                        <p className={styles.noHandsText}>No one has raised their hand yet.</p>
                                    )}
                                    {raisedHands.map((hand) => (
                                        <div key={hand.participantIdentity} className={styles.handItem}>
                                            <div className={styles.handInfo}>
                                                <span className={styles.handName}>✋ {hand.participantName}</span>
                                                <span className={styles.handTime}>
                                                    {new Date(hand.raisedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={styles.handActions}>
                                                <button
                                                    onClick={() => handleApprove(hand.participantIdentity, hand.participantName)}
                                                    className={styles.approveBtn}
                                                    title="Allow to speak"
                                                >
                                                    <Check size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDismiss(hand.participantIdentity)}
                                                    className={styles.dismissBtn}
                                                    title="Dismiss"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                </LiveKitRoom>
            ) : (
                <div className={styles.mainLayout}>
                    <div className={styles.leftCol}>
                        <div className={styles.streamCard}>
                            <div className={styles.audioVisualizerContainer}>
                                {streamType === 'audio' ? (
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={200}
                                        className={styles.audioCanvas}
                                    />
                                ) : (
                                    <div className={styles.videoStreamContainer}>
                                        <video
                                            autoPlay
                                            muted
                                            playsInline
                                            className={styles.localVideo}
                                            ref={(el) => {
                                                if (videoRef && 'current' in videoRef) {
                                                    (videoRef as any).current = el;
                                                }
                                                if (el && mediaStream) {
                                                    el.srcObject = mediaStream;
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.sessionInfo}>
                                <div className={styles.streamConfig}>
                                    <div className={styles.inputGroup}>
                                        <label>Stream Title</label>
                                        <input
                                            type="text"
                                            value={streamTitle}
                                            onChange={(e) => setStreamTitle(e.target.value)}
                                            placeholder="Enter stream title..."
                                            className={styles.titleInput}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Description (Optional)</label>
                                        <textarea
                                            value={streamDescription}
                                            onChange={(e) => setStreamDescription(e.target.value)}
                                            placeholder="What is this stream about?"
                                            className={styles.descInput}
                                        />
                                    </div>

                                    <div className={styles.streamTypeSelector}>
                                        <label>Stream Type</label>
                                        <div className={styles.typeButtons}>
                                            <button
                                                className={`${styles.typeBtn} ${streamType === 'audio' ? styles.activeType : ''}`}
                                                onClick={() => setStreamType('audio')}
                                            >
                                                🎙️ Audio Session
                                            </button>
                                            <button
                                                className={`${styles.typeBtn} ${streamType === 'video' ? styles.activeType : ''}`}
                                                onClick={() => setStreamType('video')}
                                            >
                                                📷 Video Stream
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.scholarInfo}>
                                    <span className={styles.scholarName}>{user?.name || 'Scholar Name'}</span>
                                    <CheckCircle2 size={16} className={styles.verifiedIcon} />
                                </div>
                            </div>

                            <div className={styles.controlsSection}>
                                <button onClick={toggleAudio} className={styles.roundControlBtn} title={isAudioMuted ? "Unmute mic" : "Mute mic"}>
                                    {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>

                                <button onClick={startStreaming} className={styles.startBtnLarge}>
                                    <Play size={28} fill="white" />
                                </button>

                                {streamType === 'video' ? (
                                    <button onClick={toggleVideo} className={styles.roundControlBtn} title={isVideoMuted ? "Turn on camera" : "Turn off camera"}>
                                        {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
                                    </button>
                                ) : (
                                    <button className={styles.roundControlBtn}>
                                        <Volume2 size={24} />
                                    </button>
                                )}
                            </div>
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
            )}
        </div>
    );
}

function LocalVideoPreview({ streamType, videoRef, mediaStream }: { streamType: string, videoRef: React.RefObject<HTMLVideoElement | null>, mediaStream: MediaStream | null }) {
    const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }]);
    const localVideoTrack = tracks.find(t => t.participant.isLocal);

    if (localVideoTrack?.publication) {
        return <VideoTrack trackRef={localVideoTrack as any} className={styles.localVideo} />;
    }

    return (
        <video
            autoPlay
            muted
            playsInline
            className={styles.localVideo}
            ref={(el) => {
                if (videoRef && 'current' in videoRef) {
                    (videoRef as any).current = el;
                }
                if (el && mediaStream) {
                    el.srcObject = mediaStream;
                }
            }}
        />
    );
}
