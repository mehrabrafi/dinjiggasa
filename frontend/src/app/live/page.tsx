"use client"

import { PlayCircle, Bell, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap, Share, CheckCircle2, Heart, BarChart3, HelpCircle, Activity, Flag, Eye, Video, Headphones } from "lucide-react"
import Link from "next/link"
import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter as useNextRouter } from "next/navigation"
import api from "@/lib/axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "../dashboard.module.css"
import ReportModal from "@/components/modals/ReportModal"
import { useAuthStore } from "@/store/auth.store"
import LandingView from "@/components/landing/LandingView"
import toast from "react-hot-toast"

export default function LiveListPage() {
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
  const [sessions, setSessions] = useState<{ live: any[], past: any[] }>({ live: [], past: [] })
  const [series, setSeries] = useState<any[]>([])
  const [activeTopic, setActiveTopic] = useState('All Topics')
  const topics = ['All Topics', 'Fiqh', 'Hadith', 'Spirituality', 'Contemporary Issues', 'History', 'Tafsir']

  // Report Modal State
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    questionId: '',
    title: ''
  })

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

    const fetchOverview = async () => {
      try {
        const res = await api.get('/live/overview')
        setSessions(res.data)
      } catch (err) {
        console.error("Failed to fetch overview", err)
      }
    }

    const fetchSeries = async () => {
      try {
        const res = await api.get('/live/series')
        setSeries(res.data)
      } catch (err) {
        console.error("Failed to fetch series", err)
      }
    }

    fetchFeed()
    fetchStats()
    fetchTopScholars()
    fetchOverview()
    fetchSeries()

    // Poll for stats every 5 seconds for "live" feel
    const statsInterval = setInterval(fetchStats, 5000)

    return () => {
      clearInterval(statsInterval)
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
      <main className={styles.feedContent} style={{ maxWidth: '1000px' }}>
        
        {/* Topics Filter Bar */}
        <div className={styles.topicsBar}>
          {topics.map(topic => (
            <div 
              key={topic} 
              className={`${styles.topicPill} ${activeTopic === topic ? styles.topicPillActive : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Section 1: Live Sessions */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Live TV</h2>
          <Link href="/live" className={styles.seeAllLink}>See All</Link>
        </div>

        <div className={styles.horizontalScroll}>
          {sessions.live.length > 0 ? (
            sessions.live.map((session) => (
              <Link href={`/live/${session.scholarId}`} key={session.id} className={styles.liveSessionCard} style={{ textDecoration: 'none' }}>
                <div className={styles.cardThumbWrapper}>
                  {session.thumbnailUrl ? (
                    <img src={session.thumbnailUrl} className={styles.cardThumb} alt={session.title} />
                  ) : session.streamType === 'video' ? (
                     <div className={styles.audioVisual} style={{ background: '#0f172a' }}>
                        <Video size={40} color="#3b82f6" />
                     </div>
                  ) : (
                    <div className={styles.audioVisual}>
                      <Activity size={40} color="#10b981" />
                    </div>
                  )}
                  <div className={styles.liveOverlay}>
                    <span className={styles.liveBadgeRed}>LIVE</span>
                    <span className={styles.viewerCount}>
                      <Eye size={12} /> {(session.viewerCount / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.cardCategory}>{session.specialization?.split('&')[0] || "GENERAL"}</div>
                  <h3 className={styles.sessionTitleSmall}>{session.title}</h3>
                  <div className={styles.scholarNameSmall}>{session.name}</div>
                  <div className={styles.cardFooterMeta}>
                    <div className={styles.viewerAvatars}>
                      <img src={`https://ui-avatars.com/api/?name=${session.name}&background=random`} className={styles.avatarMini} />
                      {session.viewerCount > 1 && (
                        <span className={styles.moreViewers}>+{Math.floor(session.viewerCount / 2)}</span>
                      )}
                    </div>
                    <span className={styles.timeAgo}>
                      {session.startedAt ? (
                        (() => {
                          const seconds = Math.floor((new Date().getTime() - new Date(session.startedAt).getTime()) / 1000);
                          let interval = seconds / 3600;
                          if (interval > 1) return Math.floor(interval) + "h ago";
                          interval = seconds / 60;
                          if (interval > 1) return Math.floor(interval) + "m ago";
                          return Math.floor(seconds) + "s ago";
                        })()
                      ) : 'Live now'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
             <div className={styles.card} style={{ flex: '0 0 100%', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No scholar is currently live.
             </div>
          )}
        </div>

        {/* Section 2: Featured Series */}
        <div className={styles.sectionHeader} style={{ marginTop: '2.5rem' }}>
          <h2 className={styles.sectionTitle}>Featured Series</h2>
          <Link href="/series" className={styles.seeAllLink}>See All</Link>
        </div>

        <div className={styles.horizontalScroll}>
          {series.length > 0 ? (
            series.map((s) => (
              <Link href={`/series/${s.id}`} key={s.id} className={styles.seriesCardLarge} style={{ textDecoration: 'none' }}>
                <img src={s.thumbnailUrl || '/assets/images/mock/seerah.png'} className={styles.seriesCardBg} alt={s.title} />
                <div className={styles.seriesContent}>
                  <div className={styles.episodeCountBadge}>{s.episodeCount} EPISODES</div>
                  <h3 className={styles.seriesTitleLarge}>{s.title}</h3>
                  <p className={styles.seriesDesc}>{s.description}</p>
                  <div className={styles.seriesScholar}>
                    <img src={s.scholar?.avatar || `https://ui-avatars.com/api/?name=${s.scholar?.name}`} className={styles.seriesScholarAvatar} />
                    <span className={styles.seriesScholarName}>{s.scholar?.name}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ padding: '2rem', color: '#64748b' }}>Coming soon...</div>
          )}
        </div>

        {/* Section 3: Recent Streams */}
        <div className={styles.sectionHeader} style={{ marginTop: '2.5rem' }}>
          <h2 className={styles.sectionTitle}>Recent Streams</h2>
          <Link href="/recorded" className={styles.seeAllLink}>See All</Link>
        </div>

        <div className={styles.recentGrid}>
          {sessions.past.length > 0 ? (
            sessions.past.map((record) => (
              <div key={record.id} className={styles.recentCard}>
                <div className={styles.recentThumbWrapper}>
                  <img src={record.thumbnailUrl || (record.type === 'VIDEO' ? '/assets/images/mock/recent1.png' : '/assets/images/mock/recent2.png')} className={styles.cardThumb} alt={record.title} />
                  <div className={styles.durationBadge}>
                    {Math.floor((record.duration || 0) / 60)}:{(record.duration || 0) % 60 < 10 ? '0' : ''}{(record.duration || 0) % 60}
                  </div>
                  <div className={styles.typeIcon}>
                    {record.type === 'VIDEO' ? <Video size={14} /> : <Headphones size={14} />}
                  </div>
                </div>
                <div className={styles.recentDetails}>
                  <h4 className={styles.recentTitle}>{record.title}</h4>
                  <div className={styles.recentScholar}>{record.scholar?.name}</div>
                  <div className={styles.recentMeta}>
                    <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    <div className={styles.recentViews}>
                      <Eye size={12} /> {record.viewCount ? (record.viewCount > 999 ? (record.viewCount / 1000).toFixed(1) + 'k' : record.viewCount) : '0'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', color: '#64748b' }}>No recorded sessions yet.</div>
          )}
        </div>

      </main>

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        questionId={reportModal.questionId}
        title={reportModal.title}
      />

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
