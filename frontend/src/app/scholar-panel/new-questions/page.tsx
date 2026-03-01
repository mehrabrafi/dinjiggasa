"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../scholar-panel.module.css'
import {
    LayoutDashboard,
    MessageCircleQuestion,
    BarChart3,
    LogOut,
    Check,
    Search,
    Filter,
    Clock,
    Award,
    AlertCircle,
    BarChart,
    Bookmark,
    ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewQuestions() {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('directed')
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
                        className={styles.navItem}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href="/scholar-panel/new-questions"
                        className={`${styles.navItem} ${styles.navItemActive}`}
                    >
                        <MessageCircleQuestion size={20} />
                        New Questions
                        <span className={`${styles.navBadge} ${styles.navBadgeActive}`}>12</span>
                    </Link>
                    <Link
                        href="/scholar-panel/analytics"
                        className={styles.navItem}
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </Link>
                </nav>

                {/* Verification Status Widget in Sidebar */}
                <div className={styles.verifWidget}>
                    <div className={styles.verifTitle}>
                        <Check size={14} /> Verification Status
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
                    <h1 className={styles.welcomeTitle} style={{ fontSize: '1.5rem' }}>New Questions</h1>
                    <div className={styles.headerActions}>
                        <div className={styles.iconBtn}><Search size={18} /></div>
                        <div className={styles.iconBtn}><Filter size={18} /></div>
                    </div>
                </header>

                <div className={styles.tabsContainer}>
                    <div
                        className={`${styles.tab} ${activeTab === 'directed' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('directed')}
                    >
                        Directed to Me <span className={styles.tabCount}>5</span>
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'pending' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        All Pending <span className={styles.tabCount}>12</span>
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'urgent' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('urgent')}
                    >
                        Urgent <div className={styles.tabDot}></div>
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'answers' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('answers')}
                    >
                        Answers
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'saved' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Saved for Later
                    </div>
                </div>

                <div className={styles.dashboardGrid}>
                    {/* Left Column */}
                    <section>
                        <div className={styles.questionsList}>
                            {/* Question 1 */}
                            <div className={styles.questionCard}>
                                <div className={styles.questionMeta}>
                                    <div className={styles.badgeRow}>
                                        <span className={styles.categoryBadge} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>Finance</span>
                                        <span className={styles.directBadge}>Direct Request</span>
                                    </div>
                                    <div className={styles.authorGroup} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <Clock size={14} /> 2 hours ago
                                    </div>
                                </div>
                                <h3 className={styles.questionTitle}>Is investing in highly volatile digital currencies permissible (Halal)?</h3>
                                <p className={styles.questionExcerpt}>
                                    I have been observing the crypto markets and noticed extreme fluctuations. I am concerned this resembles gambling (maysir). Could you please clarify the Sharia ruling on holding such assets for long-term vs day trading?
                                </p>
                                <div className={styles.cardFooter}>
                                    <Link href="/scholar-panel/answer/29481" style={{ textDecoration: 'none' }}>
                                        <button className={styles.answerBtn}>
                                            <CheckCircle2 size={16} fill="white" color="var(--primary)" /> Answer Now
                                        </button>
                                    </Link>
                                    <div className={styles.bookmarkBtn}><Bookmark size={20} /></div>
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div className={styles.questionCard}>
                                <div className={styles.questionMeta}>
                                    <div className={styles.badgeRow}>
                                        <span className={styles.categoryBadge} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>Family</span>
                                    </div>
                                    <div className={styles.authorGroup} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <Clock size={14} /> 5 hours ago
                                    </div>
                                </div>
                                <h3 className={styles.questionTitle}>Maintaining ties of kinship while living abroad for work</h3>
                                <p className={styles.questionExcerpt}>
                                    My parents are aging, and I live in another country to support them financially. However, I feel immense guilt for not being physically present. What is the balance between financial support and physical presence in Islam?
                                </p>
                                <div className={styles.cardFooter}>
                                    <Link href="/scholar-panel/answer/29481" style={{ textDecoration: 'none' }}>
                                        <button className={styles.answerBtn}>
                                            <CheckCircle2 size={16} fill="white" color="var(--primary)" /> Answer Now
                                        </button>
                                    </Link>
                                    <div className={styles.bookmarkBtn}><Bookmark size={20} /></div>
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div className={styles.questionCard}>
                                <div className={styles.questionMeta}>
                                    <div className={styles.badgeRow}>
                                        <span className={styles.categoryBadge} style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>Rituals (Ibadah)</span>
                                    </div>
                                    <div className={styles.authorGroup} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <Clock size={14} /> 1 day ago
                                    </div>
                                </div>
                                <h3 className={styles.questionTitle}>Making up missed fasts from several years ago</h3>
                                <p className={styles.questionExcerpt}>
                                    I missed several days of fasting in Ramadan about 5 years ago due to minor illness, but never made them up. Do I need to pay Fidya as well as fasting them now?
                                </p>
                                <div className={styles.cardFooter}>
                                    <Link href="/scholar-panel/answer/29481" style={{ textDecoration: 'none' }}>
                                        <button className={styles.answerBtn}>
                                            <CheckCircle2 size={16} fill="white" color="var(--primary)" /> Answer Now
                                        </button>
                                    </Link>
                                    <div className={styles.bookmarkBtn}><Bookmark size={20} /></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Column */}
                    <aside className={styles.rightSidebar}>
                        {/* Urgent Widget */}
                        <div className={styles.urgentWidget}>
                            <div className={styles.urgentHeader}>
                                <div className={styles.urgentTitle}>
                                    <AlertCircle size={18} className={styles.urgentIcon} /> Urgent Requests
                                </div>
                                <span className={styles.urgentCount}>2</span>
                            </div>
                            <div className={styles.urgentItem}>
                                <div className={styles.urgentMeta}>
                                    <span className={styles.urgentTag}>Marriage</span>
                                    <span className={styles.urgentExpiry}>Expires in 2h</span>
                                </div>
                                <p className={styles.urgentText}>Urgent advice needed regarding nikah contract stipulations befor...</p>
                            </div>
                            <div className={styles.urgentItem}>
                                <div className={styles.urgentMeta}>
                                    <span className={styles.urgentTag}>Health</span>
                                    <span className={styles.urgentExpiry}>Expires in 5h</span>
                                </div>
                                <p className={styles.urgentText}>Is it permissible to break fast for a medical test scheduled tomorrow?</p>
                            </div>
                            <Link href="/scholar-panel/urgent" className={styles.viewAllUrgent}>View All Urgent</Link>
                        </div>

                        {/* Stats Widget */}
                        <div className={styles.statsWidget}>
                            <div className={styles.statsHeader}>
                                <BarChart size={18} className={styles.statsIcon} /> Question Stats
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIconBox}><MessageCircleQuestion size={18} /></div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Pending Total</span>
                                    <span className={styles.statVal}>42</span>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIconBox} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Check size={18} /></div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Answered this week</span>
                                    <span className={styles.statVal}>18</span>
                                </div>
                            </div>

                            <div className={styles.rateHeader}>
                                <span className={styles.rateLabel}>Response Rate</span>
                                <span className={styles.rateVal}>85%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className={styles.widget} style={{ paddingTop: '1.25rem' }}>
                            <h3 className={styles.statsHeader} style={{ marginBottom: '1rem' }}>Trending Topics</h3>
                            <div className={styles.tagCloud}>
                                <Link href="#" className={styles.tagItem}>#Ramadan</Link>
                                <Link href="#" className={styles.tagItem}>#Zakat</Link>
                                <Link href="#" className={styles.tagItem}>#Crypto</Link>
                                <Link href="#" className={styles.tagItem}>#Inheritance</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

// Helper icons that were missing in the imports but used in the original image-based thinking
function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
