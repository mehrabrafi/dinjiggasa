"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './scholar-panel.module.css'
import {
    Clock,
    ChevronRight,
    XCircle,
    CheckCircle2
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

interface QuestionsViewProps {
    type: 'pending' | 'urgent' | 'answers' | 'drafts'
    title: string
}

export default function QuestionsView({ type, title }: QuestionsViewProps) {
    const { user } = useAuthStore()
    const [directedQuestions, setDirectedQuestions] = useState<any[]>([])
    const [myAnswers, setMyAnswers] = useState<any[]>([])

    const [draftQuestions, setDraftQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const handleAccept = async (id: string) => {
        try {
            await api.post(`/questions/${id}/accept`)
            toast.success("Question accepted!")
            setDirectedQuestions(directedQuestions.map(q => q.id === id ? { ...q, acceptedById: user?.id } : q))
        } catch (err: any) {
            console.error("Failed to accept question", err)
            toast.error(err.response?.data?.message || "Failed to accept question.")
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await api.post(`/questions/${id}/decline`)
            toast.success("Question declined")
            setDirectedQuestions(directedQuestions.filter(q => q.id !== id))
        } catch (err: any) {
            console.error("Failed to decline question", err)
            toast.error(err.response?.data?.message || "Failed to decline question")
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [directedRes, answersRes, draftsRes] = await Promise.all([
                    api.get("/questions/directed"),
                    api.get("/scholars/my-answers"),
                    api.get("/questions/draft/all"),
                ])
                setDirectedQuestions(directedRes.data || [])
                setMyAnswers(answersRes.data || [])
                setDraftQuestions(draftsRes.data || [])
            } catch (err) {
                console.error("Failed to fetch data:", err)
                toast.error("Failed to load questions")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAllData()
    }, [user?.id, type])

    // Filtered questions based on type
    const getFilteredQuestions = () => {
        let filtered: any[] = []

        if (type === 'pending') {
            filtered = directedQuestions.filter(q =>
                !q.isUrgent && !q.answers?.some((a: any) => a.authorId === user?.id)
            )
        } else if (type === 'urgent') {
            filtered = directedQuestions.filter(q =>
                q.isUrgent && !q.answers?.some((a: any) => a.authorId === user?.id)
            )
        } else if (type === 'answers') {
            filtered = myAnswers.map(a => ({
                ...a.question,
                scholarAnswer: a,
            }))

        } else if (type === 'drafts') {
            filtered = draftQuestions
        }

        return filtered
    }

    const filteredQuestions = getFilteredQuestions()

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.welcomeTitle} style={{ fontSize: '1.5rem' }}>{title}</h1>
            </header>

            <div className={styles.dashboardGrid} style={{ gridTemplateColumns: '1fr' }}>
                <section>
                    <div className={styles.questionsList}>
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading questions...</div>
                        ) : filteredQuestions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', backgroundColor: 'white', borderRadius: '1rem' }}>
                                {type === 'pending' && 'No pending questions directed to you.'}
                                {type === 'urgent' && 'No urgent questions at the moment.'}
                                {type === 'answers' && 'You haven\'t answered any questions yet.'}

                                {type === 'drafts' && 'You have no saved drafts.'}
                            </div>
                        ) : (
                            filteredQuestions.map((q) => (
                                <div key={type === 'answers' ? `ans-${q.scholarAnswer?.id}` : type === 'drafts' ? `draft-${q.id}` : `q-${q.id}`} className={styles.questionCard} style={q.isUrgent && type !== 'answers' ? { borderLeft: '4px solid #ef4444' } : {}}>
                                    {type !== 'answers' ? (
                                        <div className={styles.askerInfo}>
                                            <img
                                                src={q.author?.avatar || `https://ui-avatars.com/api/?name=${q.author?.name || 'User'}&background=006D5B&color=fff&bold=true`}
                                                alt={q.author?.name}
                                                className={styles.askerAvatar}
                                            />
                                            <div className={styles.askerText}>
                                                Asked by <span className={styles.askerNameText}>{q.author?.name || 'User'}</span>
                                                {q.author?.gender && (
                                                    <span className={styles.genderTag}>Gender: {q.author.gender}</span>
                                                )}
                                                <span className={styles.questionDot}>•</span>
                                                {new Date(q.createdAt).toLocaleDateString()}
                                            </div>
                                            {q.isUrgent && (
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 'bold' }}>
                                                        🚨 URGENT
                                                    </span>
                                                </div>
                                            )}
                                            {!q.isUrgent && q.tags?.[0] && (
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: 'var(--primary)' }}>
                                                        {q.tags[0].name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.questionMeta}>
                                            <div className={styles.badgeRow}>
                                                {q.tags?.[0] && (
                                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: 'var(--primary)' }}>
                                                        {q.tags[0].name}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <Clock size={14} /> {new Date(q.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                    <h3 className={styles.questionTitle}>{q.title}</h3>
                                    <p className={styles.questionExcerpt}>
                                        {(q.body || '').length > 200 ? q.body.substring(0, 200) + "..." : q.body}
                                    </p>


                                    <div className={styles.cardFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                            {type === 'answers' ? (
                                                <Link href={`/questions/${q.id}`} style={{ textDecoration: 'none' }}>
                                                    <button className={styles.answerBtn} style={{ background: 'var(--primary)' }}>
                                                        <ChevronRight size={16} strokeWidth={3} /> View Full Answer
                                                    </button>
                                                </Link>
                                            ) : q.acceptedById === user?.id || type === 'drafts' ? (
                                                <Link href={`/scholar-panel/answer/${q.id}`} style={{ textDecoration: 'none' }}>
                                                    <button className={styles.answerBtn}>
                                                        <CheckCircle2 size={16} fill="white" color="var(--primary)" /> {type === 'drafts' ? 'Continue Answering' : 'Answer Now'}
                                                    </button>
                                                </Link>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                    <button className={styles.acceptBtn} onClick={() => handleAccept(q.id)}>
                                                        <CheckCircle2 size={16} strokeWidth={3} /> Accept
                                                    </button>
                                                    <button className={styles.declineBtn} onClick={() => handleDecline(q.id)}>
                                                        <XCircle size={16} strokeWidth={3} /> Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}
