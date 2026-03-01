"use client"

import { useEffect, useState, use } from 'react'
import { ArrowLeft, CheckCircle2, Play, MessageSquare, Share2, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import Link from "next/link"
import DashboardLayout from '@/components/layout/DashboardLayout'
import styles from './page.module.css'
import api from '@/lib/axios'

interface Author {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    specialization?: string | null;
    bio?: string | null;
    isVerified?: boolean;
}

interface Answer {
    id: string;
    content: string;
    isAccepted: boolean;
    createdAt: string;
    author: Author;
    _count: { ratings: number };
}

interface Question {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    author: Author;
    tags: { id: string; name: string }[];
    answers: Answer[];
    _count: { ratings: number };
}

export default function QuestionDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise)
    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await api.get(`/questions/${params.id}`)
                setQuestion(res.data)
            } catch (error) {
                console.error('Failed to fetch question:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchQuestion()
    }, [params.id])

    if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>
    if (!question) return <DashboardLayout><div>Question not found</div></DashboardLayout>

    const featuredAnswer = question.answers.find(a => a.isAccepted) || question.answers[0]
    const scholar = featuredAnswer?.author

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', gap: '2.5rem', width: '100%' }}>
                {/* Main Content */}
                <div className={styles.container}>
                    <div className={styles.questionCard}>
                        <div className={styles.tags}>
                            {question.tags.map(tag => (
                                <span key={tag.id} className={`${styles.tag} ${tag.name.toLowerCase() === 'spiritual growth' ? styles.tagGreen : styles.tagGray}`}>
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        <h1 className={styles.title}>{question.title}</h1>

                        <div className={styles.askerRow} style={{ color: '#64748b', fontStyle: 'italic' }}>
                            <span className={styles.askedAt}>Posted {new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className={styles.questionBody}>{question.body}</p>
                    </div>

                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Scholar Response</h2>
                        <span className={styles.answerCount}>{question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}</span>
                    </div>

                    {featuredAnswer && (
                        <div className={styles.answerCard}>
                            <div className={styles.answerHeader}>
                                <div className={styles.scholarRow}>
                                    <img
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=10b981&color=fff`}
                                        alt={scholar.name}
                                        className={styles.scholarAvatar}
                                    />
                                    <div className={styles.scholarInfo}>
                                        <div className={styles.scholarNameRow}>
                                            <span className={styles.scholarName}>{scholar.name}</span>
                                            {scholar.isVerified !== false && <CheckCircle2 size={16} fill="#10b981" color="#fff" />}
                                        </div>
                                        <span className={styles.scholarMeta}>
                                            {scholar.specialization || 'Imam & Scholar'} • {scholar.role === 'SCHOLAR' ? 'Authored' : 'Verified'}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.featuredBadge}>Featured Answer</div>
                            </div>

                            <div className={styles.audioPlayer}>
                                <button className={styles.playBtn}>
                                    <Play size={20} fill="currentColor" />
                                </button>
                                <div className={styles.waveform}>
                                    {[30, 60, 45, 80, 50, 90, 70, 40, 60, 35, 55, 45, 65, 30, 75, 50, 40, 60, 45, 70].map((h, i) => (
                                        <div
                                            key={i}
                                            className={`${styles.bar} ${i < 6 ? styles.barActive : ''}`}
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <div className={styles.playerMeta}>
                                    <span className={styles.audioLabel}>Listen to Answer</span>
                                    <span className={styles.duration}>3:45</span>
                                </div>
                            </div>

                            <div className={styles.answerText}>
                                {featuredAnswer.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className={idx === 0 ? styles.quote : ''}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.upvotePill}>
                                    <ThumbsUp size={16} /> 2.4k Upvotes
                                </div>
                                <div className={styles.footerActions}>
                                    <div className={styles.actionBtn}>
                                        <Share2 size={18} /> Share
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <aside className={styles.sidebar}>
                    <div className={styles.widget}>
                        <h3 className={styles.widgetTitle}>About the Scholar</h3>
                        <div className={styles.aboutScholar}>
                            <img
                                src={scholar?.avatar || `https://ui-avatars.com/api/?name=${scholar?.name}&background=10b981&color=fff`}
                                alt={scholar?.name}
                                className={styles.smallScholarAvatar}
                            />
                            <span className={styles.scholarWidgetName}>{scholar?.name}</span>
                            <span className={styles.scholarWidgetRole}>{scholar?.specialization || 'Imam & Author'}</span>
                            <p className={styles.scholarWidgetBio}>
                                {scholar?.bio || 'Dedicated scholar specializing in contemporary Islamic issues.'}
                            </p>
                            <button className={styles.viewProfileBtn}>View Profile</button>
                        </div>
                    </div>

                    <div className={styles.widget}>
                        <h3 className={styles.widgetTitle}>Community Guidelines</h3>
                        <div className={styles.guidelinesList}>
                            {[
                                "Respect differing scholarly opinions",
                                "Maintain etiquette (Adab) in discussions",
                                "Avoid political debates and polemics"
                            ].map((text, i) => (
                                <div key={i} className={styles.guidelineItem}>
                                    <Check size={14} className={styles.checkIcon} strokeWidth={4} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '0 0.5rem', color: '#9ca3af', fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                        </div>
                        <span>© 2026 DinJiggasa</span>
                    </div>
                </aside>
            </div>
        </DashboardLayout>
    )
}
