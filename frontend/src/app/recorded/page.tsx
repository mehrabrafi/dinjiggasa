"use client"

import { useEffect, useState } from 'react'
import { Headphones, Eye, Calendar, Clock, Play, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import api from '@/lib/axios'
import styles from './recorded.module.css'
import { AnimatePresence } from 'framer-motion'
import AudioPlayer from '@/components/shared/AudioPlayer/AudioPlayer'

interface RecordedSession {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    recordingUrl: string | null;
    audioUrl?: string | null;
    duration: number | null;
    viewCount: number;
    createdAt: string;
    scholar: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

export default function RecordedStreamsPage() {
    const [sessions, setSessions] = useState<RecordedSession[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSession, setActiveSession] = useState<RecordedSession | null>(null)

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get('/live/overview')
                setSessions(res.data.past || [])
            } catch (error) {
                console.error('Failed to fetch recorded sessions:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSessions()
    }, [])

    return (
        <DashboardLayout>
            <main className={styles.container}>
                <header className={styles.header}>
                    <Link href="/live" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Live TV
                    </Link>
                    <h1 className={styles.title}>Recent Streams</h1>
                    <p className={styles.subtitle}>
                        Explore our library of past live discussions and audio sessions from verified scholars.
                    </p>
                </header>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading library...</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {sessions.map((session) => (
                            <div 
                                key={session.id} 
                                className={styles.card}
                                onClick={() => setActiveSession(session)}
                            >
                                <div className={styles.thumbnailWrapper}>
                                    <img 
                                        src={session.thumbnailUrl || '/assets/images/mock/recent2.png'} 
                                        alt={session.title} 
                                        className={styles.thumbnail}
                                    />
                                    <div className={styles.duration}>
                                        {Math.floor((session.duration || 0) / 60)}:{(session.duration || 0) % 60 < 10 ? '0' : ''}{(session.duration || 0) % 60}
                                    </div>
                                    <div className={styles.playIcon}>
                                        <Play size={32} fill="white" />
                                    </div>
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.sessionTitle}>{session.title}</h3>
                                    <div className={styles.scholarRow}>
                                        <img 
                                            src={session.scholar?.avatar || `https://ui-avatars.com/api/?name=${session.scholar?.name}`} 
                                            className={styles.scholarAvatar}
                                        />
                                        <span className={styles.scholarName}>{session.scholar?.name}</span>
                                    </div>
                                    <div className={styles.meta}>
                                        <span className={styles.metaItem}>
                                            <Calendar size={14} /> {new Date(session.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className={styles.metaItem}>
                                            <Eye size={14} /> {session.viewCount || 0} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {sessions.length === 0 && !loading && (
                    <div className={styles.empty}>
                        <Headphones size={48} className={styles.emptyIcon} />
                        <h3>No recordings found</h3>
                        <p>We couldn't find any recorded sessions at the moment.</p>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {activeSession && (
                    <AudioPlayer 
                        session={{
                            id: activeSession.id,
                            title: activeSession.title,
                            audioUrl: activeSession.audioUrl || activeSession.recordingUrl,
                            duration: activeSession.duration || null,
                            createdAt: activeSession.createdAt
                        }}
                        scholar={{
                            id: activeSession.scholar?.id || '',
                            name: activeSession.scholar?.name || 'Unknown Scholar',
                            avatar: activeSession.scholar?.avatar || null
                        }}
                        relatedSessions={sessions.filter(s => s.id !== activeSession.id).map(s => ({
                            id: s.id,
                            title: s.title,
                            audioUrl: s.audioUrl || s.recordingUrl,
                            duration: s.duration || null,
                            createdAt: s.createdAt
                        }))}
                        onClose={() => setActiveSession(null)}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
