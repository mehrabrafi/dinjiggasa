"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './analytics.module.css'
import panelStyles from '../scholar-panel.module.css'
import {
    LayoutDashboard,
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
    CheckCircle2
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AnalyticsPage() {
    const { user, logout, isAuthenticated } = useAuthStore()
    const router = useRouter()
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary)', fontWeight: 600 }}>
                Verifying permissions...
            </div>
        )
    }

    return (
        <div className={panelStyles.container}>
            {/* Sidebar */}
            <aside className={panelStyles.sidebar}>
                <div className={panelStyles.profileInfo}>
                    <div className={panelStyles.avatarWrapper}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${scholarName}&background=10b981&color=fff&bold=true`}
                            alt={scholarName}
                            className={panelStyles.avatar}
                        />
                        <div className={panelStyles.onlineBadge}></div>
                    </div>
                    <div className={panelStyles.nameContainer}>
                        <span className={panelStyles.scholarName}>{scholarName}</span>
                        <span className={panelStyles.verifiedBadge}>
                            <div className={panelStyles.verifiedIcon}><Check size={10} strokeWidth={4} /></div> Verified Scholar
                        </span>
                    </div>
                </div>

                <nav className={panelStyles.navSection}>
                    <Link href="/scholar-panel" className={panelStyles.navItem}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/scholar-panel/new-questions" className={panelStyles.navItem}>
                        <MessageCircleQuestion size={20} /> New Questions
                        <span className={panelStyles.navBadgeDim}>12</span>
                    </Link>
                    <Link href="/scholar-panel/analytics" className={`${panelStyles.navItem} ${panelStyles.navItemActive}`}>
                        <BarChart3 size={20} /> Analytics
                    </Link>
                </nav>

                {/* Verification Status Widget in Sidebar */}
                <div className={panelStyles.verifWidget}>
                    <div className={panelStyles.verifTitle}>
                        <CheckCircle2 size={14} /> Verification Status
                    </div>
                    <p className={panelStyles.verifText}>
                        Your scholar credentials are up to date and verified until Dec 2024.
                    </p>
                </div>

                <button className={panelStyles.logOutBtn} onClick={handleLogout}>
                    <LogOut size={20} /> Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className={panelStyles.mainContent}>
                <div className={styles.headerRow}>
                    <div className={styles.titleArea}>
                        <h1>Analytics Overview</h1>
                        <p>Track your impact and community engagement</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.dropdownSlot}>
                            Last 30 Days <ChevronDown size={16} />
                        </div>
                        <div className={styles.downloadBtn}>
                            <Download size={18} />
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className={styles.statsRow}>
                    <StatCard
                        label="Answers Provided"
                        value="142"
                        trend="+12%"
                        icon={<MessageSquare size={18} />}
                        iconBg="#eff6ff"
                        iconColor="#3b82f6"
                    />
                    <StatCard
                        label="Audio Listens"
                        value="8,540"
                        trend="+25%"
                        icon={<Headphones size={18} />}
                        iconBg="#f5f3ff"
                        iconColor="#8b5cf6"
                    />
                    <StatCard
                        label="Total Upvotes"
                        value="3,200"
                        trend="+8%"
                        icon={<ThumbsUp size={18} />}
                        iconBg="#fff7ed"
                        iconColor="#f97316"
                    />
                    <StatCard
                        label="Follower Growth"
                        value="+450"
                        trend="+15%"
                        icon={<Users size={18} />}
                        iconBg="#f0fdf4"
                        iconColor="#10b981"
                    />
                </div>

                {/* Chart and Impact Row */}
                <div className={styles.engagementArea}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3 className={styles.chartTitle}>Weekly Engagement</h3>
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <div className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></div> Reads
                                </div>
                                <div className={styles.legendItem}>
                                    <div className={styles.legendDot} style={{ backgroundColor: '#cbd5e1' }}></div> Listens
                                </div>
                            </div>
                        </div>
                        <p className={styles.chartPeriod}>Listens vs. Text Reads over time</p>

                        <div className={styles.chartView}>
                            <svg className={styles.chartCanvas} viewBox="0 0 800 240" preserveAspectRatio="none">
                                {/* Simple Area Chart Visualization */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Background Line */}
                                <path
                                    d="M0,200 Q200,180 400,160 T800,140"
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                />
                                {/* Main Line Area */}
                                <path
                                    d="M0,200 Q200,180 400,160 T800,140 L800,240 L0,240 Z"
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d="M0,200 Q150,150 300,120 T600,80 T800,70"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="3"
                                />
                                {/* Data Point Label Simulation */}
                                <circle cx="400" cy="110" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                                <rect x="370" y="70" width="80" height="25" rx="4" fill="#1e293b" />
                                <text x="410" y="87" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2,405 Reads</text>
                            </svg>
                            <div className={styles.chartLabels}>
                                <span className={styles.chartLabel}>Nov 1</span>
                                <span className={styles.chartLabel}>Nov 8</span>
                                <span className={styles.chartLabel}>Nov 15</span>
                                <span className={styles.chartLabel}>Nov 22</span>
                                <span className={styles.chartLabel}>Nov 29</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.impactCard}>
                            <div className={styles.impactHeader}>
                                <Globe size={14} /> Impact Summary
                            </div>
                            <div className={styles.impactValue}>12,503</div>
                            <p className={styles.impactDesc}>
                                People helped this month through your answers and guidance.
                            </p>
                            <div className={styles.avatarsRow}>
                                <img src="https://i.pravatar.cc/150?u=1" className={styles.miniAvatar} />
                                <img src="https://i.pravatar.cc/150?u=2" className={styles.miniAvatar} />
                                <img src="https://i.pravatar.cc/150?u=3" className={styles.miniAvatar} />
                                <span className={styles.impactMore}>+12k</span>
                            </div>
                            <button className={styles.viewReportBtn}>View Report</button>
                        </div>

                        <div className={styles.categoriesCard}>
                            <h3 className={styles.catsTitle}>Top Categories</h3>
                            <CategoryItem label="Fiqh (Jurisprudence)" value="45%" color="#3b82f6" />
                            <CategoryItem label="Zakat & Finance" value="30%" color="#10b981" />
                            <CategoryItem label="Family Life" value="15%" color="#f59e0b" />
                            <CategoryItem label="Other" value="10%" color="#64748b" />
                        </div>
                    </div>
                </div>

                {/* Performance Table */}
                <div className={styles.perfCard}>
                    <div className={styles.perfHeader}>
                        <div className={styles.titleArea}>
                            <h3>Top Performing Answers</h3>
                            <p>Your most engaging contributions this period</p>
                        </div>
                        <Link href="#" className={styles.viewAll}>View All</Link>
                    </div>

                    <div className={styles.tableHeader}>
                        <span>Question Topic</span>
                        <span>Category</span>
                        <span>Views</span>
                        <span>Upvotes</span>
                        <span>Status</span>
                    </div>

                    <div className={styles.tableBody}>
                        <PerfRow
                            topic="Is cryptocurrency trading permissible (Halal)?"
                            date="Posted 2 days ago"
                            category="Finance"
                            catBg="#eff6ff"
                            catColor="#3b82f6"
                            views="12.5k"
                            upvotes="842"
                            status={<Check size={16} />}
                        />
                        <PerfRow
                            topic="Calculating Zakat on business inventory"
                            date="Posted 5 days ago"
                            category="Zakat"
                            catBg="#f0fdf4"
                            catColor="#10b981"
                            views="8.2k"
                            upvotes="530"
                            status={<Check size={16} style={{ opacity: 0.3 }} />}
                        />
                        <PerfRow
                            topic="Understanding inheritance shares for distant ..."
                            date="Posted 1 week ago"
                            category="Fiqh"
                            catBg="#fff7ed"
                            catColor="#f97316"
                            views="4.1k"
                            upvotes="215"
                            status={<Check size={16} style={{ opacity: 0.3 }} />}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ label, value, trend, icon, iconBg, iconColor }: any) {
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <div className={styles.iconCircle} style={{ backgroundColor: iconBg, color: iconColor }}>
                    {icon}
                </div>
                <div className={styles.trendBadge}>
                    <TrendingUp size={12} /> {trend}
                </div>
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

function PerfRow({ topic, date, category, catBg, catColor, views, upvotes, status }: any) {
    return (
        <div className={styles.tableRow}>
            <div className={styles.topicCell}>
                <h4>{topic}</h4>
                <span>{date}</span>
            </div>
            <div>
                <span className={styles.catBadge} style={{ backgroundColor: catBg, color: catColor }}>{category}</span>
            </div>
            <div className={styles.valueCell}>{views}</div>
            <div className={styles.valueCell}>{upvotes}</div>
            <div className={styles.statusCell}>{status}</div>
        </div>
    )
}
