import React from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Users, ShieldCheck, HeartHandshake, Globe, Scale } from "lucide-react"
import styles from "./about.module.css"

export default function AboutPage() {
    return (
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <Link href="/" className={styles.backBtn}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    <h1 className={styles.title}>About DinJiggasa</h1>
                    <p className={styles.subtitle}>
                        Connecting seekers of knowledge with verified Islamic scholars to provide authentic, reliable, and accessible answers to life's most pressing questions.
                    </p>

                    <div className={styles.heroImageContainer}>
                        <div className={styles.heroOverlay}></div>
                        <img
                            src="https://images.unsplash.com/photo-1564683214965-3619addd900d?q=80&w=1200&auto=format&fit=crop"
                            alt="Islamic Architecture"
                            className={styles.heroImage}
                        />
                    </div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <BookOpen size={24} color="#006D5B" /> Our Mission
                        </h2>
                        <p className={styles.text}>
                            DinJiggasa was born out of a simple, yet profound realization: in the age of information overload, finding authentic, trustworthy Islamic knowledge can be overwhelmingly difficult. Our mission is to bridge the gap between everyday Muslims seeking guidance and qualified scholars capable of providing verified answers based on the Quran and Sunnah.
                        </p>
                        <p className={styles.text}>
                            We envision a platform where no question is too small, no doubt is left unaddressed, and knowledge is shared with wisdom, patience, and profound understanding.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Globe size={24} color="#006D5B" /> What We Do
                        </h2>
                        <div className={styles.missionGrid}>
                            <div className={styles.missionCard}>
                                <div className={styles.cardIcon}>
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className={styles.cardTitle}>Verified Answers</h3>
                                <p className={styles.cardText}>
                                    Unlike unstructured forums, answers on DinJiggasa are exclusively provided by verified, credentialed Islamic scholars. We ensure that the guidance you receive is rooted in sound theology and fiqh.
                                </p>
                            </div>

                            <div className={styles.missionCard}>
                                <div className={styles.cardIcon}>
                                    <Users size={24} />
                                </div>
                                <h3 className={styles.cardTitle}>Open Community</h3>
                                <p className={styles.cardText}>
                                    A safe, inclusive space for everyone—from lifelong practicing Muslims to recent reverts. Ask anonymously if you need to, and browse thousands of questions asked by others in similar situations.
                                </p>
                            </div>

                            <div className={styles.missionCard}>
                                <div className={styles.cardIcon}>
                                    <Scale size={24} />
                                </div>
                                <h3 className={styles.cardTitle}>Balanced Perspective</h3>
                                <p className={styles.cardText}>
                                    We respect the diversity within traditional Islamic scholarship. Our platform accommodates questions across various madhahib (schools of thought) ensuring nuanced and tailored advice.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <HeartHandshake size={24} color="#006D5B" /> Our Core Values
                        </h2>
                        <p className={styles.text}>
                            Everything we build at DinJiggasa is guided by a set of unwavering principles designed to foster a healthy, respectful environment:
                        </p>

                        <ul className={styles.valuesList}>
                            <li className={styles.valueItem}>
                                <div className={styles.valueIcon}><ShieldCheck size={20} /></div>
                                <div className={styles.valueContent}>
                                    <h3>Authenticity (Amanah)</h3>
                                    <p>We treat the dissemination of religious knowledge as a heavy trust. Truth and verification stand above all.</p>
                                </div>
                            </li>
                            <li className={styles.valueItem}>
                                <div className={styles.valueIcon}><HeartHandshake size={20} /></div>
                                <div className={styles.valueContent}>
                                    <h3>Respect (Adab)</h3>
                                    <p>Discussions and interactions must always be grounded in beautiful manners, regardless of disagreements.</p>
                                </div>
                            </li>
                            <li className={styles.valueItem}>
                                <div className={styles.valueIcon}><Globe size={20} /></div>
                                <div className={styles.valueContent}>
                                    <h3>Accessibility</h3>
                                    <p>Knowledge is a right, not a privilege. We strive to make scholarly advice accessible to every corner of the globe via modern technology.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    )
}
