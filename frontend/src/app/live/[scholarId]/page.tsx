'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Hls from 'hls.js';
import styles from './viewer.module.css';

export default function LiveViewer() {
    const { scholarId } = useParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const STREAM_URL = `https://stream.deenjiggasa.info/stream/${scholarId}.m3u8`;

    useEffect(() => {
        let hls: Hls | null = null;
        const video = videoRef.current;

        if (!video) return;

        const initializePlayer = () => {
            // Check if HLS is supported natively (Safari)
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = STREAM_URL;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch((e) => console.error("Auto-play prevented", e));
                });

                video.addEventListener('error', () => {
                    setError("Stream is currently offline.");
                });

            } else if (Hls.isSupported()) {
                hls = new Hls({
                    // HLS.js configuration optimized for Low Latency Live
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                });

                hls.loadSource(STREAM_URL);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch((e) => console.error("Auto-play prevented", e));
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error("Fatal network error encountered, try to recover");
                                hls?.startLoad();
                                setError("Broadcaster network is unstable, buffering...");
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.error("Fatal media error encountered, try to recover");
                                hls?.recoverMediaError();
                                break;
                            default:
                                hls?.destroy();
                                setError("Stream is currently offline.");
                                break;
                        }
                    }
                });

                // Clear error if fragment loads successfully
                hls.on(Hls.Events.FRAG_LOADED, () => {
                    setError(null);
                });
            }
        };

        initializePlayer();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [scholarId]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Live Session: Scholar {scholarId}</h1>

            <div className={styles.videoContainer}>
                {error && (
                    <div className={styles.errorOverlay}>
                        <p>{error}</p>
                    </div>
                )}
                <video
                    ref={videoRef}
                    controls
                    className={styles.videoPlayer}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
                {!isPlaying && !error && (
                    <div className={styles.playOverlay}>
                        <p>Click Play to join the stream</p>
                    </div>
                )}
            </div>
        </div>
    );
}
