'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Video, Mic, MicOff, VideoOff, Play, Square, AlertCircle } from 'lucide-react';
import styles from './live.module.css';

export default function ScholarLiveStudio() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [status, setStatus] = useState<string>('Ready to start');
    const [socket, setSocket] = useState<Socket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // You would normally fetch this from the user's profile/context
    const scholarId = '12345'; // Change to dynamic in a real scenario
    const SOCKET_URL = 'wss://stream.deenjiggasa.info'; // Updated to use the secure WebSocket connection

    useEffect(() => {
        // Attempt to get camera permissions
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
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
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

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

    const startStreaming = () => {
        if (!mediaStream) {
            setStatus('Error: No media stream');
            return;
        }

        // Connect to websocket backend
        const newSocket = io(`${SOCKET_URL}/live-stream`, {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            setStatus('Connected. Starting Stream...');
            newSocket.emit('start-stream', { streamKey: scholarId });
        });

        newSocket.on('stream-started', () => {
            setStatus('Live');
            setIsStreaming(true);

            // Start Recording and pushing chunks
            // Use constrained webm for fastest encoding in browser to push RTMP via node
            const options = { mimeType: 'video/webm;codecs=vp8,opus' };
            const recorder = new MediaRecorder(mediaStream, options);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0 && newSocket.connected) {
                    newSocket.emit('binary-stream', e.data);
                }
            };

            // 1000ms timeslices is usually a good balance for live chunking
            recorder.start(1000);
            mediaRecorderRef.current = recorder;
        });

        newSocket.on('stream-error', (err) => {
            setStatus(`Error: ${err.message}`);
            stopStreaming();
        });

        newSocket.on('disconnect', () => {
            setStatus('Disconnected from server');
            stopStreaming();
        });

        setSocket(newSocket);
    };

    const stopStreaming = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (socket) {
            socket.emit('stop-stream');
            socket.disconnect();
        }
        setSocket(null);
        setIsStreaming(false);
        if (status !== 'Error: Camera permissions denied') {
            setStatus('Stream Stopped');
        }
    };

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
                    <li>Your live viewing URL will be: <b>YOUR_DOMAIN/live/{scholarId}</b></li>
                </ul>
            </div>
        </div>
    );
}
