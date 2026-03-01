"use client"

import { useAuthStore } from "@/store/auth.store"
import { Search, Home, Bookmark, Settings, Bell, List, Users, ArrowLeft, MessageSquare, PlusCircle, HelpCircle, GraduationCap, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/dashboard.module.css"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isAuthenticated } = useAuthStore()
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const mainNav = [
        { name: "Home", icon: <Home />, href: "/" },
        { name: "Scholars", icon: <Users />, href: "/scholars" },
        { name: "Topics", icon: <List />, href: "/topics" },
    ]

    if (mounted && isAuthenticated && (user?.role === 'SCHOLAR' || user?.role === 'ADMIN')) {
        mainNav.push({ name: "Scholar Panel", icon: <GraduationCap />, href: "/scholar-panel" })
    }

    const personalNav = [
        { name: "My Questions", icon: <MessageSquare />, href: "/my-questions" },
        { name: "Saved Answers", icon: <Bookmark />, href: "/my-feed" },
        { name: "Settings", icon: <Settings />, href: "/settings" },
    ]

    const isHome = pathname === '/'

    return (
        <div className={styles.layout}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div className={styles.logoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>DinJiggasa</span>
                    </Link>
                </div>

                <div className={styles.headerCenter}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Search questions, topics, or people..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.headerIconGroup}>
                        <Link href="/notifications" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                            <Bell size={22} className={styles.headerIcon} />
                        </Link>
                    </div>
                    <Link href="/ask">
                        <button className={styles.askButton}>
                            <PlusCircle size={16} /> Ask Question
                        </button>
                    </Link>
                    {mounted && isAuthenticated && user?.name ? (
                        <Link href="/settings">
                            <div className={styles.userAvatar} title={user.name}>
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=006D5B&color=fff`} alt={user.name} className={styles.userAvatar} />
                            </div>
                        </Link>
                    ) : mounted ? (
                        <Link href="/login" className={styles.loginLink}>Login</Link>
                    ) : (
                        <div className={styles.loginPlaceholder}></div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.mainContainer}>
                {/* Left Sidebar */}
                <aside className={styles.leftSidebar}>
                    <nav className={styles.sidebarNav}>


                        <div className={styles.sidebarSection}>
                            <span className={styles.sectionTitle}>Main Navigation</span>
                            {mainNav.map((item) => (
                                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}>
                                        {item.icon} {item.name}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className={styles.sidebarSection}>
                            <span className={styles.sectionTitle}>Your Activity</span>
                            {personalNav.map((item) => (
                                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}>
                                        {item.icon} {item.name}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className={styles.sidebarSection}>
                            <span className={styles.sectionTitle}>Support</span>
                            <div className={styles.navItem}><HelpCircle size={18} /> Help Center</div>
                        </div>

                        {mounted && isAuthenticated && (
                            <div className={styles.sidebarSection} style={{ marginTop: 'auto' }}>
                                <div className={styles.logoutBtn} onClick={handleLogout}>
                                    <LogOut size={18} /> Logout
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* Daily Hadith Widget */}
                    <div className={styles.dailyHadith} style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9f6', borderRadius: '1rem', border: '1px solid #e0f2f1' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Daily Hadith</span>
                        <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.5rem', color: '#4b5563' }}>
                            "The best among you are those who have the best manners and character."
                        </p>
                    </div>
                </aside>

                {children}
            </div>
        </div>
    )
}
