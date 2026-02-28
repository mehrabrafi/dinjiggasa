"use client"

import { useAuthStore } from "@/store/auth.store"
import { Search, Home, List, Bell, Hash, FileText, Bookmark, Settings, PlayCircle, Share, MessageSquare, ArrowUp, ArrowDown, TrendingUp, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import styles from "./dashboard.module.css"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
            </svg>
          </div>
          <span className={styles.logoText}>DinJiggasa</span>
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
          <Home size={22} className={`${styles.headerIcon} ${styles.headerIconActive}`} />
          <List size={22} className={styles.headerIcon} />
          <Bell size={22} className={styles.headerIcon} />
          <button className={styles.askButton}>Ask Question</button>
          {isAuthenticated && user?.name ? (
            <div className={styles.userAvatar} title={user.name}>
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=006D5B&color=fff`} alt={user.name} className={styles.userAvatar} />
            </div>
          ) : (
            <div className={styles.userAvatar}></div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContainer}>
        {/* Left Sidebar */}
        <aside className={styles.leftSidebar}>
          <nav>
            <div className={`${styles.navItem} ${styles.navItemActive}`}>
              <Home /> Home Feed
            </div>
            <div className={styles.navItem}>
              <Hash /> Topics
            </div>
            <div className={styles.navItem}>
              <FileText /> Drafts
            </div>
            <div className={styles.navItem}>
              <Bookmark /> Bookmarks
            </div>
            <div className={styles.navItem}>
              <Settings /> Settings
            </div>
          </nav>
        </aside>

        {/* Feed */}
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

              <h2 className={styles.cardTitle}>How to maintain consistency in Tahajjud?</h2>

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
            <img src="https://images.unsplash.com/photo-1584281720492-48bd18dca3fc?q=80&w=1000&auto=format&fit=crop" alt="Ramadan" className={styles.cardImage} />
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
                The last ten nights are the most blessed nights of the year. One should strive to increase in Quran recitation, perform Qiyam al-Layl (night prayers), and make excessive Dua, especially seeking Laylatul Qadr. It is narrated that the Prophet (sa...
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

          {/* Card 4 - Voice Answer */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardTags}>
                <span className={styles.tagPrimary}>ZAKAT</span>
                <span className={styles.tagDot}>•</span>
                <span>Voice Answer</span>
              </div>

              <h2 className={styles.cardTitle}>Understanding the importance of Zakat</h2>

              <div className={styles.audioPlayer}>
                <div className={styles.audioAuthorInfo}>
                  <img src="https://i.pravatar.cc/150?img=33" alt="Author" className={styles.audioAvatar} />
                  <div className={styles.audioMeta}>
                    <span className={styles.audioName}>Dr. Yasin Malik</span>
                    <span className={styles.audioSubtitle}>Finance Expert</span>
                  </div>
                </div>
                <div className={styles.audioRight}>
                  <span className={styles.audioTime}>5m 12s</span>
                  <div className={styles.audioControls}>
                    <button className={styles.playBtn} style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}><PlayCircle size={20} fill="#9ca3af" /></button>
                    <div className={styles.waveContainer}>
                      <div className={styles.waveBar} style={{ height: '30%' }}></div>
                      <div className={styles.waveBar} style={{ height: '50%' }}></div>
                      <div className={styles.waveBar} style={{ height: '70%' }}></div>
                      <div className={styles.waveBar} style={{ height: '40%' }}></div>
                      <div className={styles.waveBar} style={{ height: '90%' }}></div>
                      <div className={styles.waveBar} style={{ height: '60%' }}></div>
                      <div className={styles.waveBar} style={{ height: '30%' }}></div>
                      <div className={styles.waveBar} style={{ height: '50%' }}></div>
                      <div className={styles.waveBar} style={{ height: '80%' }}></div>
                      <div className={styles.waveBar} style={{ height: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <p className={styles.cardText}>
                Zakat is not merely a tax, but a form of purification for one's wealth. It serves as the economic backbone of the Ummah, ensuring that wealth circulates and does not...
              </p>

              <div className={styles.cardActions}>
                <div className={styles.voteGroup}>
                  <button className={`${styles.voteAction} ${styles.voteUp}`}>
                    <ArrowUp size={16} /> 562
                  </button>
                  <div className={styles.voteDivider}></div>
                  <button className={styles.voteAction}>
                    <ArrowDown size={16} />
                  </button>
                </div>
                <div className={styles.actionGroup}>
                  <button className={styles.actionBtn}>
                    <MessageSquare size={16} /> 24 Comments
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
            <div className={styles.trendingItem}>
              <div className={styles.trendingMeta}>History • 800 new</div>
              <div className={styles.trendingName}>The Golden Age of Baghdad</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingMeta}>Community</div>
              <div className={styles.trendingName}>Halal Investment Options</div>
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
            <div className={styles.scholarItem}>
              <img src="https://i.pravatar.cc/150?img=33" alt="Scholar" className={styles.scholarAvatar} />
              <div className={styles.scholarInfo}>
                <span className={styles.scholarName}>Dr. Yasin Malik</span>
                <span className={styles.scholarDesc}>Islamic Finance</span>
              </div>
            </div>
            <div className={styles.scholarItem}>
              <img src="https://i.pravatar.cc/150?img=12" alt="Scholar" className={styles.scholarAvatar} />
              <div className={styles.scholarInfo}>
                <span className={styles.scholarName}>Sheikh Omar Suleiman</span>
                <span className={styles.scholarDesc}>Tafseer, Hadith</span>
              </div>
            </div>

            <a className={styles.seeAllLink}>See All Scholars</a>
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

      </div>
    </div>
  )
}
