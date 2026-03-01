import { PlayCircle, Bell, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap, Share } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./dashboard.module.css"

export default function Dashboard() {
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

        {/* Card 2 - Voice Answer */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardTags}>
              <span className={styles.tagPrimary}>SPIRITUAL</span>
              <span className={styles.tagDot}>•</span>
              <span>Voice Answer</span>
            </div>

            <Link href="/questions/916490d6-0aed-47ca-a006-c9357e8844ef">
              <h2 className={styles.cardTitle}>How to maintain consistency in Tahajjud?</h2>
            </Link>

            <div className={styles.audioPlayer}>
              <div className={styles.audioAuthorInfo}>
                <img src="https://i.pravatar.cc/150?img=11" alt="Author" className={styles.audioAvatar} />
                <div className={styles.audioMeta}>
                  <span className={styles.audioName}>Sheikh Omar Suleiman</span>
                  <span className={styles.audioSubtitle}>Imam & Scholar</span>
                </div>
              </div>
              <div className={styles.audioRight}>
                <span className={styles.audioTime}>3m 45s</span>
                <div className={styles.audioControls}>
                  <button className={styles.playBtn}><PlayCircle size={20} fill="white" /></button>
                  <div className={styles.waveContainer}>
                    <div className={`${styles.waveBar} ${styles.waveBarActive}`} style={{ height: '40%' }}></div>
                    <div className={`${styles.waveBar} ${styles.waveBarActive}`} style={{ height: '60%' }}></div>
                    <div className={`${styles.waveBar} ${styles.waveBarActive}`} style={{ height: '100%' }}></div>
                    <div className={`${styles.waveBar} ${styles.waveBarActive}`} style={{ height: '80%' }}></div>
                    <div className={styles.waveBar} style={{ height: '50%' }}></div>
                    <div className={styles.waveBar} style={{ height: '30%' }}></div>
                    <div className={styles.waveBar} style={{ height: '60%' }}></div>
                    <div className={styles.waveBar} style={{ height: '40%' }}></div>
                    <div className={styles.waveBar} style={{ height: '70%' }}></div>
                    <div className={styles.waveBar} style={{ height: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <p className={styles.cardText}>
              Consistency in Tahajjud is built through small, manageable habits. Don't overburden yourself initially; start with two rak'ahs before Fajr. The key is intention and asking Allah for ease...
            </p>

            <div className={styles.cardActions}>
              <div className={styles.voteGroup}>
                <button className={`${styles.voteAction} ${styles.voteUp}`}>
                  <ArrowUp size={16} /> 2.1k
                </button>
                <div className={styles.voteDivider}></div>
                <button className={styles.voteAction}>
                  <ArrowDown size={16} />
                </button>
              </div>
              <div className={styles.actionGroup}>
                <button className={styles.actionBtn}>
                  <MessageSquare size={16} /> 89 Comments
                </button>
                <button className={styles.actionBtn}>
                  <Share size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Text Post */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardTags}>
              <span className={styles.tagPrimaryDark}>Ramadan Preparation</span>
            </div>

            <h2 className={styles.cardTitle}>Recommended deeds to perform in the last ten nights of Ramadan</h2>

            <div className={styles.cardAuthorRow}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Author" className={styles.cardAuthorAvatar} />
              <span>Answered by <span className={styles.cardAuthorName}>Dr. Omar Suleiman</span> • 3h ago</span>
            </div>

            <p className={styles.cardText}>
              The last ten nights are the most blessed nights of the year. One should strive to increase in Quran recitation, perform Qiyam al-Layl (night prayers), and make excessive Dua, especially seeking Laylatul Qadr...
            </p>

            <div className={styles.cardActions}>
              <div className={styles.voteGroup}>
                <button className={`${styles.voteAction} ${styles.voteUp}`}>
                  <ArrowUp size={16} /> 1.2k
                </button>
                <div className={styles.voteDivider}></div>
                <button className={styles.voteAction}>
                  <ArrowDown size={16} />
                </button>
              </div>
              <div className={styles.actionGroup}>
                <button className={styles.actionBtn}>
                  <MessageSquare size={16} /> 42
                </button>
                <button className={styles.actionBtn}>
                  <Share size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
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
