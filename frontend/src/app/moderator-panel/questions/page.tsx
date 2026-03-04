"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../moderator.module.css'
import {
    Filter,
    Search,
    MessageCircleQuestion,
    Edit,
    CheckCircle2,
    XCircle,
    Trash2,
    Eye
} from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function QuestionsModerationPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [questions, setQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchQuestions = async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/questions')
            setQuestions(res.data)
        } catch (error) {
            console.error('Failed to fetch questions:', error)
            toast.error('Failed to load questions')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const handleDeleteContent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return
        try {
            await api.delete(`/questions/${id}`)
            toast.success('Question deleted successfully')
            fetchQuestions()
        } catch (error) {
            console.error('Failed to delete question:', error)
            toast.error('Deletion failed')
        }
    }

    const filteredQuestions = activeTab === 'all'
        ? questions
        : activeTab === 'new'
            ? questions.filter(q => !q.acceptedById && q.answers.length === 0)
            : questions.filter(q => q.isUrgent) // Mocking flagged as urgent for now in this view

    return (
        <div className={styles.innerLayout}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Manage Questions</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8125rem' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'all' ? 700 : 500, color: activeTab === 'all' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'all' ? '2px solid #3b82f6' : 'none' }}>
                    All Questions ({questions.length})
                </button>
                <button
                    onClick={() => setActiveTab('new')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'new' ? 700 : 500, color: activeTab === 'new' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'new' ? '2px solid #3b82f6' : 'none' }}>
                    New ({questions.filter(q => !q.acceptedById && q.answers.length === 0).length})
                </button>
                <button
                    onClick={() => setActiveTab('urgent')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'urgent' ? 700 : 500, color: activeTab === 'urgent' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'urgent' ? '2px solid #3b82f6' : 'none' }}>
                    Urgent ({questions.filter(q => q.isUrgent).length})
                </button>
            </div>

            <div className={styles.contentList}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading questions...</div>
                ) : filteredQuestions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No questions found.</div>
                ) : filteredQuestions.map((question) => (
                    <div key={question.id} className={styles.contentCard} style={{ borderLeft: question.isUrgent ? '4px solid #ef4444' : 'none' }}>
                        <div className={styles.contentMeta}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {question.tags?.map((tag: any) => (
                                    <span key={tag.id} className={`${styles.contentType} ${styles.typeQuestion}`}>
                                        {tag.name}
                                    </span>
                                ))}
                                {question.isUrgent && (
                                    <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 800 }}>URGENT</span>
                                )}
                            </div>
                            <span className={styles.activityTime}>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className={styles.contentTitle}>{question.title}</h3>
                        <div className={styles.contentExcerpt}>
                            <strong>Author:</strong> {question.author?.name}
                        </div>
                        <div className={styles.contentActions}>
                            <Link
                                href={`/questions/${question.id}`}
                                className={`${styles.actionBtn}`}
                                style={{ border: '1px solid #e2e8f0', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                            >
                                <Eye size={14} /> Preview
                            </Link>
                            <button
                                onClick={() => handleDeleteContent(question.id)}
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Trash2 size={14} /> Delete Question
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
