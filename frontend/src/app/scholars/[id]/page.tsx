"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
    CheckCircle2,
    MapPin,
    Users,
    BookOpen,
    Calendar,
    Clock,
    Info,
    ArrowUp,
    ArrowDown,
    Share2,
    Bookmark,
    UserPlus,
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
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchScholar = async () => {
            try {
                // In a real app, we'd fetch specific scholar data
                // For now, fetching all and finding by ID or using mock for the visual effect
                const res = await api.get('/scholars')
                const found = res.data.find((s: any) => s.id === id)

                // If not found in API yet, use realistic mock data matching the screenshot
                if (found) {
                    setScholar({
                        ...found,
                        followers: "15k",
                        location: "Cairo, Egypt",
                        title: "Senior Researcher",
                        credentials: "PhD in Fiqh, Al-Azhar University",
                        officeHours: [
                            { day: "Mon - Wed", time: "10:00 AM - 2:00 PM" },
                            { day: "Friday", time: "4:00 PM - 6:00 PM" }
                        ],
                        stats: {
                            answers: "1.2k",
                            voiceNotes: "450",
                            peopleHelped: "18k",
                            responseRate: "98%"
                        },
                        specialties: ["#Fiqh", "#Finance", "#Inheritance", "#Family Law", "#Contemporary Issues"]
                    })
                } else {
                    // Default mock data matching the image if ID is not found
                    setScholar({
                        id: id,
                        name: "Dr. Ahmed Al-Falahi",
                        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
                        credentials: "PhD in Fiqh, Al-Azhar University",
                        location: "Cairo, Egypt",
                        followers: "15k",
                        title: "Senior Researcher",
                        isVerified: true,
                        bio: "Dr. Ahmed Al-Falahi is a renowned scholar specializing in Islamic Jurisprudence (Fiqh) and Contemporary Financial Issues. He has served as a senior researcher at several Islamic institutions and holds a doctorate from Al-Azhar University.",
                        officeHours: [
                            { day: "Mon - Wed", time: "10:00 AM - 2:00 PM" },
                            { day: "Friday", time: "4:00 PM - 6:00 PM" }
                        ],
                        stats: {
                            answers: "1.2k",
                            voiceNotes: "450",
                            peopleHelped: "18k",
                            responseRate: "98%"
                        },
                        specialties: ["#Fiqh", "#Finance", "#Inheritance", "#Family Law", "#Contemporary Issues"]
                    })
                }
            } catch (err) {
                console.error("Failed to fetch scholar", err)
            } finally {
                setLoading(false)
            }
        }

        fetchScholar()
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
                                    <CheckCircle2 size={32} color="#fff" fill="#3b82f6" />
                                </div>
                            )}
                        </div>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.scholarName}>{scholar.name}</h1>
                            <p className={styles.credentials}>{scholar.credentials}</p>
                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <MapPin size={16} /> {scholar.location}
                                </div>
                                <div className={styles.metaItem}>
                                    <Users size={16} /> {scholar.followers} Followers
                                </div>
                                <div className={styles.metaItem}>
                                    <BookOpen size={16} /> {scholar.title}
                                </div>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button className={styles.followBtn}>
                                <UserPlus size={18} /> Follow
                            </button>
                            <button className={styles.askBtn}>
                                <MessageSquare size={18} /> Ask Question
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
                            className={`${styles.tab} ${activeTab === 'Voice Answers' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('Voice Answers')}
                        >
                            Voice Answers <span className={styles.tabBadge}>New</span>
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className={styles.layoutGrid}>
                    <div className={styles.mainContent}>
                        {activeTab === 'Answers' && (
                            <>
                                <AnswerCard
                                    topic="Fiqh of Fasting"
                                    pinned={true}
                                    created="2 days ago"
                                    title="Is it permissible to use an inhaler while fasting during Ramadan?"
                                    body="The use of an inhaler for asthma involves the delivery of medication directly to the lungs. According to the majority of contemporary scholars and the Fiqh Council, using a nebulizer or inhaler does not break the fast provided it does not reach the stomach in a form that constitutes nourishment..."
                                    voice={true}
                                    voiceDuration="2:14"
                                    audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                />
                                <AnswerCard
                                    topic="Business Ethics"
                                    created="5 days ago"
                                    title="Can I invest in companies that have a small percentage of debt?"
                                    body="Investment in stocks requires screening the company's activities and financials. While the core business must be permissible (Halal), many scholars allow investment if interest-bearing debt is less than 33% of total assets, though purification of dividend income corresponding to the haram portion is necessary. This is based on the rule of the majority taking the ruling of the whole..."
                                />
                                <AnswerCard
                                    topic="Family"
                                    created="1 week ago"
                                    title="Rights of parents when they disagree with marriage choice"
                                    body="Respecting parents is a cornerstone of our faith. However, in matters of marriage, while their advice should be heavily weighed, cultural preferences should not supersede religious compatibility. If the potential spouse is religiously committed and has good character, unreasonable rejection by parents requires careful mediation..."
                                />
                                <button className={styles.loadMore}>
                                    Load More Answers <ChevronDown size={18} />
                                </button>
                            </>
                        )}

                        {activeTab === 'Biography' && (
                            <div className={styles.contentCard}>
                                <h3 className={styles.widgetTitle}>Scholar Biography</h3>
                                <p className={styles.cardDesc}>{scholar.bio}</p>
                            </div>
                        )}

                        {activeTab === 'Voice Answers' && (
                            <div className={styles.contentCard} style={{ textAlign: 'center', padding: '3rem' }}>
                                <Mic size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                                <h3 className={styles.cardTitle}>Audio Library</h3>
                                <p className={styles.cardDesc}>Browse the collection of audio explanations provided by {scholar.name}.</p>
                            </div>
                        )}
                    </div>

                    <aside className={styles.sidebar}>
                        {/* Office Hours */}
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

                        {/* Contribution Stats */}
                        <div className={styles.widget}>
                            <h3 className={styles.widgetTitle}>Contribution Stats</h3>
                            <div className={styles.statsGrid}>
                                <div className={styles.statBox}>
                                    <span className={styles.statVal}>{scholar.stats.answers}</span>
                                    <span className={styles.statLabel}>Answers</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statVal}>{scholar.stats.voiceNotes}</span>
                                    <span className={styles.statLabel}>Voice Notes</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statVal}>{scholar.stats.peopleHelped}</span>
                                    <span className={styles.statLabel}>People Helped</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statVal}>{scholar.stats.responseRate}</span>
                                    <span className={styles.statLabel}>Response Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Similar Scholars */}
                        <div className={styles.widget}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 className={styles.widgetTitle} style={{ marginBottom: 0 }}>Similar Scholars</h3>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>View All</a>
                            </div>
                            <div className={styles.scholarList}>
                                <SimilarScholarItem
                                    name="Dr. Omar Suleiman"
                                    title="Hadith Specialist"
                                    img="https://ui-avatars.com/api/?name=Omar+Suleiman&background=006D5B&color=fff"
                                />
                                <SimilarScholarItem
                                    name="Sheikh Yasir Qadhi"
                                    title="Theology & History"
                                    img="https://ui-avatars.com/api/?name=Yasir+Qadhi&background=006D5B&color=fff"
                                />
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className={styles.widget}>
                            <h3 className={styles.widgetTitle}>Specialties</h3>
                            <div className={styles.tagCloud}>
                                {scholar.specialties.map((spec: string, idx: number) => (
                                    <span key={idx} className={styles.specTag}>{spec}</span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    )
}

function AnswerCard({ topic, pinned, created, title, body, voice, voiceDuration, audioUrl }: any) {
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
                    <button className={styles.action}><ArrowUp size={20} /> 245 Helpful</button>
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
            <button className={styles.addBtn}><UserPlus size={18} /></button>
        </div>
    )
}
