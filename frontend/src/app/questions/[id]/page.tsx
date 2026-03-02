"use client"

import { useEffect, useState, use } from 'react'
import { ArrowLeft, CheckCircle2, MessageSquare, Share2, ThumbsUp, ThumbsDown, Check } from "lucide-react"
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
    ratings?: { value: number; userId: string }[];
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
    ratings?: { value: number; userId: string }[];
    _count: { ratings: number };
}

export default function QuestionDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise)
    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('auth-storage')
        if (token) {
            try {
                const parsed = JSON.parse(token)
                setUserId(parsed.state?.user?.id)
            } catch (e) { }
        }
    }, [])

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

    const handleVote = async (value: number) => {
        if (!userId) {
            alert("Please login to vote")
            return
        }
        try {
            const res = await api.post(`/questions/${question.id}/vote`, { value })
            setQuestion(prev => prev ? {
                ...prev,
                ratings: res.data,
                _count: { ...prev._count, ratings: res.data.length }
            } : null)
        } catch (error) {
            console.error('Failed to vote:', error)
        }
    }

    return (
        <DashboardLayout>
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

                        <div className={styles.answerText}>
                            {featuredAnswer.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className={idx === 0 ? styles.quote : ''}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className={styles.cardFooter}>
                            <div
                                className={`${styles.upvotePill} ${question.ratings?.some(r => r.userId === userId && r.value === 1) ? styles.upvotePillActive : ''}`}
                                onClick={() => handleVote(1)}
                            >
                                <ThumbsUp size={16} /> {(question.ratings?.filter(r => r.value === 1).length || 0) - (question.ratings?.filter(r => r.value === -1).length || 0)} Upvotes
                            </div>
                            <div className={styles.footerActions}>
                                <div className={styles.actionBtn}>
                                    <Share2 size={18} /> Share
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.footerLinksWrapper}>
                    <div className={styles.footerLinks}>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                    <span>© 2026 DinJiggasa</span>
                </div>
            </div>
        </DashboardLayout>
    )
}
