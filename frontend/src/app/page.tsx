"use client"

import { PlayCircle, Bell, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap, Share, CheckCircle2, Heart, BarChart3, HelpCircle, Activity, Flag } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./dashboard.module.css"
import ReportModal from "@/components/modals/ReportModal"
import { useAuthStore } from "@/store/auth.store"
import LandingView from "@/components/landing/LandingView"

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

    fetchFeed()
    fetchStats()
    fetchTopScholars()

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
      {/* Feed Column */}
      <main className={styles.feedContent}>

        {/* Card 1 - Live Carousel */}
        <div className={styles.carouselContainer}>
          {/* Slide 1 */}
          <div className={`${styles.card} ${styles.liveCard} ${styles.carouselItem}`}>
            <div className={styles.liveBadge}>LIVE SESSION</div>
            <h2 className={styles.liveTitle}>Mastering Quranic Arabic</h2>
            <p className={styles.liveSubtitle}>Join Sheikh Omar Suleiman for an exclusive live deep-dive into the linguistic miracles of Juz Amma...</p>
            <button className={styles.listenButton}>
              <PlayCircle size={18} /> Listen Now
            </button>
            <div className={styles.carouselDots}>
              <div className={`${styles.dot} ${styles.dotActive}`}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>

          {/* ... Slides 2 and 3 omitted for brevity in this replacement but assumed to be present ... */}
          {/* Let's keep them all for full UI experience */}
          {/* Slide 2 */}
          <div className={`${styles.card} ${styles.liveCard} ${styles.carouselItem}`} style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1588775005893-6629cb8c156f?q=80&w=1000&auto=format&fit=crop')" }}>
            <div className={styles.liveBadge} style={{ backgroundColor: '#FF5C5C' }}>UPCOMING</div>
            <h2 className={styles.liveTitle}>Fiqh of Finance</h2>
            <p className={styles.liveSubtitle}>Dr. Yasin Malik explains the complexities of modern Zakat calculation in this upcoming detailed workshop...</p>
            <button className={styles.listenButton}>
              <Bell size={18} /> Set Reminder
            </button>
            <div className={styles.carouselDots}>
              <div className={styles.dot}></div>
              <div className={`${styles.dot} ${styles.dotActive}`}></div>
              <div className={styles.dot}></div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className={`${styles.card} ${styles.liveCard} ${styles.carouselItem}`} style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1564683214965-3619addd900d?q=80&w=1000&auto=format&fit=crop')" }}>
            <div className={styles.liveBadge} style={{ backgroundColor: '#3b82f6' }}>Q&A</div>
            <h2 className={styles.liveTitle}>Ask Me Anything: Youth Issues</h2>
            <p className={styles.liveSubtitle}>Open session with various scholars addressing contemporary challenges faced by Muslim youth...</p>
            <button className={styles.listenButton}>
              <MessageSquare size={18} /> Join Session
            </button>
            <div className={styles.carouselDots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={`${styles.dot} ${styles.dotActive}`}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Questions Feed */}
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading feed...</div>
        ) : questions.filter((q: any) => q.answers && q.answers.length > 0).length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No answered questions available right now.</div>
        ) : (
          questions.filter((q: any) => q.answers && q.answers.length > 0).map((question) => {
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
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Guidelines</a>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <a href="#" className={styles.footerLink}>Terms</a>
          </div>
          <div className={styles.footerCopy}>© 2026 DinJiggasa Inc.</div>
        </footer>
      </aside>
    </DashboardLayout>
  )
}
