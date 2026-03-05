"use client"

import { useAuthStore } from "@/store/auth.store"
import { Search, Home, Bookmark, Settings, Bell, List, Users, ArrowLeft, MessageSquare, PlusCircle, HelpCircle, GraduationCap, Menu, X, ChevronRight, CheckCircle2, Clock, Hash, SearchX } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import styles from "@/app/dashboard.module.css"
import searchStyles from "./SearchDropdown.module.css"
import api from "@/lib/axios"

// Highlight matching text helper
function highlightMatch(text: string, query: string) {
    if (!query || query.length < 2) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuthStore()
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const searchWrapperRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
        // Close search dropdown on navigation
        setShowDropdown(false)
        setSearchQuery("")
        setSearchResults(null)
    }, [pathname])

    // Debounced search
    const performSearch = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSearchResults(null)
            setIsSearching(false)
            return
        }
        setIsSearching(true)
        try {
            const res = await api.get('/questions/search', { params: { q: query.trim() } })
            setSearchResults(res.data)
        } catch (err) {
            console.error("Search failed", err)
            setSearchResults({ questions: [], scholars: [], topics: [] })
        } finally {
            setIsSearching(false)
        }
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        setShowDropdown(true)

        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (value.trim().length < 2) {
            setSearchResults(null)
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        debounceRef.current = setTimeout(() => {
            performSearch(value)
        }, 350)
    }

    const handleSearchFocus = () => {
        if (searchQuery.trim().length >= 2) {
            setShowDropdown(true)
        }
    }

    const closeSearch = () => {
        setShowDropdown(false)
    }

    // Keyboard handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSearch()
                searchInputRef.current?.blur()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const hasResults = searchResults && searchResults.questions?.length > 0

    const mainNav = [
        { name: "Home", icon: <Home size={20} />, href: "/" },
        { name: "Scholars", icon: <Users size={20} />, href: "/scholars" },
        { name: "Topics", icon: <List size={20} />, href: "/topics" },
    ]

    if (mounted && isAuthenticated && (user?.role === 'SCHOLAR' || user?.role === 'ADMIN')) {
        mainNav.push({ name: "Scholar Panel", icon: <GraduationCap size={20} />, href: "/scholar-panel" })
    }

    const personalNav = [
        { name: "My Questions", icon: <MessageSquare size={20} />, href: "/my-questions" },
        { name: "Saved Answers", icon: <Bookmark size={20} />, href: "/my-feed" },
        { name: "Notifications", icon: <Bell size={20} />, href: "/notifications" },
        { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
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
                    <div className={searchStyles.searchWrapper} ref={searchWrapperRef}>
                        <div className={styles.searchBar}>
                            <Search size={18} color="#9ca3af" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search questions, topics, or scholars..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                autoComplete="off"
                            />
                        </div>

                        {/* Search Dropdown */}
                        {showDropdown && searchQuery.trim().length >= 2 && (
                            <>
                                <div className={searchStyles.searchBackdrop} onClick={closeSearch} />
                                <div className={searchStyles.searchDropdown}>
                                    {isSearching ? (
                                        <div className={searchStyles.loadingState}>
                                            <div className={searchStyles.loadingSpinner} />
                                            <span className={searchStyles.loadingText}>Searching...</span>
                                        </div>
                                    ) : !hasResults ? (
                                        <div className={searchStyles.emptyState}>
                                            <SearchX size={32} className={searchStyles.emptyIcon} />
                                            <span className={searchStyles.emptyTitle}>No results found</span>
                                            <span className={searchStyles.emptySubtitle}>Try a different search term</span>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Questions Section */}
                                            {searchResults.questions?.length > 0 && (
                                                <>
                                                    <div className={searchStyles.sectionHeader}>
                                                        <span className={searchStyles.sectionIcon}><HelpCircle size={12} /></span>
                                                        Questions
                                                    </div>
                                                    {searchResults.questions.map((q: any) => (
                                                        <Link
                                                            key={q.id}
                                                            href={`/questions/${q.id}`}
                                                            className={searchStyles.questionItem}
                                                            onClick={closeSearch}
                                                        >
                                                            <div className={searchStyles.questionContent}>
                                                                <div className={searchStyles.questionTitle}>
                                                                    {highlightMatch(q.title, searchQuery)}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </>
                                            )}

                                            {/* Footer Hint */}
                                            <div className={searchStyles.dropdownFooter}>
                                                <span className={searchStyles.kbdHint}>
                                                    <span className={searchStyles.kbd}>Esc</span> to close
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.headerIconGroup}>
                        <Link href="/notifications" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                            <Bell size={22} className={styles.headerIcon} />
                        </Link>
                    </div>
                    {(!mounted || (user?.role !== 'SCHOLAR' && user?.role !== 'ADMIN')) && (
                        <Link href="/ask">
                            <button className={styles.askButton}>
                                <PlusCircle size={16} /> <span>Ask Question</span>
                            </button>
                        </Link>
                    )}
                    {mounted && isAuthenticated && user?.name ? (
                        <Link href="/settings">
                            <div className={styles.userAvatar} title={user.name}>
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006D5B&color=fff`}
                                    alt={user.name}
                                    className={styles.userAvatar}
                                />
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

                    </nav>

                    {/* Removed hardcoded Daily Hadith widget */}

                </aside>

                {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.mobileBottomNav}>
                <Link href="/" className={`${styles.mobileNavItem} ${pathname === '/' ? styles.mobileNavItemActive : ''}`}>
                    <Home size={20} />
                    <span>Home</span>
                </Link>
                <Link href="/scholars" className={`${styles.mobileNavItem} ${pathname === '/scholars' ? styles.mobileNavItemActive : ''}`}>
                    <Users size={20} />
                    <span>Scholars</span>
                </Link>
                <Link href="/ask" className={`${styles.mobileNavItem} ${styles.mobileNavAsk}`}>
                    <div className={styles.mobileAskCircle}>
                        <PlusCircle size={22} />
                    </div>
                </Link>
                <Link href="/my-questions" className={`${styles.mobileNavItem} ${pathname === '/my-questions' ? styles.mobileNavItemActive : ''}`}>
                    <MessageSquare size={20} />
                    <span>My Q&apos;s</span>
                </Link>
                <button className={`${styles.mobileNavItem} ${mobileMenuOpen ? styles.mobileNavItemActive : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu size={20} />
                    <span>Menu</span>
                </button>
            </nav>

            {/* Mobile Slide-out Menu Overlay */}
            {mobileMenuOpen && (
                <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)}>
                    <div className={styles.mobileMenuDrawer} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.mobileMenuHeader}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#6b7280' }}>
                                <X size={22} />
                            </button>
                        </div>

                        {mounted && isAuthenticated && user?.name && (
                            <div className={styles.mobileMenuProfile}>
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006D5B&color=fff`}
                                    alt={user.name}
                                    className={styles.mobileMenuAvatar}
                                />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email}</div>
                                </div>
                            </div>
                        )}

                        <div className={styles.mobileMenuSection}>
                            <span className={styles.mobileMenuSectionTitle}>Navigation</span>
                            {mainNav.map((item) => (
                                <Link key={item.name} href={item.href} className={`${styles.mobileMenuItem} ${pathname === item.href ? styles.mobileMenuItemActive : ''}`}>
                                    {item.icon} {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className={styles.mobileMenuSection}>
                            <span className={styles.mobileMenuSectionTitle}>Your Activity</span>
                            {personalNav.map((item) => (
                                <Link key={item.name} href={item.href} className={`${styles.mobileMenuItem} ${pathname === item.href ? styles.mobileMenuItemActive : ''}`}>
                                    {item.icon} {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className={styles.mobileMenuSection}>
                            <span className={styles.mobileMenuSectionTitle}>Support</span>
                            <div className={styles.mobileMenuItem}><HelpCircle size={18} /> Help Center</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
