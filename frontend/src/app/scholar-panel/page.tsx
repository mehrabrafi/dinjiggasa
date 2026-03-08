"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './scholar-panel.module.css'
import {
    LayoutDashboard,
    Home,
    MessageCircleQuestion,
    BarChart3,
    LogOut,
    CheckCircle2,
    ArrowRight,
    MessageSquareQuote,
    Clock,
    ThumbsUp,
    TrendingUp,
    Inbox,
    Award,
    Filter,
    Search,
    Check,
    XCircle,
    Video
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

interface ScholarStats {
    totalAnswers: number
    totalUpvotes: number
    pendingQuestions: number
    answersThisWeek: number
    peopleHelped: number
    totalViews: number
    topTopic: string
    responseRate: number
    totalDirected: number
    totalAnswered: number
}

export default function ScholarPanel() {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [questions, setQuestions] = useState<any[]>([])
    const [urgentQuestions, setUrgentQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<ScholarStats | null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        if (user?.role !== 'SCHOLAR' && user?.role !== 'ADMIN') {
            toast.error("You are not authorized to view this page.")
            router.push('/')
            return
        }

        setIsAuthorized(true)

        const fetchData = async () => {
            try {
                const [directedRes, urgentRes, statsRes] = await Promise.all([
                    api.get('/questions/directed'),
                    api.get('questions/urgent/all'),
                    api.get('/scholars/stats')
                ])
                setQuestions(directedRes.data)
                setUrgentQuestions(urgentRes.data)
                setStats(statsRes.data)
            } catch (err) {
                console.error("Failed to load data", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [isAuthenticated, user, router])

    const scholarName = user?.name || "Scholar"

    const handleAccept = async (id: string) => {
        try {
            await api.post(`/questions/${id}/accept`)
            toast.success("Question accepted!")
            setQuestions(questions.map(q => q.id === id ? { ...q, acceptedById: user?.id } : q))
        } catch (err: any) {
            console.error("Failed to accept question", err)
            toast.error(err.response?.data?.message || "Failed to accept question.")
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await api.post(`/questions/${id}/decline`)
            toast.success("Question declined")
            setQuestions(questions.filter(q => q.id !== id))
        } catch (err: any) {
            console.error("Failed to decline question", err)
            toast.error(err.response?.data?.message || "Failed to decline question")
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
        }
        return num.toLocaleString()
    }

    if (!isAuthorized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--primary)',
                fontWeight: 600
            }}>
                Verifying permissions...
            </div>
        )
    }

    // Normal pending questions: (directed or accepted by user) AND not urgent AND not answered by user
    const pendingQuestionsList = questions.filter(q =>
        !q.isUrgent && !q.answers?.some((a: any) => a.authorId === user?.id)
    )

    // Total new (normal + urgent) unanswered questions for the sidebar badge
    const totalNewCount = questions.filter(q =>
        !q.answers?.some((a: any) => a.authorId === user?.id)
    ).length

    const pendingDirected = questions.filter(q =>
        q.acceptedById !== user?.id &&
        !q.isUrgent &&
        !q.answers?.some((a: any) => a.authorId === user?.id)
    )

    return (
        <>
            <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.welcomeTitle}>Welcome back, {scholarName.split(' ')[0]}</h1>
                    <p className={styles.welcomeSubtitle}>Here's what's happening with your questions today.</p>
                </div>
                <Link href="/scholar-panel/live" style={{ textDecoration: 'none' }}>
                    <button className={styles.goLiveBtn}>
                        <Video size={20} />
                        Go Live Now
                    </button>
                </Link>
            </header>

            <div className={styles.dashboardGrid}>
                {/* Left Column */}
                <section>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                                    <Inbox size={18} />
                                </div>
                                {stats && stats.totalAnswers > 0 && (
                                    <span className={styles.statChange} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                                        {stats.answersThisWeek > 0 ? `+${stats.answersThisWeek} this week` : '—'}
                                    </span>
                                )}
                            </div>
                            <div className={styles.statLabel}>Total Answers</div>
                            <div className={styles.statValue}>
                                {isLoading ? '...' : formatNumber(stats?.totalAnswers || 0)}
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIconWrapper} style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                                    <MessageSquareQuote size={18} />
                                </div>
                            </div>
                            <div className={styles.statLabel}>Pending Questions</div>
                            <div className={styles.statValue}>
                                {isLoading ? '...' : stats?.pendingQuestions || 0}
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIconWrapper} style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                                    <ThumbsUp size={18} />
                                </div>
                            </div>
                            <div className={styles.statLabel}>Total Upvotes</div>
                            <div className={styles.statValue}>
                                {isLoading ? '...' : formatNumber(stats?.totalUpvotes || 0)}
                            </div>
                        </div>
                    </div>

                    {urgentQuestions.length > 0 && (
                        <>
                            <div className={styles.sectionHeader} style={{ marginBottom: '1rem' }}>
                                <h2 className={styles.sectionTitle} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🚨 Urgent Questions
                                </h2>
                            </div>

                            <div className={styles.questionsList} style={{ marginBottom: '2.5rem' }}>
                                {urgentQuestions.map((question) => (
                                    <div key={question.id} className={styles.questionCard} style={{ borderLeft: '4px solid #ef4444', backgroundColor: '#fffcfc' }}>
                                        <div className={styles.askerInfo}>
                                            <img
                                                src={question.author?.avatar || `https://ui-avatars.com/api/?name=${question.author?.name || 'User'}&background=006D5B&color=fff&bold=true`}
                                                alt={question.author?.name}
                                                className={styles.askerAvatar}
                                            />
                                            <div className={styles.askerText}>
                                                Asked by <span className={styles.askerNameText}>{question.author?.name || 'User'}</span>
                                                {question.author?.gender && (
                                                    <span className={styles.genderTag}>Gender: {question.author.gender}</span>
                                                )}
                                                <span className={styles.questionDot}>•</span>
                                                {new Date(question.createdAt).toLocaleDateString()}
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                                <span className={styles.categoryBadge} style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 'bold' }}>
                                                    URGENT
                                                </span>
                                                {question.tags?.[0] && (
                                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: 'var(--primary)' }}>
                                                        {question.tags[0].name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className={styles.questionTitle}>{question.title}</h3>
                                        <p className={styles.questionExcerpt}>
                                            {question.body}
                                        </p>
                                        <div className={styles.actionsRow} style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                            {question.acceptedById === user?.id ? (
                                                <Link href={`/scholar-panel/answer/${question.id}`} style={{ textDecoration: 'none' }}>
                                                    <button className={styles.answerBtn}>
                                                        <MessageCircleQuestion size={16} strokeWidth={3} /> Answer Now
                                                    </button>
                                                </Link>
                                            ) : (
                                                <Link href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
                                                    <button className={styles.acceptBtn}>
                                                        <ArrowRight size={16} strokeWidth={3} /> View Question
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Pending Questions</h2>
                        <Link href="/scholar-panel/new-questions" className={styles.viewAll}>View All</Link>
                    </div>

                    <div className={styles.questionsList}>
                        {isLoading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading questions...</div>
                        ) : pendingQuestionsList.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No pending questions.</div>
                        ) : (
                            pendingQuestionsList.map((question) => (
                                <div key={`pending-${question.id}`} className={styles.questionCard}>
                                    <div className={styles.askerInfo}>
                                        <img
                                            src={question.author.avatar || `https://ui-avatars.com/api/?name=${question.author.name}&background=006D5B&color=fff&bold=true`}
                                            alt={question.author.name}
                                            className={styles.askerAvatar}
                                        />
                                        <div className={styles.askerText}>
                                            Asked by <span className={styles.askerNameText}>{question.author.name}</span>
                                            {question.author.gender && (
                                                <span className={styles.genderTag}>Gender: {question.author.gender}</span>
                                            )}
                                            <span className={styles.questionDot}>•</span>
                                            {new Date(question.createdAt).toLocaleDateString()}
                                        </div>
                                        {question.isUrgent && (
                                            <div style={{ marginLeft: 'auto' }}>
                                                <span className={styles.categoryBadge} style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 'bold' }}>
                                                    🚨 URGENT
                                                </span>
                                            </div>
                                        )}
                                        {!question.isUrgent && question.tags?.[0] && (
                                            <div style={{ marginLeft: 'auto' }}>
                                                <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: 'var(--primary)' }}>
                                                    {question.tags[0].name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={styles.questionTitle}>{question.title}</h3>
                                    <p className={styles.questionExcerpt}>
                                        {question.body}
                                    </p>
                                    <div className={styles.actionsRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        {question.acceptedById === user?.id ? (
                                            <Link href={`/scholar-panel/answer/${question.id}`} style={{ textDecoration: 'none' }}>
                                                <button className={styles.answerBtn}>
                                                    <MessageCircleQuestion size={16} strokeWidth={3} /> Answer Now
                                                </button>
                                            </Link>
                                        ) : (
                                            <>
                                                <button className={styles.acceptBtn} onClick={() => handleAccept(question.id)}>
                                                    <CheckCircle2 size={16} strokeWidth={3} /> Accept
                                                </button>
                                                <button className={styles.declineBtn} onClick={() => handleDecline(question.id)}>
                                                    <XCircle size={16} strokeWidth={3} /> Decline
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Right Column */}
                <aside className={styles.rightSidebar}>
                    {/* Impact Card */}
                    <div className={styles.impactCard}>
                        <h3 className={styles.impactTitle}>Your Impact</h3>
                        <p className={styles.impactSubtitle}>This week&apos;s community engagement</p>

                        <div className={styles.impactValue}>
                            {isLoading ? '...' : stats?.peopleHelped || 0} <span className={styles.impactUnit}>people helped</span>
                        </div>

                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{
                                width: `${Math.min((stats?.answersThisWeek || 0) * 10, 100)}%`,
                                background: 'linear-gradient(to right, #34d399, var(--primary))'
                            }}></div>
                        </div>

                        <div className={styles.progressLabelRow}>
                            <span className={styles.goalLabel}>Weekly Goal</span>
                            <span className={styles.topBadge}>
                                {stats?.responseRate ? `${stats.responseRate}% Response` : '—'}
                            </span>
                        </div>

                        <div className={styles.impactBgIcon}>
                            <Award size={100} />
                        </div>
                    </div>

                    {/* Quick Analytics */}
                    <div className={styles.analyticsCard}>
                        <h3 className={styles.analyticsTitle}>Quick Analytics</h3>

                        <div className={styles.analyticsList}>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>Response Rate</span>
                                <span className={styles.analyticsValue}>
                                    {isLoading ? '...' : `${stats?.responseRate || 0}%`}
                                </span>
                            </div>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>Answers This Week</span>
                                <span className={styles.analyticsValue} style={{ color: 'var(--primary)' }}>
                                    {isLoading ? '...' : stats?.answersThisWeek || 0}
                                </span>
                            </div>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>Top Topic</span>
                                <span className={styles.analyticsValue}>
                                    {isLoading ? '...' : stats?.topTopic || 'General'}
                                </span>
                            </div>
                        </div>

                        <Link href="/scholar-panel/analytics" className={styles.viewReport}>
                            View Full Report <ArrowRight size={14} />
                        </Link>
                    </div>
                </aside>
            </div>
        </>
    )
}
