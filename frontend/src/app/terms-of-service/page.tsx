import React from "react"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Scale } from "lucide-react"
import styles from "./terms.module.css"

export default function TermsOfServicePage() {
    return (
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <Link href="/" className={styles.backBtn}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    <h1 className={styles.title}>Terms of Service</h1>
                    <p className={styles.lastUpdated}>Last Updated: March 6, 2026</p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} /> 1. Acceptance of Terms
                        </h2>
                        <p className={styles.text}>
                            By accessing or using the DinJiggasa platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service. These Terms apply to all visitors, users, scholars, and others who access or use DinJiggasa.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Users size={20} /> 2. User Roles and Responsibilities
                        </h2>
                        <p className={styles.text}>
                            DinJiggasa has distinct user roles, each with specific responsibilities:
                        </p>
                        <ul className={styles.list}>
                            <li><strong>General Users:</strong> May ask questions, view public answers, upvote/downvote content, and request private sessions. Users are expected to maintain respectful conduct when interacting with scholars and the community.</li>
                            <li><strong>Scholars:</strong> Verified individuals who provide answers to questions and conduct private/public sessions. Scholars are expected to provide accurate, culturally, and religiously sound advice based on verified sources.</li>
                            <li><strong>Moderators/Admins:</strong> Oversee platform activity, enforce community guidelines, verify scholars, and manage reports.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <CheckCircle size={20} /> 3. Content Guidelines
                        </h2>
                        <p className={styles.text}>
                            Users are solely responsible for the content they generate. To maintain a respectful environment, the following content is strictly prohibited:
                        </p>
                        <ul className={styles.list}>
                            <li>Content that is hateful, abusive, harassing, or threatening.</li>
                            <li>Spam, promotional material, or unsolicited advertisements.</li>
                            <li>Intentional misinformation or content that blatantly violates established Islamic principles.</li>
                            <li>Attempts to collect personal information from other users without consent.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <AlertTriangle size={20} /> 4. Disclaimers and Limitations
                        </h2>
                        <p className={styles.text}>
                            The information provided on DinJiggasa by scholars is for educational and guidance purposes. While we strive to verify our scholars, DinJiggasa itself does not issue religious fatwas. Outcomes of any advice followed are the sole responsibility of the user. DinJiggasa is not liable for any direct or indirect damages arising from the use of the platform.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Scale size={20} /> 5. Termination and Enforcement
                        </h2>
                        <p className={styles.text}>
                            We reserve the right to suspend or terminate access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section className={styles.section} style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                        <p className={styles.text} style={{ textAlign: 'center', fontSize: '0.9rem', color: '#777' }}>
                            For questions regarding these Terms of Service, please contact us at support@dinjiggasa.com
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
