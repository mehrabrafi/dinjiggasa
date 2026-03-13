'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Play, 
    Pause, 
    SkipBack, 
    SkipForward, 
    RotateCcw, 
    RotateCw, 
    Volume2, 
    Share2, 
    Download, 
    X,
    MessageSquare,
    ChevronRight,
    VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AudioPlayer.module.css';

interface Session {
    id: string;
    title: string;
    audioUrl: string | null;
    duration: number | null;
    createdAt: string;
}

interface Scholar {
    id: string;
    name: string;
    avatar: string | null;
}

interface AudioPlayerProps {
    session: Session;
    scholar: Scholar;
    relatedSessions: Session[];
    onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ session, scholar, relatedSessions, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, session]);

    useEffect(() => {
        // Reset state when session changes
        setIsPlaying(true);
        setCurrentTime(0);
    }, [session]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const seek = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
        }
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
        }
        setIsMuted(val === 0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Mock comments data
    const mockComments = [
        { id: '1', user: 'Kamal Ahmed', avatar: 'KA', time: '2h ago', text: 'This lecture really changed my perspective on daily trials. SubhanAllah.' },
        { id: '2', user: 'Sara Fatima', avatar: 'SF', time: '5h ago', text: 'Is there a transcript available for the key points mentioned at 08:42?' },
        { id: '3', user: 'M. Yusuf', avatar: 'MY', time: '1d ago', text: 'JazakAllah Khair Sheikh for this beautiful reminder.' },
    ];

    // Waveform bars
    const bars = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        height: 20 + Math.random() * 60,
    }));

    return (
        <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.container}>
                    {/* Main Section */}
                    <div className={styles.mainContent}>
                        <div className={styles.playerCard}>
                            <div className={styles.playerHeader}>
                                <div className={styles.albumArtContainer}>
                                    <img 
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=random`} 
                                        alt={scholar.name} 
                                        className={styles.albumArt}
                                    />
                                    {/* Verification badge removed as requested */}
                                </div>
                                
                                <div className={styles.infoSection}>
                                    <h1 className={styles.title}>{session.title}</h1>
                                    <span className={styles.scholarName}>{scholar.name}</span>
                                    <div className={styles.dateRow}>
                                        <span className={styles.dateLabel}>Recorded on {formatDate(session.createdAt)}</span>
                                    </div>

                                    {/* Waveform */}
                                    <div className={styles.waveformContainer}>
                                        <div className={styles.waveform}>
                                            {bars.map((bar) => {
                                                const progress = (currentTime / duration) * 100;
                                                const isActive = (bar.id / bars.length) * 100 <= progress;
                                                return (
                                                    <div 
                                                        key={bar.id}
                                                        className={`${styles.waveBar} ${isActive ? styles.activeBar : ''}`}
                                                        style={{ height: `${bar.height}%` }}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className={styles.timeLabels}>
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max={duration || 0} 
                                            value={currentTime} 
                                            onChange={handleSeekChange}
                                            className={styles.seekSlider}
                                        />
                                    </div>

                                    {/* Controls */}
                                    {session.audioUrl ? (
                                        <div className={styles.controls}>
                                            <button className={styles.controlBtn} onClick={() => seek(-10)}>
                                                <RotateCcw size={24} />
                                            </button>
                                            <button className={styles.controlBtn}>
                                                <SkipBack size={24} fill="currentColor" />
                                            </button>
                                            <button className={styles.playPauseBtn} onClick={togglePlay}>
                                                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: '4px' }} />}
                                            </button>
                                            <button className={styles.controlBtn}>
                                                <SkipForward size={24} fill="currentColor" />
                                            </button>
                                            <button className={styles.controlBtn} onClick={() => seek(30)}>
                                                <RotateCw size={24} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.processingMessage}>
                                            ⏳ Recording is being processed. Please check back shortly.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.playerFooter}>
                                <div className={styles.volumeContoller}>
                                    <button onClick={() => setIsMuted(!isMuted)}>
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.01" 
                                        value={isMuted ? 0 : volume} 
                                        onChange={handleVolumeChange}
                                        className={styles.volumeSlider}
                                    />
                                </div>
                                <div className={styles.actionBtns}>
                                    <button className={styles.actionBtn}>
                                        <Share2 size={18} />
                                        Share
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <Download size={18} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarSection}>
                            <div className={styles.sidebarHeader}>
                                <h2>Related Recordings</h2>
                                <ChevronRight size={20} />
                            </div>
                            <div className={styles.recordingList}>
                                {relatedSessions.slice(0, 3).map((s) => (
                                    <div key={s.id} className={styles.recordingItem}>
                                        <div className={styles.recordingThumb}>
                                            <img src="/assets/images/mock/seerah.png" alt="" />
                                        </div>
                                        <div className={styles.recordingInfo}>
                                            <h3>{s.title}</h3>
                                            <p>{scholar.name}</p>
                                            <div className={styles.recordingMeta}>
                                                <span>{s.duration ? `${Math.floor(s.duration / 60)}:00` : '--:--'}</span>
                                                <span className={styles.dot}>•</span>
                                                <span>{formatDate(s.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.viewAllBtn}>View All Library</button>
                        </div>

                        <div className={styles.sidebarSection}>
                            <div className={styles.sidebarHeader}>
                                <div className={styles.commentTitle}>
                                    <MessageSquare size={20} fill="#10b981" color="#10b981" />
                                    <h2>Comments ({mockComments.length + 9})</h2>
                                </div>
                            </div>
                            <div className={styles.commentList}>
                                {mockComments.map((comment) => (
                                    <div key={comment.id} className={styles.commentItem}>
                                        <div className={styles.avatarCircle}>{comment.avatar}</div>
                                        <div className={styles.commentContent}>
                                            <div className={styles.commentHeader}>
                                                <span className={styles.commentUser}>{comment.user}</span>
                                                <span className={styles.commentTime}>{comment.time}</span>
                                            </div>
                                            <p className={styles.commentText}>{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.commentInputWrapper}>
                                <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                                <button className={styles.sendBtn}>
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {session.audioUrl && (
                    <audio 
                        ref={audioRef}
                        src={session.audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

export default AudioPlayer;
