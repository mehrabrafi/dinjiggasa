"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowUp, ArrowDown, Share, CheckCircle2 } from "lucide-react"
import api from "@/lib/axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "../../dashboard.module.css"

export default function TopicPage() {
    const params = useParams()
    const topic = typeof params.topic === 'string' ? decodeURIComponent(params.topic) : ''

    const [questions, setQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('auth-storage')
        if (token) {
            try {
                const parsed = JSON.parse(token)
                setUserId(parsed.state?.user?.id)
            } catch (e) { }
        }

        const fetchQuestions = async () => {
            try {
                const res = await api.get('/questions', { params: { tag: topic.toLowerCase() } })
                setQuestions(res.data)
            } catch (error) {
                console.error(`Failed to load questions for topic ${topic}`, error)
            } finally {
                setIsLoading(false)
            }
        }

        if (topic) {
            fetchQuestions()
        }
    }, [topic])

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

    // Capitalize topic name strictly for display
    const displayTopic = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : ''

    return (
        <DashboardLayout>
            <main className={styles.feedContent} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Topic: {displayTopic}</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Questions related to {displayTopic}
                    </p>
                </div>

                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading questions...</div>
                ) : questions.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                        No questions available for this topic yet.
                    </div>
                ) : (
                    questions.map((question) => {
                        const upvotes = question.ratings?.filter((r: any) => r.value === 1).length || 0
                        const downvotes = question.ratings?.filter((r: any) => r.value === -1).length || 0
                        const voteScore = upvotes - downvotes
                        const myVote = question.ratings?.find((r: any) => r.userId === userId)?.value || 0

                        // We show the question if it has answers OR if we just want to show all questions for this topic
                        // Based on the user's dashboard they only show answered questions. Let's show all here, or maybe format depending on answers.
                        const hasAnswers = question.answers && question.answers.length > 0;

                        return (
                            <div key={question.id} className={styles.card} style={{ marginBottom: '1.5rem' }}>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardTagsWrapper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div className={styles.cardTags}>
                                            <span className={styles.tagPrimaryDark}>{question.tags?.[0]?.name || displayTopic}</span>
                                        </div>
                                    </div>

                                    <Link href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
                                        <h2 className={styles.cardTitle} style={{ cursor: 'pointer' }}>{question.title}</h2>
                                    </Link>

                                    {hasAnswers ? (
                                        <div className={styles.cardAuthorRow}>
                                            <img src={question.answers[0].author?.avatar || `https://ui-avatars.com/api/?name=${question.answers[0].author?.name}&background=10b981&color=fff`} alt={question.answers[0].author?.name} className={styles.cardAuthorAvatar} />
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span className={styles.cardAuthorName}>{question.answers[0].author?.name}</span>
                                                {question.answers[0].author?.isVerified && <CheckCircle2 size={14} color="#006D5B" fill="#006D5B1A" />}
                                                • {new Date(question.answers[0].createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className={styles.cardAuthorRow}>
                                            <img src={question.author?.avatar || `https://ui-avatars.com/api/?name=${question.author?.name}&background=64748b&color=fff`} alt={question.author?.name} className={styles.cardAuthorAvatar} />
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span className={styles.cardAuthorName}>{question.author?.name}</span>
                                                {question.author?.isVerified && <CheckCircle2 size={14} color="#006D5B" fill="#006D5B1A" />}
                                                • Asked on {new Date(question.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <p className={styles.cardText}>
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
