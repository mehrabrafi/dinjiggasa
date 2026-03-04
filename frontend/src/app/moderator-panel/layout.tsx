"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './moderator.module.css'
import {
    LayoutDashboard,
    Home,
    MessageCircleQuestion,
    BarChart3,
    LogOut,
    Inbox,
    AlertCircle,
    CheckCircle2,
    Users,
    ShieldAlert,
    Tags,
    Settings
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [counts, setCounts] = useState({ questions: 0, reports: 0 })

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        // Only ADMIN or MODERATOR
        if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
            toast.error("You are not authorized to view this page.")
            router.push('/')
            return
        }

        setIsAuthorized(true)

        // Fetch counts for badges
        const fetchCounts = async () => {
            try {
                const [qRes, rRes] = await Promise.all([
                    api.get('/questions'),
                    api.get('/reports')
                ])
                setCounts({
                    questions: qRes.data.length,
                    reports: rRes.data.filter((r: any) => r.status === 'PENDING').length
                })
            } catch (error) {
                console.error('Failed to fetch sidebar counts:', error)
            }
        }
        fetchCounts()
    }, [isAuthenticated, user, router])

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
                color: '#3b82f6',
                fontWeight: 600
            }}>
                Verifying moderator access...
            </div>
        )
    }

    const moderatorName = user?.name || "Moderator"

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${moderatorName}&background=3b82f6&color=fff&bold=true`}
                            alt={moderatorName}
                            className={styles.avatar}
                        />
                        <div className={styles.onlineBadge}></div>
                    </div>
                    <div className={styles.nameContainer}>
                        <span className={styles.moderatorName}>{moderatorName}</span>
                        <span className={styles.roleTag}>{user?.role}</span>
                    </div>
                </div>

                <nav className={styles.navSection}>
                    <Link
                        href="/moderator-panel"
                        className={`${styles.navItem} ${pathname === '/moderator-panel' ? styles.navItemActive : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        Overview
                    </Link>

                    <Link
                        href="/moderator-panel/questions"
                        className={`${styles.navItem} ${pathname.startsWith('/moderator-panel/questions') ? styles.navItemActive : ''}`}
                    >
                        <MessageCircleQuestion size={20} />
                        Questions
                        <span className={styles.navBadge}>{counts.questions}</span>
                    </Link>

                    <Link
                        href="/moderator-panel/reports"
                        className={`${styles.navItem} ${pathname.startsWith('/moderator-panel/reports') ? styles.navItemActive : ''}`}
                    >
                        <ShieldAlert size={20} />
                        Reports
                        <span className={styles.navBadge}>{counts.reports}</span>
                    </Link>

                    <Link
                        href="/moderator-panel/users"
                        className={`${styles.navItem} ${pathname.startsWith('/moderator-panel/users') ? styles.navItemActive : ''}`}
                    >
                        <Users size={20} />
                        Users
                    </Link>

                    <Link
                        href="/moderator-panel/topics"
                        className={`${styles.navItem} ${pathname.startsWith('/moderator-panel/topics') ? styles.navItemActive : ''}`}
                    >
                        <Tags size={20} />
                        Topics
                    </Link>

                    <Link
                        href="/moderator-panel/analytics"
                        className={`${styles.navItem} ${pathname.startsWith('/moderator-panel/analytics') ? styles.navItemActive : ''}`}
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </Link>

                    <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid #f1f5f9' }} />

                    <Link
                        href="/"
                        className={styles.navItem}
                    >
                        <Home size={20} />
                        Main Site
                    </Link>
                </nav>

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
