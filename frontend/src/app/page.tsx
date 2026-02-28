import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Eye, Search } from "lucide-react"
import Link from "next/link"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
              </svg>
            </div>
            <span className={styles.logoText}>দ্বীন জিজ্ঞাসা</span>
          </div>

          <nav className={styles.navLinks}>
            <a href="#" className={styles.navLinkActive}>Home</a>
            <a href="#" className={styles.navLink}>Scholars</a>
            <a href="#" className={styles.navLink}>Topics</a>
            <a href="#" className={styles.navLink}>About</a>
          </nav>

          <div className={styles.headerActions}>
            <Link href="/login">
              <Button variant="ghost">
                Log In
              </Button>
            </Link>
            <Button>
              Ask Question
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Ask scholars, find answers
          </h1>
          <p className={styles.heroSubtitle}>
            Explore a vast library of verified Islamic knowledge or ask your own questions to qualified scholars.
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <div className={styles.searchIcon}>
            <Search size={20} />
          </div>
          <Input
            className={styles.searchInput}
            placeholder="Search for questions, topics, or scholars..."
          />
        </div>

        {/* Topic Filters */}
        <div className={styles.topicFilters}>
          <Badge className={styles.filterBadge}>All Topics</Badge>
          <Badge variant="outline" className={styles.filterBadge}>Fiqh</Badge>
          <Badge variant="outline" className={styles.filterBadge}>Theology</Badge>
          <Badge variant="outline" className={styles.filterBadge}>Hadith</Badge>
          <Badge variant="outline" className={styles.filterBadge}>History</Badge>
          <Badge variant="outline" className={styles.filterBadge}>Family Life</Badge>
        </div>

        {/* Questions Feed */}
        <div className={styles.feed}>

          {/* Featured Question */}
          <div className={`${styles.questionCard} ${styles.questionCardFeatured}`}>
            <div className={styles.featuredBadgeWrapper}>
              <Badge variant="featured">FEATURED</Badge>
            </div>
            <div className={styles.questionMeta}>
              <span className={`${styles.questionCategory} ${styles.categoryFiqh}`}>FIQH</span>
              <span className={styles.questionTime}>• 2 days ago</span>
            </div>

            <h2 className={styles.questionTitle}>
              Is it permissible to delay Maghrib prayer due to work constraints?
            </h2>

            <p className={styles.questionExcerpt}>
              Prayer at its fixed time is a fundamental obligation. However, the Sharia provides flexibility for specific circumstances where missing a prayer or significantly delaying it might be unintentional or forced by necessity. Scholars have detailed specific conditions...
            </p>

            <div className={styles.questionFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className={styles.authorNameWrapper}>
                    <span className={styles.authorName}>Sheikh Ahmed Al-Faris</span>
                    <CheckCircle2 className={styles.verifiedIcon} fill="#eff6ff" />
                  </div>
                  <span className={styles.authorTitle}>Senior Mufti</span>
                </div>
              </div>
              <div className={styles.stats}>
                <Eye className="w-4 h-4" />
                <span>2.4k</span>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <span className={`${styles.questionCategory} ${styles.categoryFamily}`}>FAMILY LIFE</span>
              <span className={styles.questionTime}>• 5 hours ago</span>
            </div>

            <h2 className={styles.questionTitle}>
              Dealing with disagreements between parents regarding children's education
            </h2>

            <p className={styles.questionExcerpt}>
              In Islam, mutual consultation (Shura) is key in family matters. While the father has the final say in certain financial aspects of education, the mother's input regarding the child's welfare is paramount. The best approach is...
            </p>

            <div className={styles.questionFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className={styles.authorNameWrapper}>
                    <span className={styles.authorName}>Dr. Omar Suleiman</span>
                    <CheckCircle2 className={styles.verifiedIcon} fill="#eff6ff" />
                  </div>
                  <span className={styles.authorTitle}>PhD in Islamic Studies</span>
                </div>
              </div>
              <div className={styles.stats}>
                <Eye className="w-4 h-4" />
                <span>1.2k</span>
              </div>
            </div>
          </div>

          {/* Question 3 */}
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <span className={`${styles.questionCategory} ${styles.categoryTheology}`}>THEOLOGY</span>
              <span className={styles.questionTime}>• 1 day ago</span>
            </div>

            <h2 className={styles.questionTitle}>
              Understanding the concept of Qadr (Divine Decree) and Free Will
            </h2>

            <p className={styles.questionExcerpt}>
              This is one of the most profound topics in Aqidah. Scholars explain that Allah's knowledge is encompassing and eternal, yet He has granted human beings the agency to choose their actions within the realm of what He has...
            </p>

            <div className={styles.questionFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className={styles.authorNameWrapper}>
                    <span className={styles.authorName}>Ustadh Michael Harris</span>
                    <CheckCircle2 className={styles.verifiedIcon} fill="#eff6ff" />
                  </div>
                  <span className={styles.authorTitle}>Graduate of Madinah University</span>
                </div>
              </div>
              <div className={styles.stats}>
                <Eye className="w-4 h-4" />
                <span>856</span>
              </div>
            </div>
          </div>

          {/* Question 4 */}
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <span className={`${styles.questionCategory} ${styles.categoryFinance}`}>FINANCE</span>
              <span className={styles.questionTime}>• 3 days ago</span>
            </div>

            <h2 className={styles.questionTitle}>
              Is investing in cryptocurrency considered Halal?
            </h2>

            <p className={styles.questionExcerpt}>
              The ruling on cryptocurrency depends on the specific nature of the token. Generally, if it is used as a currency or store of value and does not involve interest (Riba) or extreme uncertainty (Gharar), many scholars consider it...
            </p>

            <div className={styles.questionFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className={styles.authorNameWrapper}>
                    <span className={styles.authorName}>Sheikh Yasir Qadhi</span>
                    <CheckCircle2 className={styles.verifiedIcon} fill="#eff6ff" />
                  </div>
                  <span className={styles.authorTitle}>Dean of Academic Affairs</span>
                </div>
              </div>
              <div className={styles.stats}>
                <Eye className="w-4 h-4" />
                <span>3.4k</span>
              </div>
            </div>
          </div>

          {/* Floating Dark Mode Toggle from Design */}
          <div className={styles.floatingToggle}>
            <button className={styles.toggleButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            </button>
          </div>

        </div>

        {/* Load More Button */}
        <div className={styles.loadMoreWrapper}>
          <Button variant="outline">
            Load More Questions
            <svg style={{ marginLeft: "0.5rem", width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerCopy}>
          © 2026 দ্বীন জিজ্ঞাসা. Knowledge for everyone.
        </p>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>Terms of Service</a>
          <a href="#" className={styles.footerLink}>Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
