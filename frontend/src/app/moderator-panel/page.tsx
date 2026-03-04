"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './moderator.module.css'
import {
    Activity,
    MessageCircleQuestion,
    ShieldAlert,
    Users,
    TrendingUp,
    Inbox,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function ModeratorDashboard() {
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)
    const [reports, setReports] = useState<any[]>([])
    const [counts, setCounts] = useState({
        newQuestions: 0,
        activeReports: 0,
        flaggedContent: 0,
        totalScholars: 0
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [reportsRes, statsRes] = await Promise.all([
                api.get('/reports'),
                api.get('/questions/stats/global')
            ])
            const allReports = reportsRes.data
            const globalStats = statsRes.data
            setReports(allReports.slice(0, 3)) // only show 3

            setCounts({
                newQuestions: globalStats.totalQuestions,
                activeReports: allReports.filter((r: any) => r.status === 'PENDING').length,
                flaggedContent: allReports.length,
                totalScholars: globalStats.totalScholars
            })
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/reports/${id}/status`, { status })
            toast.success(`Report ${status.toLowerCase()}`)
            fetchData()
        } catch (error) {
            toast.error('Action failed')
        }
    }

    const stats = [
        { label: 'New Questions', value: counts.newQuestions.toString(), icon: <Inbox size={18} />, color: '#eff6ff', textColor: '#3b82f6' },
        { label: 'Active Reports', value: counts.activeReports.toString(), icon: <ShieldAlert size={18} />, color: '#fef2f2', textColor: '#ef4444' },
        { label: 'Flagged Content', value: counts.flaggedContent.toString(), icon: <Clock size={18} />, color: '#fff7ed', textColor: '#f97316' },
        { label: 'Total Scholars', value: counts.totalScholars.toString(), icon: <Users size={18} />, color: '#f5f3ff', textColor: '#8b5cf6' },
    ]

    const activities = [
        { text: 'Scholar B answered 5 questions', time: '10 mins ago', color: '#10b981' },
        { text: 'System backup completed', time: '3 hours ago', color: '#94a3b8' },
    ]

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.welcomeTitle}>Moderator Control Center</h1>
                <p className={styles.welcomeSubtitle}>Clean up the platform, manage reports, and ensure safety.</p>
            </header>

            <div className={styles.dashboardGrid}>
                {/* Left Column */}
                <section>
                    <div className={styles.statsGrid}>
                        {stats.map((stat, i) => (
                            <div key={i} className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={styles.statIconWrapper} style={{ backgroundColor: stat.color, color: stat.textColor }}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statValue}>{isLoading ? '...' : stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Flags & Reports</h2>
                        <Link href="/moderator-panel/reports" className={styles.viewAll}>View All</Link>
                    </div>

                    <div className={styles.contentList}>
                        {reports.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No recent reports</div>
                        ) : reports.map((report: any) => (
                            <div key={report.id} className={styles.contentCard}>
                                <div className={styles.contentMeta}>
                                    <span className={`${styles.contentType} ${report.questionId ? styles.typeQuestion : styles.typeAnswer}`}>
                                        {report.questionId ? 'Question' : 'Answer'}
                                    </span>
                                    <span className={styles.activityTime}>{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className={styles.contentTitle}>{report.question?.title || report.answer?.content?.substring(0, 100)}</h3>
                                <div className={styles.contentExcerpt}>
                                    <strong>Reporter:</strong> {report.reporter?.name} <br />
                                    <strong>Reason:</strong> <span style={{ color: '#ef4444' }}>{report.reason}</span>
                                </div>
                                <div className={styles.contentActions}>
                                    <button
                                        className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                        onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                                    >
                                        Dismiss
                                    </button>
                                    <Link
                                        href="/moderator-panel/reports"
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        Take Action
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right Column */}
                <aside className={styles.rightSidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Recent Activity</h3>
                        <div className={styles.activityList}>
                            {activities.map((activity, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <div className={styles.activityDot} style={{ backgroundColor: activity.color }}></div>
                                    <div className={styles.activityText}>
                                        {activity.text}
                                        <span className={styles.activityTime}>{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>System Health</h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <CheckCircle2 size={16} color="#10b981" />
                                <div className={styles.activityText}>API Online (32ms lat)</div>
                            </div>
                            <div className={styles.activityItem}>
                                <CheckCircle2 size={16} color="#10b981" />
                                <div className={styles.activityText}>Database Balanced</div>
                            </div>
                            <div className={styles.activityItem}>
                                <Activity size={16} color="#3b82f6" />
                                <div className={styles.activityText}>85% Traffic Capacity</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card} style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe' }}>
                        <h3 className={styles.cardTitle} style={{ color: '#1e40af' }}>Moderation Tip</h3>
                        <p className={styles.activityText} style={{ color: '#1e40af', opacity: 0.8 }}>
                            Regularly review flagged questions and reports to maintain a high-quality community environment.
                        </p>
                    </div>
                </aside>
            </div>
        </>
    )
}
