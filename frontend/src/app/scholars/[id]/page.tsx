"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
    CheckCircle2,
    Calendar,
    Clock,
    Info,
    ArrowUp,
    ArrowDown,
    Share2,
    Bookmark,
    MessageSquare,
    Play,
    Pause,
    ChevronDown,
    Mic
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import api from '@/lib/axios'
import styles from './Profile.module.css'

export default function ScholarProfilePage() {
    const params = useParams()
    const id = params.id
    const [activeTab, setActiveTab] = useState('Answers')
    const [scholar, setScholar] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [answers, setAnswers] = useState<any[]>([])
    const [similarScholars, setSimilarScholars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchScholarData = async () => {
            try {
                // Fetch basic info, stats and answers in parallel
                const [infoRes, statsRes, answersRes, similarRes] = await Promise.all([
                    api.get(`/scholars/${id}`),
                    api.get(`/scholars/${id}/stats`),
                    api.get(`/scholars/${id}/answers`),
                    api.get(`/scholars/${id}/similar`)
                ])

                setScholar(infoRes.data)
                setStats(statsRes.data)
                setAnswers(answersRes.data)
                setSimilarScholars(similarRes.data)
            } catch (err) {
                console.error("Failed to fetch scholar data", err)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchScholarData()
    }, [id])

    if (loading) return (
        <DashboardLayout>
            <div className={styles.profileContainer}>Loading profile...</div>
        </DashboardLayout>
    )

    if (!scholar) return (
        <DashboardLayout>
            <div className={styles.profileContainer}>Scholar not found</div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout>
            <div className={styles.profileContainer}>
                {/* Top Section: Banner and Header */}
                <div className={styles.banner}></div>
                <div className={styles.profileHeader}>
                    <div className={styles.headerMain}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=006D5B&color=fff`}
                                alt={scholar.name}
                                className={styles.avatar}
                            />
                            {scholar.isVerified && (
                                <div className={styles.verifiedBadge}>
                                    <CheckCircle2 size={16} color="#fff" strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.scholarName}>{scholar.name}</h1>
                            <p className={styles.credentials}>
                                {scholar?.specialization || "DinJiggasa Scholar"}
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <button className={styles.askBtn}>
                                <MessageSquare size={20} /> Ask Question
                            </button>
                        </div>
                    </div>

                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'Biography' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('Biography')}
                        >
                            Biography
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'Answers' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('Answers')}
                        >
                            Answers
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'Qualifications' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('Qualifications')}
                        >
                            Qualifications
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className={styles.layoutGrid}>
                    <div className={styles.mainContent}>
                        {activeTab === 'Answers' && (
                            <>
                                {answers && answers.length > 0 ? (
                                    answers.map((ans, idx) => (
                                        <AnswerCard
                                            key={idx}
                                            topic={ans.question.tags?.[0]?.name || "Uncategorized"}
                                            created={new Date(ans.createdAt).toLocaleDateString()}
                                            title={ans.question.title}
                                            body={ans.content}
                                            voice={!!ans.voiceUrl}
                                            audioUrl={ans.voiceUrl}
                                            helpfulCount={ans.ratings?.filter((r: any) => r.value > 0).length || 0}
                                        />
                                    ))
                                ) : (
                                    <div className={styles.contentCard} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                        <h3 className={styles.cardTitle}>No Answers Yet</h3>
                                        <p className={styles.cardDesc}>{scholar.name} hasn't answered any questions yet.</p>
                                    </div>
                                )}
                                {answers.length >= 10 && (
                                    <button className={styles.loadMore}>
                                        Load More Answers <ChevronDown size={18} />
                                    </button>
                                )}
                            </>
                        )}

                        {activeTab === 'Biography' && (
                            <div className={styles.contentCard}>
                                <h3 className={styles.widgetTitle}>Scholar Biography</h3>
                                <p className={styles.cardDesc}>{scholar.bio}</p>
                            </div>
                        )}

                        {activeTab === 'Qualifications' && (
                            <div className={styles.contentCard}>
                                <h3 className={styles.cardTitle}>Educational Qualifications</h3>
                                <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                                    {scholar.educationalQualifications || "No qualifications listed yet."}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className={styles.sidebar}>
                        {/* Office Hours */}
                        {scholar.officeHours && scholar.officeHours.length > 0 && (
                            <div className={styles.widget}>
                                <h3 className={styles.widgetTitle}>
                                    <Calendar size={18} color="#10b981" /> Office Hours
                                </h3>
                                <div className={styles.hoursList}>
                                    {scholar.officeHours.map((item: any, idx: number) => (
                                        <div key={idx} className={styles.hourItem}>
                                            <span className={styles.day}>{item.day}</span>
                                            <span className={styles.time}>{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.consultNote}>
                                    <Info size={16} /> Online consultations available for premium members.
                                </div>
                            </div>
                        )}

                        {/* Contribution Stats */}
                        <div className={styles.widget}>
                            <h3 className={styles.widgetTitle}>Contribution Stats</h3>
                            {stats ? (
                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statVal}>{stats.totalAnswers}</span>
                                        <span className={styles.statLabel}>Answers</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statVal}>{stats.totalUpvotes}</span>
                                        <span className={styles.statLabel}>Helpful Votes</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statVal}>{stats.peopleHelped}</span>
                                        <span className={styles.statLabel}>People Helped</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statVal}>{stats.responseRate}%</span>
                                        <span className={styles.statLabel}>Response Rate</span>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.cardDesc}>Loading stats...</p>
                            )}
                        </div>

                        {/* Similar Scholars */}
                        {similarScholars && similarScholars.length > 0 && (
                            <div className={styles.widget}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 className={styles.widgetTitle} style={{ marginBottom: 0 }}>Similar Scholars</h3>
                                    <Link href="/scholars" style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>View All</Link>
                                </div>
                                <div className={styles.scholarList}>
                                    {similarScholars.map((s: any) => (
                                        <Link key={s.id} href={`/scholars/${s.id}`} style={{ textDecoration: 'none' }}>
                                            <SimilarScholarItem
                                                name={s.name}
                                                title={s.specialization ? s.specialization.split(',')[0].trim() : "Scholar"}
                                                img={s.avatar || `https://ui-avatars.com/api/?name=${s.name}&background=006D5B&color=fff`}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Specialties / Tags */}
                        {scholar.specialization && (
                            <div className={styles.widget}>
                                <h3 className={styles.widgetTitle}>Specialties</h3>
                                <div className={styles.tagCloud}>
                                    {scholar.specialization.split(',').map((spec: string, idx: number) => (
                                        <span key={idx} className={styles.specTag}>#{spec.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </DashboardLayout >
    )
}

function AnswerCard({ topic, pinned, created, title, body, voice, voiceDuration, audioUrl, helpfulCount }: any) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const audioRef = React.useRef<HTMLAudioElement | null>(null)
    const waveRef = React.useRef<HTMLDivElement>(null)

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed", e))
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (!audioRef.current) return
        const current = audioRef.current.currentTime
        const duration = audioRef.current.duration
        if (duration > 0) {
            setProgress((current / duration) * 100)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setProgress(0)
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !waveRef.current) return
        const rect = waveRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const max = rect.width
        const percentage = Math.max(0, Math.min(1, clickX / max))
        const newTime = percentage * (audioRef.current.duration || 0)

        audioRef.current.currentTime = newTime
        setProgress(percentage * 100)
    }

    return (
        <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
                <span className={styles.topicTag}>{topic}</span>
                <span className={styles.pinnedLabel}>
                    {pinned && "Pinned Answer • "}{created}
                </span>
            </div>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDesc}>{body}</p>

            {voice && (
                <div className={styles.audioPlayer}>
                    <button className={styles.playBtn} onClick={togglePlay}>
                        {isPlaying ? <Pause size={14} fill="#10b981" color="#10b981" /> : <Play size={14} fill="#10b981" color="#10b981" />}
                    </button>
                    <span className={styles.audioTime}>Audio explanation ({voiceDuration})</span>
                    <div className={styles.wave} ref={waveRef} onClick={handleSeek}>
                        <div className={styles.waveProgress} style={{ width: `${progress}%` }}></div>
                    </div>
                    {audioUrl && (
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleEnded}
                        />
                    )}
                </div>
            )}

            <div className={styles.cardActions}>
                <div className={styles.voteGroup}>
                    <button className={styles.action}><ArrowUp size={20} /> {helpfulCount} Helpful</button>
                    <button className={styles.action}><ArrowDown size={20} /></button>
                </div>
                <button className={styles.action}><Share2 size={18} /> Share</button>
                <button className={`${styles.action} ${styles.saveAction}`}><Bookmark size={18} /> Save</button>
            </div>
        </div>
    )
}

function SimilarScholarItem({ name, title, img }: any) {
    return (
        <div className={styles.similarScholar}>
            <img src={img} alt={name} className={styles.smallAvatar} />
            <div className={styles.smallInfo}>
                <span className={styles.smallName}>{name}</span>
                <span className={styles.smallTitle}>{title}</span>
            </div>
        </div>
    )
}
