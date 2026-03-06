"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Eye, CheckCircle2, Moon, HelpCircle, Heart, Activity } from "lucide-react"
import styles from "./LandingView.module.css"
import api from "@/lib/axios"

// Simple CountUp animation component
const CountUp = ({ value, duration = 1000, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const startTime = performance.now();

        const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(start + (end - start) * easeOut);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }, [value]);

    return <span>{displayValue.toLocaleString()}{suffix}</span>;
};

export default function LandingView() {
    const [questions, setQuestions] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [questionsRes, statsRes] = await Promise.all([
                    api.get('/questions'),
                    api.get('/questions/stats/global').catch(() => ({ data: null }))
                ])
                setQuestions(questionsRes.data)
                if (statsRes && statsRes.data) setStats(statsRes.data)
            } catch (error) {
                console.error("Failed to load data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <div className={styles.logoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>DinJiggasa</span>
                    </Link>
                </div>

                <nav className={styles.headerNav}>
                    <Link href="/" className={styles.navLink} style={{ color: '#1a202c', fontWeight: 600 }}>Home</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                </nav>

                <div className={styles.headerRight}>
                    <Link href="/login" className={styles.loginLink}>Log In</Link>
                    <Link href="/login">
                        <button className={styles.askButton}>Ask Question</button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <h1 className={styles.heroTitle}>Ask scholars, find answers</h1>
                <p className={styles.heroSubtitle}>
                    Explore a vast library of verified Islamic knowledge or ask your own questions to qualified scholars.
                </p>

                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search for questions, topics, or scholars..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.topicsWrapper}>
                    <div className={`${styles.topicChip} ${styles.topicChipActive}`}>All Topics</div>
                    <div className={styles.topicChip}>Fiqh</div>
                    <div className={styles.topicChip}>Theology</div>
                    <div className={styles.topicChip}>Hadith</div>
                    <div className={styles.topicChip}>History</div>
                    <div className={styles.topicChip}>Family Life</div>
                </div>

                {/* Statistics Section */}
                <div className={styles.statsContainer}>
                    <div className={styles.statBox}>
                        <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <HelpCircle size={24} />
                        </div>
                        <div className={styles.statNumber}>
                            {stats ? <CountUp value={stats.totalQuestions} /> : '...'}
                        </div>
                        <div className={styles.statLabel}>Total Questions</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div className={styles.statNumber}>
                            {stats ? <CountUp value={stats.totalAnswers} /> : '...'}
                        </div>
                        <div className={styles.statLabel}>Answers Provided</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                            <Heart size={24} />
                        </div>
                        <div className={styles.statNumber}>
                            {stats ? <CountUp value={stats.peopleHelped} /> : '...'}
                        </div>
                        <div className={styles.statLabel}>People Helped</div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                            <Activity size={24} />
                        </div>
                        <div className={styles.statNumber}>
                            {stats ? <CountUp value={stats.responseRate} suffix="%" /> : '...'}
                        </div>
                        <div className={styles.statLabel}>Response Rate</div>
                    </div>
                </div>



                <div className={styles.questionsList}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading questions...</div>
                    ) : questions.filter((q: any) => q.answers && q.answers.length > 0).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No answered questions available right now.</div>
                    ) : (
                        questions.filter((q: any) => q.answers && q.answers.length > 0).slice(0, 5).map((question, index) => {
                            const author = question.answers[0].author
                            const isFirst = index === 0

                            return (
                                <div key={question.id} className={styles.questionCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardCategory}>{question.tags?.[0]?.name?.toUpperCase() || "GENERAL"}</span>
                                            <span>• {new Date(question.answers[0].createdAt || question.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {isFirst && <span className={styles.cardFeatured}>FEATURED</span>}
                                    </div>

                                    <Link href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
                                        <h2 className={styles.cardTitle}>{question.title}</h2>
                                    </Link>

                                    <p className={styles.cardPreview}>
                                        {question.body.length > 180 ? `${question.body.substring(0, 180)}...` : question.body}
                                    </p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.authorInfo}>
                                            <img
                                                src={author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'Scholar')}&background=e5e7eb&color=6b7280`}
                                                alt={author?.name}
                                                className={styles.authorAvatar}
                                            />
                                            <div className={styles.authorDetails}>
                                                <div className={styles.authorNameRow}>
                                                    <span className={styles.authorName}>{author?.name}</span>
                                                    {author?.isVerified && <CheckCircle2 size={14} color="#006D5B" fill="#006D5B1A" />}
                                                </div>
                                                <span className={styles.authorTitle}>{author?.specialization || "Islamic Scholar"}</span>
                                            </div>
                                        </div>
                                        <div className={styles.statsRow}>
                                            <Eye size={16} />
                                            <span>{(Math.floor(Math.random() * 50) / 10 + 1).toFixed(1)}k</span> {/* Mocked view count based on screenshot */}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {questions.filter((q: any) => q.answers && q.answers.length > 0).length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className={styles.loadMoreBtn}>Load More Questions</button>
                        </div>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <div>© 2026 DinJiggasa. Knowledge for everyone.</div>
                <div className={styles.footerLinks}>
                    <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
                    <Link href="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
                    <Link href="mailto:support@dinjiggasa.com" className={styles.footerLink}>Contact Support</Link>
                </div>
            </footer>

            {/* Floating Theme Button (mock) */}
            <div className={styles.floatingThemeBtn}>
                <Moon size={18} />
            </div>
        </div>
    )
}
