"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './scholar-panel.module.css'
import {
    LayoutDashboard,
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
    Check
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ScholarPanel() {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isAuthorized, setIsAuthorized] = useState(false)

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

    const scholarName = user?.name || "Scholar"

    const handleLogout = () => {
        logout()
        router.push('/login')
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

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${scholarName}&background=10b981&color=fff&bold=true`}
                            alt={scholarName}
                            className={styles.avatar}
                        />
                        <div className={styles.onlineBadge}></div>
                    </div>
                    <div className={styles.nameContainer}>
                        <span className={styles.scholarName}>{scholarName}</span>
                        <span className={styles.verifiedBadge}>
                            <div className={styles.verifiedIcon}><Check size={10} strokeWidth={4} /></div> Verified Scholar
                        </span>
                    </div>
                </div>

                <nav className={styles.navSection}>
                    <Link
                        href="/scholar-panel"
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href="/scholar-panel/new-questions"
                        className={`${styles.navItem} ${activeTab === 'questions' ? styles.navItemActive : ''}`}
                        onClick={() => setActiveTab('questions')}
                    >
                        <MessageCircleQuestion size={20} />
                        New Questions
                        <span className={styles.navBadge}>3</span>
                    </Link>
                    <Link
                        href="/scholar-panel/analytics"
                        className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </Link>
                </nav>

                {/* Verification Status Widget in Sidebar */}
                <div className={styles.verifWidget}>
                    <div className={styles.verifTitle}>
                        <CheckCircle2 size={14} /> Verification Status
                    </div>
                    <p className={styles.verifText}>
                        Your scholar credentials are up to date and verified until Dec 2024.
                    </p>
                </div>

                <button className={styles.logOutBtn} onClick={handleLogout}>
                    <LogOut size={20} />
                    Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.welcomeTitle}>Welcome back, {scholarName.split(' ')[0]}</h1>
                    <p className={styles.welcomeSubtitle}>Here's what's happening with your questions today.</p>
                </header>

                <div className={styles.dashboardGrid}>
                    {/* Left Column */}
                    <section>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#10b981' }}>
                                        <Inbox size={18} />
                                    </div>
                                    <span className={styles.statChange} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>+12%</span>
                                </div>
                                <div className={styles.statLabel}>Total Answers</div>
                                <div className={styles.statValue}>1,240</div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                                        <MessageSquareQuote size={18} />
                                    </div>
                                    <span className={styles.statChange} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>+2%</span>
                                </div>
                                <div className={styles.statLabel}>Unanswered Requests</div>
                                <div className={styles.statValue}>15</div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                                        <TrendingUp size={18} />
                                    </div>
                                    <span className={styles.statChange} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>-</span>
                                </div>
                                <div className={styles.statLabel}>Followers</div>
                                <div className={styles.statValue}>8.5k</div>
                            </div>
                        </div>

                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Pending Questions</h2>
                            <Link href="/scholar-panel/questions" className={styles.viewAll}>View All</Link>
                        </div>

                        <div className={styles.questionsList}>
                            {/* Question 1 */}
                            <div className={styles.questionCard}>
                                <div className={styles.questionMeta}>
                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>Finance</span>
                                    <span className={styles.questionDot}>•</span>
                                    <span className={styles.questionAuthor}>Asked by Yusuf K.</span>
                                    <span className={styles.questionDot}>•</span>
                                    <span className={styles.questionAuthor}>2 hours ago</span>
                                </div>
                                <h3 className={styles.questionTitle}>What is the ruling on investing in digital currencies that fluctuate rapidly?</h3>
                                <p className={styles.questionExcerpt}>
                                    I have been looking into crypto markets and I am unsure if the volatility makes it akin to gambling. Can you please clarify the stance on these rapid fluctuations...
                                </p>
                                <button className={styles.answerBtn}>
                                    <MessageCircleQuestion size={16} strokeWidth={3} /> Answer Now
                                </button>
                            </div>

                            {/* Question 2 */}
                            <div className={styles.questionCard}>
                                <div className={styles.questionMeta}>
                                    <span className={styles.categoryBadge} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>Family</span>
                                    <span className={styles.questionDot}>•</span>
                                    <span className={styles.questionAuthor}>Asked by Sarah M.</span>
                                    <span className={styles.questionDot}>•</span>
                                    <span className={styles.questionAuthor}>5 hours ago</span>
                                </div>
                                <h3 className={styles.questionTitle}>Advice for maintaining family ties while living abroad?</h3>
                                <p className={styles.questionExcerpt}>
                                    My parents are getting older and I feel guilty for living in another country for work. What are my obligations to them while being so far away...
                                </p>
                                <button className={styles.answerBtn}>
                                    <MessageCircleQuestion size={16} strokeWidth={3} /> Answer Now
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Right Column */}
                    <aside className={styles.rightSidebar}>
                        {/* Impact Card */}
                        <div className={styles.impactCard}>
                            <h3 className={styles.impactTitle}>Your Impact</h3>
                            <p className={styles.impactSubtitle}>This week&apos;s community engagement</p>

                            <div className={styles.impactValue}>
                                42 <span className={styles.impactUnit}>people helped</span>
                            </div>

                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '70%', background: 'linear-gradient(to right, #34d399, #10b981)' }}></div>
                            </div>

                            <div className={styles.progressLabelRow}>
                                <span className={styles.goalLabel}>Weekly Goal</span>
                                <span className={styles.topBadge}>Top 5%</span>
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
                                    <span className={styles.analyticsLabel}>Avg. Response Time</span>
                                    <span className={styles.analyticsValue}>4h 12m</span>
                                </div>
                                <div className={styles.analyticsItem}>
                                    <span className={styles.analyticsLabel}>Satisfaction Rate</span>
                                    <span className={styles.analyticsValue} style={{ color: '#10b981' }}>98%</span>
                                </div>
                                <div className={styles.analyticsItem}>
                                    <span className={styles.analyticsLabel}>Top Topic</span>
                                    <span className={styles.analyticsValue}>Fiqh</span>
                                </div>
                            </div>

                            <Link href="/scholar-panel/analytics" className={styles.viewReport}>
                                View Full Report <ArrowRight size={14} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
