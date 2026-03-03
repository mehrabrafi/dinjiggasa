"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './scholar-panel.module.css'
import {
    LayoutDashboard,
    Home,
    MessageCircleQuestion,
    BarChart3,
    LogOut,
    Inbox,
    AlertCircle,
    CheckCircle2,
    Bookmark,
    Check,
    Edit
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

interface SidebarCounts {
    pending: number
    urgent: number
    answered: number
    drafts: number
}

export default function ScholarPanelLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [counts, setCounts] = useState<SidebarCounts>({ pending: 0, urgent: 0, answered: 0, drafts: 0 })
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoadingCounts, setIsLoadingCounts] = useState(true)

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
        const fetchCounts = async () => {
            if (!isAuthorized) return
            try {
                const [directedRes, answersRes, draftsRes] = await Promise.all([
                    api.get("/questions/directed"),
                    api.get("/scholars/my-answers"),
                    api.get("/questions/draft/all"),
                ])

                const directed = directedRes.data || []
                const myAns = answersRes.data || []

                const pending = directed.filter((q: any) =>
                    !q.isUrgent && !q.answers?.some((a: any) => a.authorId === user?.id)
                ).length

                const urgent = directed.filter((q: any) =>
                    q.isUrgent && !q.answers?.some((a: any) => a.authorId === user?.id)
                ).length

                setCounts({
                    pending,
                    urgent,
                    answered: myAns.length,
                    drafts: (draftsRes.data || []).length
                })
            } catch (err) {
                console.error("Failed to fetch sidebar counts:", err)
            } finally {
                setIsLoadingCounts(false)
            }
        }

        fetchCounts()
    }, [isAuthorized, user?.id])

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

    const scholarName = user?.name || "Scholar"
    const totalNewCount = counts.pending + counts.urgent

    // Exclude answer page from layout to keep it full screen
    if (pathname.startsWith('/scholar-panel/answer/')) {
        return <>{children}</>
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${scholarName}&background=006D5B&color=fff&bold=true`}
                            alt={scholarName}
                            className={styles.avatar}
                        />
                        <div className={styles.onlineBadge}></div>
                    </div>
                    <div className={styles.nameContainer}>
                        <span className={styles.scholarName}>{scholarName}</span>
                    </div>
                </div>

                <nav className={styles.navSection}>
                    <Link
                        href="/scholar-panel"
                        className={`${styles.navItem} ${pathname === '/scholar-panel' ? styles.navItemActive : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link
                        href="/scholar-panel/pending"
                        className={`${styles.navItem} ${pathname === '/scholar-panel/pending' ? styles.navItemActive : ''}`}
                    >
                        <Inbox size={20} />
                        All Pending
                        {counts.pending > 0 && (
                            <span className={styles.navBadge}>{counts.pending}</span>
                        )}
                    </Link>

                    <Link
                        href="/scholar-panel/urgent"
                        className={`${styles.navItem} ${pathname === '/scholar-panel/urgent' ? styles.navItemActive : ''}`}
                    >
                        <AlertCircle size={20} />
                        Urgent
                        {counts.urgent > 0 && (
                            <span className={styles.navBadge} style={{ backgroundColor: '#ef4444' }}>{counts.urgent}</span>
                        )}
                    </Link>

                    <Link
                        href="/scholar-panel/drafts"
                        className={`${styles.navItem} ${pathname === '/scholar-panel/drafts' ? styles.navItemActive : ''}`}
                    >
                        <Edit size={20} />
                        Drafts
                        {counts.drafts > 0 && (
                            <span className={styles.navBadge} style={{ backgroundColor: '#f59e0b' }}>{counts.drafts}</span>
                        )}
                    </Link>

                    <Link
                        href="/scholar-panel/answers"
                        className={`${styles.navItem} ${pathname === '/scholar-panel/answers' ? styles.navItemActive : ''}`}
                    >
                        <CheckCircle2 size={20} />
                        My Answers
                        {counts.answered > 0 && (
                            <span className={styles.navBadge} style={{ backgroundColor: '#10b981' }}>{counts.answered}</span>
                        )}
                    </Link>



                    <Link
                        href="/scholar-panel/analytics"
                        className={`${styles.navItem} ${pathname === '/scholar-panel/analytics' ? styles.navItemActive : ''}`}
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </Link>

                    <Link
                        href="/"
                        className={styles.navItem}
                    >
                        <Home size={20} />
                        Go to Home
                    </Link>
                </nav>

                <div className={styles.verifWidget}>
                    <div className={styles.verifTitle}>
                        <CheckCircle2 size={14} /> Verification Status
                    </div>
                    <p className={styles.verifText}>
                        Your scholar credentials are up to date and verified.
                    </p>
                </div>

                <button className={styles.logOutBtn} onClick={handleLogout}>
                    <LogOut size={20} />
                    Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}
