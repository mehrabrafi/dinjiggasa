"use client"

import DashboardLayout from '@/components/layout/DashboardLayout'
import styles from '../dashboard.module.css'
import { Bookmark, MessageSquare, PlusCircle, ArrowUp, ArrowDown, Share } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export default function MyFeedPage() {
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [questions, setQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        if (!isAuthenticated) return;

        const token = localStorage.getItem('auth-storage')
        if (token) {
            try {
                const parsed = JSON.parse(token)
                setUserId(parsed.state?.user?.id)
            } catch (e) { }
        }

        const fetchSavedQuestions = async () => {
            try {
                const res = await api.get('/questions/saved/all')
                setQuestions(res.data)
            } catch (error) {
                console.error("Failed to load saved questions", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSavedQuestions()
    }, [isAuthenticated])

    const handleVote = async (questionId: string, value: number) => {
        try {
            const res = await api.post(`/questions/${questionId}/vote`, { value })
            setQuestions(prev => prev.map(q => {
                if (q.id === questionId) {
                    return { ...q, ratings: res.data }
                }
                return q
            }))
        } catch (err) {
            console.error("Failed to vote", err)
        }
    }

    const handleUnsave = async (questionId: string) => {
        try {
            await api.post(`/questions/${questionId}/save`)
            // After successful toggling (which removes it from saved), remove from state
            setQuestions(prev => prev.filter(q => q.id !== questionId))
        } catch (err) {
            console.error("Failed to unsave question", err)
        }
    }

    const handleUnsaveAll = async () => {
        if (!confirm("Are you sure you want to remove all saved answers?")) return;

        try {
            await api.post('/questions/saved/unsave-all')
            setQuestions([])
        } catch (err) {
            console.error("Failed to unsave all answers", err)
        }
    }

    if (!isAuthenticated) {
        return (
            <DashboardLayout>
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Please log in to view saved answers.</h2>
                    <button onClick={() => router.push('/login')} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: 'var(--primary, #006D5B)', color: 'white', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>Login</button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <main className={styles.feedContent} style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingTop: '24px' }}>
                <div style={{ padding: '0 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '50%' }}>
                            <Bookmark size={24} color="var(--primary, #006D5B)" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Saved Answers</h1>
                    </div>
                    {questions.length > 0 && (
                        <button
                            onClick={handleUnsaveAll}
                            style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#fef2f2';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Unsave All
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
                ) : questions.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>You haven't saved any questions yet. Start exploring and bookmarking your favorite answers!</div>
                ) : (
                    questions.map((question) => {
                        const upvotes = question.ratings?.filter((r: any) => r.value === 1).length || 0
                        const downvotes = question.ratings?.filter((r: any) => r.value === -1).length || 0
                        const voteScore = upvotes - downvotes
                        const myVote = question.ratings?.find((r: any) => r.userId === userId)?.value || 0

                        return (
                            <div key={question.id} className={styles.card} style={{ marginBottom: '20px' }}>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardTagsWrapper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 0' }}>
                                        <div className={styles.cardTags}>
                                            <span className={styles.tagPrimaryDark}>{question.tags?.[0]?.name || "General"}</span>
                                        </div>
                                        <button
                                            onClick={() => handleUnsave(question.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--primary, #006D5B)',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            title="Unsave Answer"
                                        >
                                            <Bookmark size={20} fill="currentColor" />
                                        </button>
                                    </div>

                                    <Link href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
                                        <h2 className={styles.cardTitle} style={{ cursor: 'pointer', margin: '0 0 12px 0' }}>{question.title}</h2>
                                    </Link>

                                    {question.answers && question.answers.length > 0 && (
                                        <div className={styles.cardAuthorRow} style={{ marginBottom: '12px' }}>
                                            <img src={question.answers[0].author?.avatar || `https://ui-avatars.com/api/?name=${question.answers[0].author?.name}&background=10b981&color=fff`} alt={question.answers[0].author?.name} className={styles.cardAuthorAvatar} />
                                            <span>
                                                <span className={styles.cardAuthorName}>{question.answers[0].author?.name}</span> • {new Date(question.answers[0].createdAt || question.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <p className={styles.cardText} style={{ marginBottom: '16px' }}>
                                        {question.body.length > 200 ? `${question.body.substring(0, 200)}...` : question.body}
                                    </p>

                                    <div className={styles.cardActions}>
                                        <div className={styles.voteGroup}>
                                            <button
                                                className={`${styles.voteAction} ${myVote === 1 ? styles.voteUp : ''}`}
                                                onClick={() => handleVote(question.id, 1)}
                                                style={{ color: myVote === 1 ? '#10b981' : undefined }}
                                            >
                                                <ArrowUp size={16} /> {voteScore}
                                            </button>
                                            <div className={styles.voteDivider}></div>
                                            <button
                                                className={`${styles.voteAction}`}
                                                onClick={() => handleVote(question.id, -1)}
                                                style={{ color: myVote === -1 ? '#ef4444' : undefined }}
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.actionBtn}>
                                                <Share size={16} /> Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </main>
        </DashboardLayout>
    )
}
