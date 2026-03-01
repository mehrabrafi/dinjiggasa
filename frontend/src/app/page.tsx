"use client"

import { PlayCircle, Bell, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap, Share, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./dashboard.module.css"

export default function Dashboard() {
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

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
    fetchFeed()
  }, [])

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
                    <span><span className={styles.cardAuthorName}>{question.answers[0].author?.name}</span> • {new Date(question.answers[0].createdAt || question.createdAt).toLocaleDateString()}</span>
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
      </main>

      {/* Right Sidebar */}
      <aside className={styles.rightSidebar}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <TrendingUp size={18} color="#006D5B" /> Trending Topics
          </h3>
          <div className={styles.trendingItem}>
            <div className={styles.trendingMeta}>Fiqh • 2.4k questions</div>
            <div className={styles.trendingName}>Zakat calculation on stocks</div>
          </div>
          <div className={styles.trendingItem}>
            <div className={styles.trendingMeta}>Events • 5k discussions</div>
            <div className={styles.trendingName}>Upcoming Ramadan Checklist</div>
          </div>
        </div>

        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>
            <GraduationCap size={18} color="#006D5B" /> Our Scholars
          </h3>
          <div className={styles.scholarItem}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Scholar" className={styles.scholarAvatar} />
            <div className={styles.scholarInfo}>
              <span className={styles.scholarName}>Sheikh Abdullah</span>
              <span className={styles.scholarDesc}>Fiqh, Usul al-Fiqh</span>
            </div>
          </div>
          <div className={styles.scholarItem}>
            <img src="https://i.pravatar.cc/150?img=5" alt="Scholar" className={styles.scholarAvatar} />
            <div className={styles.scholarInfo}>
              <span className={styles.scholarName}>Fatima Az-Zahra</span>
              <span className={styles.scholarDesc}>Islamic History, Seerah</span>
            </div>
          </div>

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
