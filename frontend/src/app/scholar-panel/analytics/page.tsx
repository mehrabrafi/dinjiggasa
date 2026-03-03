"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './analytics.module.css'
import panelStyles from '../scholar-panel.module.css'
import {
    LayoutDashboard,
    Home,
    MessageCircleQuestion,
    BarChart3,
    LogOut,
    Check,
    ChevronDown,
    Download,
    TrendingUp,
    MessageSquare,
    Headphones,
    ThumbsUp,
    Users,
    Globe,
    CheckCircle2,
    Eye
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

interface AnalyticsData {
    totalAnswers: number
    totalUpvotes: number
    totalViews: number
    peopleHelpedThisMonth: number
    topCategories: { name: string; count: number; percentage: number }[]
    topPerforming: {
        id: string
        questionId: string
        topic: string
        category: string
        views: number
        upvotes: number
        isAccepted: boolean
        createdAt: string
    }[]
    recentAnswersCount: number
}

interface ScholarStats {
    totalAnswers: number
    totalUpvotes: number
    pendingQuestions: number
    answersThisWeek: number
    peopleHelped: number
    totalViews: number
    topTopic: string
    responseRate: number
}

export default function AnalyticsPage() {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
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
    }, [isAuthenticated, user, router])

    useEffect(() => {
        if (!isAuthorized) return

        const fetchAnalytics = async () => {
            try {
                const [analyticsRes, statsRes] = await Promise.all([
                    api.get('/scholars/analytics'),
                    api.get('/scholars/stats'),
                ])
                setAnalytics(analyticsRes.data)
                setStats(statsRes.data)
            } catch (err) {
                console.error("Failed to fetch analytics", err)
                toast.error("Failed to load analytics data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnalytics()
    }, [isAuthorized])

    const scholarName = user?.name || "Scholar"

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

    const getTimeDiff = (dateStr: string) => {
        const now = new Date()
        const date = new Date(dateStr)
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return 'Posted today'
        if (diffDays === 1) return 'Posted yesterday'
        if (diffDays < 7) return `Posted ${diffDays} days ago`
        if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
        return `Posted ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    }

    if (!isAuthorized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary)', fontWeight: 600 }}>
                Verifying permissions...
            </div>
        )
    }

    // Category colors
    const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    const categoryBgs = ['#eff6ff', '#f0fdf4', '#fff7ed', '#f5f3ff', '#fef2f2']

    return (
        <>
            <div className={styles.headerRow}>
                <div className={styles.titleArea}>
                    <h1>Analytics Overview</h1>
                    <p>Track your impact and community engagement</p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--primary)', fontWeight: 600 }}>
                    Loading analytics...
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className={styles.statsRow}>
                        <StatCard
                            label="Answers Provided"
                            value={formatNumber(analytics?.totalAnswers || 0)}
                            trend={stats?.answersThisWeek ? `+${stats.answersThisWeek} this week` : '—'}
                            icon={<MessageSquare size={18} />}
                            iconBg="#eff6ff"
                            iconColor="#3b82f6"
                        />
                        <StatCard
                            label="Total Views"
                            value={formatNumber(analytics?.totalViews || 0)}
                            trend="—"
                            icon={<Eye size={18} />}
                            iconBg="#f5f3ff"
                            iconColor="#8b5cf6"
                        />
                        <StatCard
                            label="Total Upvotes"
                            value={formatNumber(analytics?.totalUpvotes || 0)}
                            trend="—"
                            icon={<ThumbsUp size={18} />}
                            iconBg="#fff7ed"
                            iconColor="#f97316"
                        />
                        <StatCard
                            label="Response Rate"
                            value={`${stats?.responseRate || 0}%`}
                            trend={stats?.responseRate && stats.responseRate >= 80 ? 'Great!' : '—'}
                            icon={<TrendingUp size={18} />}
                            iconBg="#f0fdf4"
                            iconColor="#10b981"
                        />
                    </div>

                    {/* Chart and Impact Row */}
                    <div className={styles.engagementArea}>
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <h3 className={styles.chartTitle}>Your Activity Summary</h3>
                            </div>
                            <p className={styles.chartPeriod}>Overview of your scholarly contributions</p>

                            <div className={styles.chartView}>
                                {/* Activity summary bars based on real data */}
                                <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', alignItems: 'flex-end', height: '200px' }}>
                                    {[
                                        { label: 'Answers', value: analytics?.totalAnswers || 0, color: 'var(--primary)' },
                                        { label: 'Upvotes', value: analytics?.totalUpvotes || 0, color: '#3b82f6' },
                                        { label: 'Views', value: analytics?.totalViews || 0, color: '#8b5cf6' },
                                        { label: 'Helped', value: analytics?.peopleHelpedThisMonth || 0, color: '#f97316' },
                                    ].map((item, i) => {
                                        const maxVal = Math.max(
                                            analytics?.totalAnswers || 1,
                                            analytics?.totalUpvotes || 1,
                                            analytics?.totalViews || 1,
                                            analytics?.peopleHelpedThisMonth || 1
                                        )
                                        const heightPct = Math.max((item.value / maxVal) * 100, 5)
                                        return (
                                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
                                                    {formatNumber(item.value)}
                                                </span>
                                                <div style={{
                                                    width: '100%',
                                                    maxWidth: '60px',
                                                    height: `${heightPct}%`,
                                                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}88 100%)`,
                                                    borderRadius: '8px 8px 4px 4px',
                                                    minHeight: '8px',
                                                    transition: 'height 0.3s ease',
                                                }} />
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8' }}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className={styles.categoriesCard}>
                                <h3 className={styles.catsTitle}>Top Categories</h3>
                                {analytics?.topCategories && analytics.topCategories.length > 0 ? (
                                    analytics.topCategories.map((cat, i) => (
                                        <CategoryItem
                                            key={cat.name}
                                            label={cat.name}
                                            value={`${cat.percentage}%`}
                                            color={categoryColors[i % categoryColors.length]}
                                        />
                                    ))
                                ) : (
                                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', padding: '1rem 0' }}>
                                        No category data yet. Start answering questions!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Performance Table */}
                    <div className={styles.perfCard}>
                        <div className={styles.perfHeader}>
                            <div className={styles.titleArea}>
                                <h3>Top Performing Answers</h3>
                                <p>Your most engaging contributions</p>
                            </div>
                        </div>

                        {analytics?.topPerforming && analytics.topPerforming.length > 0 ? (
                            <>
                                <div className={styles.tableHeader}>
                                    <span>Question Topic</span>
                                    <span>Category</span>
                                    <span>Views</span>
                                    <span>Upvotes</span>
                                </div>

                                <div className={styles.tableBody}>
                                    {analytics.topPerforming.map((answer, i) => (
                                        <PerfRow
                                            key={answer.id}
                                            topic={answer.topic.length > 50 ? answer.topic.substring(0, 50) + '...' : answer.topic}
                                            date={getTimeDiff(answer.createdAt)}
                                            category={answer.category}
                                            catBg={categoryBgs[i % categoryBgs.length]}
                                            catColor={categoryColors[i % categoryColors.length]}
                                            views={formatNumber(answer.views)}
                                            upvotes={formatNumber(answer.upvotes)}
                                            questionId={answer.questionId}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                No answers yet. Start answering questions to see your performance!
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

function StatCard({ label, value, trend, icon, iconBg, iconColor }: any) {
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <div className={styles.iconCircle} style={{ backgroundColor: iconBg, color: iconColor }}>
                    {icon}
                </div>
                {trend && trend !== '—' && (
                    <div className={styles.trendBadge}>
                        <TrendingUp size={12} /> {trend}
                    </div>
                )}
            </div>
            <div className={styles.cardLabel}>{label}</div>
            <div className={styles.cardValue}>{value}</div>
        </div>
    )
}

function CategoryItem({ label, value, color }: any) {
    return (
        <div className={styles.catItem}>
            <div className={styles.catMeta}>
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className={styles.catBar}>
                <div className={styles.catFill} style={{ width: value, backgroundColor: color }}></div>
            </div>
        </div>
    )
}

function PerfRow({ topic, date, category, catBg, catColor, views, upvotes, questionId }: any) {
    return (
        <Link href={`/questions/${questionId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.tableRow} style={{ cursor: 'pointer' }}>
                <div className={styles.topicCell}>
                    <h4>{topic}</h4>
                    <span>{date}</span>
                </div>
                <div>
                    <span className={styles.catBadge} style={{ backgroundColor: catBg, color: catColor }}>{category}</span>
                </div>
                <div className={styles.valueCell}>{views}</div>
                <div className={styles.valueCell}>{upvotes}</div>
            </div>
        </Link>
    )
}
