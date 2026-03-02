import React from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react"
import styles from "./privacy.module.css"

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <Link href="/settings" className={styles.backBtn}>
                        <ArrowLeft size={18} /> Back to Settings
                    </Link>

                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: March 2, 2026</p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Shield size={20} /> Introduction
                        </h2>
                        <p className={styles.text}>
                            Welcome to DinJiggasa. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Eye size={20} /> 1. Information We Collect
                        </h2>
                        <p className={styles.text}>
                            We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, when participating in activities on the platform or otherwise contacting us.
                        </p>
                        <p className={styles.text}>
                            The personal information that we collect depends on the context of your interactions with us and the platform, the choices you make and the products and features you use. The personal information we collect can include the following:
                        </p>
                        <ul className={styles.list}>
                            <li><strong>Publicly Available Personal Information:</strong> Name, bio, and Madhab preference which you choose to display on your profile.</li>
                            <li><strong>Personal Information Provided by You:</strong> Email addresses, passwords, and other similar information.</li>
                            <li><strong>Content and Activity:</strong> Questions asked, answers provided (if you are a scholar), and comments on the platform.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={20} /> 2. How We Use Your Information
                        </h2>
                        <p className={styles.text}>
                            We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                        <ul className={styles.list}>
                            <li>To facilitate account creation and logon process.</li>
                            <li>To send you administrative information.</li>
                            <li>To fulfill and manage your requests for information or scholars.</li>
                            <li>To post testimonials with your consent.</li>
                            <li>To deliver targeted advertising to you (if applicable).</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} /> 3. Will Your Information Be Shared?
                        </h2>
                        <p className={styles.text}>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Shield size={20} /> 4. How Long Do We Keep Your Information?
                        </h2>
                        <p className={styles.text}>
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={20} /> 5. How Do We Keep Your Information Safe?
                        </h2>
                        <p className={styles.text}>
                            We aim to protect your personal information through a system of organizational and technical security measures. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                        </p>
                    </section>

                    <section className={styles.section} style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                        <p className={styles.text} style={{ textAlign: 'center', fontSize: '0.9rem', color: '#777' }}>
                            For any further questions regarding our privacy practices, please contact us at support@dinjiggasa.com
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
