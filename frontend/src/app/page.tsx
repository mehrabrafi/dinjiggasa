"use client"

import { PlayCircle, Bell, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap, Share, CheckCircle2, Heart, BarChart3, HelpCircle, Activity, Flag, Book, Shield, Compass, Hash, Users, Headphones } from "lucide-react"
import Link from "next/link"
import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter as useNextRouter } from "next/navigation"
import api from "@/lib/axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./dashboard.module.css"
import ReportModal from "@/components/modals/ReportModal"
import { useAuthStore } from "@/store/auth.store"
import LandingView from "@/components/landing/LandingView"
import toast from "react-hot-toast"

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const nextRouter = useNextRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show toast when user is redirected due to unauthorized role
  useEffect(() => {
    if (searchParams.get('unauthorized') === '1') {
      toast.error("You don't have permission to access that page.")
      // Clean the URL so the toast doesn't re-appear on refresh
      nextRouter.replace('/')
    }
  }, [searchParams, nextRouter])

  if (!mounted) return null

  if (isAuthenticated) {
    return <DashboardView />
  }

  return <LandingView />
}

function DashboardView() {
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [topScholars, setTopScholars] = useState<any[]>([])

  const [liveSessions, setLiveSessions] = useState<any[]>([])

  // Report Modal State
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    questionId: '',
    title: ''
  })

  const [activeTopic, setActiveTopic] = useState('All Topics')
  const topics = ['All Topics', 'Fiqh', 'Hadith', 'Spirituality', 'Contemporary Issues', 'History', 'Tafsir']

  const openReportModal = (questionId: string, title: string) => {
    setReportModal({
      isOpen: true,
      questionId,
      title
    })
  }

  useEffect(() => {
    // Optionally we can get userId from auth store. Using a simple logic here if available or rely on JWT.
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const parsed = JSON.parse(token)
        setUserId(parsed.state?.user?.id)
      } catch (e) { }
    }

    const fetchFeed = async () => {
      try {
        const res = await api.get('/questions')
        setQuestions(res.data)
      } catch (error) {
        console.error("Failed to load feed", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const res = await api.get('/questions/stats/global')
        setStats(res.data)
      } catch (error) {
        console.error("Failed to fetch stats", error)
      }
    }

    const fetchTopScholars = async () => {
      try {
        const res = await api.get('/scholars/top')
        setTopScholars(res.data)
      } catch (error) {
        console.error("Failed to fetch top scholars", error)
      }
    }
    
    const fetchLive = async () => {
      try {
        const res = await api.get('/live/overview')
        setLiveSessions(res.data.live || [])
      } catch (e) {
        console.error("Failed to fetch live", e)
      }
    }

    fetchFeed()
    fetchStats()
    fetchTopScholars()
    fetchLive()

    // Poll for stats every 5 seconds for "live" feel
    const statsInterval = setInterval(fetchStats, 5000)
    const liveInterval = setInterval(fetchLive, 10000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(liveInterval)
    }
  }, [])

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

        // Ease out quadratic
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

  const handleVote = async (questionId: string, value: number) => {
    try {
      const res = await api.post(`/questions/${questionId}/vote`, { value })
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return { ...q, ratings: res.data }
        }
        return q
      }))
    } catch (err) {
      console.error("Failed to vote", err)
    }
  }

  return (
    <DashboardLayout>
      {/* Left Sidebar: Explore & Discovery */}
      <aside className={styles.leftSidebarHome}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <Compass size={18} color="#006D5B" /> Discover
          </h3>
          <div className={styles.topicSidebarList}>
            <Link href="/topics/fiqh" className={styles.topicSidebarItem}>
              <div className={styles.topicIconWrapper} style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
                <Shield size={16} />
              </div>
              <span>Islamic Law (Fiqh)</span>
            </Link>
            <Link href="/topics/hadith" className={styles.topicSidebarItem}>
              <div className={styles.topicIconWrapper} style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                <Book size={16} />
              </div>
              <span>Hadith Studies</span>
            </Link>
            <Link href="/topics/spirituality" className={styles.topicSidebarItem}>
              <div className={styles.topicIconWrapper} style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
                <Heart size={16} />
              </div>
              <span>Spirituality</span>
            </Link>
            <Link href="/topics/history" className={styles.topicSidebarItem}>
              <div className={styles.topicIconWrapper} style={{ backgroundColor: '#faf5ff', color: '#a855f7' }}>
                <GraduationCap size={16} />
              </div>
              <span>Islamic History</span>
            </Link>
          </div>
        </div>

        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <TrendingUp size={18} color="#006D5B" /> Quick Links
          </h3>
          <div className={styles.quickLinksGrid}>
             <Link href="/live" className={styles.quickLinkItem}>
                <Headphones size={18} />
                <span>Live Audio</span>
             </Link>
             <Link href="/scholars" className={styles.quickLinkItem}>
                <Users size={18} />
                <span>Our Scholars</span>
             </Link>
             <Link href="/series" className={styles.quickLinkItem}>
                <Hash size={18} />
                <span>Knowledge Series</span>
             </Link>
             <Link href="/settings" className={styles.quickLinkItem}>
                <Activity size={18} />
                <span>My Progress</span>
             </Link>
          </div>
        </div>
      </aside>

      {/* Feed Column */}
      <main className={styles.feedContent}>
        {/* Topic Pills Bar */}
        <div className={styles.topicsBar}>
          {topics.map((topic) => (
            <button 
              key={topic} 
              className={`${styles.topicPill} ${activeTopic === topic ? styles.topicPillActive : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Dynamic Carousel */}
        <div className={styles.carouselContainer}>
          {liveSessions.length > 0 ? (
            liveSessions.map((session, idx) => (
              <div key={session.id} className={`${styles.card} ${styles.liveCard} ${styles.carouselItem}`}>
                <div className={styles.liveBadge}>LIVE NOW</div>
                <h2 className={styles.liveTitle}>{session.title || "Live Discussion"}</h2>
                <p className={styles.liveSubtitle}>Join {session.name} for an interactive audio session on {session.specialization || "Islamic topics"}.</p>
                <Link href={`/live/${session.id}`}>
                  <button className={styles.listenButton}>
                    <PlayCircle size={18} /> Join Live
                  </button>
                </Link>
                <div className={styles.carouselDots}>
                  {liveSessions.map((_, i) => (
                    <div key={i} className={`${styles.dot} ${idx === i ? styles.dotActive : ''}`}></div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* Fallback banner when nothing is live */
            <div className={`${styles.card} ${styles.liveCard} ${styles.carouselItem}`} style={{ background: 'linear-gradient(135deg, #006D5B 0%, #004d40 100%)' }}>
              <div className={styles.liveBadge} style={{ background: 'rgba(255,255,255,0.2)' }}>FEEDBACK</div>
              <h2 className={styles.liveTitle}>Welcome to DinJiggasa</h2>
              <p className={styles.liveSubtitle}>Ask questions to verified scholars and join live audio discussions. No scholars are currently live, but you can explore past recordings.</p>
              <Link href="/live">
                <button className={styles.listenButton} style={{ background: 'white', color: '#006D5B' }}>
                  Explore Live TV
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Dynamic Questions Feed */}
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading feed...</div>
        ) : questions.filter((q: any) => q.answers && q.answers.length > 0).length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No answered questions available right now.</div>
        ) : (
          questions
            .filter((q: any) => q.answers && q.answers.length > 0)
            .filter((q: any) => activeTopic === 'All Topics' || q.tags?.some((t: any) => t.name === activeTopic))
            .map((question) => {
            const upvotes = question.ratings?.filter((r: any) => r.value === 1).length || 0
            const downvotes = question.ratings?.filter((r: any) => r.value === -1).length || 0
            const voteScore = upvotes - downvotes
            const myVote = question.ratings?.find((r: any) => r.userId === userId)?.value || 0

            return (
              <div key={question.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.cardTagsWrapper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div className={styles.cardTags}>
                      <span className={styles.tagPrimaryDark}>{question.tags?.[0]?.name || "General"}</span>
                    </div>
                  </div>

                  {/* Make title clickable to open question details */}
                  <Link href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
                    <h2 className={styles.cardTitle} style={{ cursor: 'pointer' }}>{question.title}</h2>
                  </Link>

                  <div className={styles.cardAuthorRow}>
                    <img src={question.answers[0].author?.avatar || `https://ui-avatars.com/api/?name=${question.answers[0].author?.name}&background=10b981&color=fff`} alt={question.answers[0].author?.name} className={styles.cardAuthorAvatar} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className={styles.cardAuthorName}>{question.answers[0].author?.name}</span>
                      {question.answers[0].author?.isVerified && <CheckCircle2 size={14} color="#006D5B" fill="#006D5B1A" />}
                      • {new Date(question.answers[0].createdAt || question.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className={styles.cardText}>
                    {question.body.length > 200 ? `${question.body.substring(0, 200)}...` : question.body}
                  </p>

                  <div className={styles.cardActions}>
                    <div className={styles.voteGroup}>
                      <button
                        className={`${styles.voteAction} ${myVote === 1 ? styles.voteUp : ''}`}
                        onClick={() => handleVote(question.id, 1)}
                        style={{ color: myVote === 1 ? '#10b981' : undefined }}
                      >
                        <ArrowUp size={16} /> {voteScore}
                      </button>
                      <div className={styles.voteDivider}></div>
                      <button
                        className={`${styles.voteAction}`}
                        onClick={() => handleVote(question.id, -1)}
                        style={{ color: myVote === -1 ? '#ef4444' : undefined }}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div className={styles.actionGroup}>
                      <button className={styles.actionBtn}>
                        <Share size={16} /> Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}

        <ReportModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ ...reportModal, isOpen: false })}
          questionId={reportModal.questionId}
          title={reportModal.title}
        />
      </main>

      {/* Right Sidebar */}
      <aside className={styles.rightSidebar}>
        {/* Statistics Widget */}
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <BarChart3 size={18} color="#006D5B" /> Platform Statistics
            <span className={styles.liveIndicator}>
              <span className={styles.pulseDot}></span>
              Live
            </span>
          </h3>
          <div className={styles.statsList}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <HelpCircle size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>
                  {stats ? <CountUp value={stats.totalQuestions} /> : '...'}
                </span>
                <span className={styles.statLabel}>Total Questions</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>
                  {stats ? <CountUp value={stats.totalAnswers} /> : '...'}
                </span>
                <span className={styles.statLabel}>Answers Provided</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <Heart size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>
                  {stats ? <CountUp value={stats.peopleHelped} /> : '...'}
                </span>
                <span className={styles.statLabel}>People Helped</span>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Activity size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>
                  {stats ? <CountUp value={stats.responseRate} suffix="%" /> : '...'}
                </span>
                <span className={styles.statLabel}>Response Rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <GraduationCap size={18} color="#006D5B" /> Top Scholars
          </h3>
          {topScholars.length > 0 ? (
            topScholars.map((scholar) => (
              <div key={scholar.id} className={styles.scholarItem}>
                <img
                  src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=006D5B&color=fff`}
                  alt={scholar.name}
                  className={styles.scholarAvatar}
                />
                <div className={styles.scholarInfo}>
                  <span className={styles.scholarName} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {scholar.name}
                    {scholar.isVerified && <CheckCircle2 size={14} color="#006D5B" fill="#006D5B1A" />}
                  </span>
                  <span className={styles.scholarDesc}>{scholar.specialization || "Islamic Scholar"}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Loading scholars...</div>
          )}

          <Link href="/scholars" className={styles.seeAllLink}>See All Scholars</Link>
        </div>

        <footer className={styles.rightFooter}>
          <div className={styles.footerLinks}>
            <Link href="/about" className={styles.footerLink}>About</Link>
            <Link href="/terms-of-service" className={styles.footerLink}>Guidelines</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy</Link>
            <Link href="/terms-of-service" className={styles.footerLink}>Terms</Link>
          </div>
          <div className={styles.footerCopy}>© 2026 DinJiggasa Inc.</div>
        </footer>
      </aside>
    </DashboardLayout>
  )
}
