"use client"

import { useAuthStore } from "@/store/auth.store"
import { Bold, Italic, List as ListIcon, Link as LinkIcon, Image as ImageIcon, Search, X, Plus, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./ask.module.css"

export default function AskQuestionPage() {
    const { user, token, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState<string[]>(["Spiritual Growth", "Fiqh"])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handlePublish = async () => {
        if (!isAuthenticated) {
            setError("You must be logged in to ask a question.")
            return
        }

        if (!title.trim() || !body.trim()) {
            setError("Please provide both a title and details for your question.")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            const res = await fetch("http://localhost:3001/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    body,
                    tags
                })
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/questions/${data.id}`)
            } else {
                const data = await res.json()
                setError(data.message || "Failed to publish question.")
            }
        } catch (err) {
            setError("An error occurred while publishing. Please try again.")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <DashboardLayout>
            <main className={styles.container}>
                {/* Left Form Area */}
                <div className={styles.formCard}>
                    <h1 className={styles.pageTitle}>What is your question about Islam?</h1>

                    {error && <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Question</label>
                        <span className={styles.subLabel}>Start your question with "What", "How", "Why", etc.</span>
                        <input
                            type="text"
                            placeholder="e.g., What is the ruling on combining prayers during travel?"
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Context / Details (Optional)</label>
                        <div className={styles.toolbar}>
                            <button className={styles.toolbarBtn}><Bold size={16} /></button>
                            <button className={styles.toolbarBtn}><Italic size={16} /></button>
                            <span style={{ color: '#d1d5db' }}>|</span>
                            <button className={styles.toolbarBtn}><ListIcon size={16} /></button>
                            <span style={{ color: '#d1d5db' }}>|</span>
                            <button className={styles.toolbarBtn}><LinkIcon size={16} /></button>
                            <button className={styles.toolbarBtn}><ImageIcon size={16} /></button>
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="Include details about your situation to help scholars give a precise answer..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Choose Scholars</label>
                        <span className={styles.subLabel}>Select up to 3 scholars or experts to direct your question to.</span>

                        <div className={styles.scholarInputWrapper}>
                            <Search size={16} className={styles.scholarSearchIcon} />
                            <input
                                type="text"
                                placeholder="Search for scholars (e.g., Sheikh, Imam, Dr.)..."
                                className={`${styles.input} ${styles.scholarInput}`}
                            />
                        </div>

                        <div className={styles.selectedScholars}>
                            <div className={styles.scholarPill}>
                                <img src="https://i.pravatar.cc/150?img=11" alt="Scholar" className={styles.scholarPillImg} />
                                Dr. Omar Suleiman
                                <span className={styles.removePill}><X size={12} /></span>
                            </div>
                            <div className={styles.scholarPill}>
                                <img src="https://i.pravatar.cc/150?img=33" alt="Scholar" className={styles.scholarPillImg} />
                                Sheikh Yasir Qadhi
                                <span className={styles.removePill}><X size={12} /></span>
                            </div>
                            <button className={styles.addScholarBtn}>
                                <Plus size={12} /> Add scholar
                            </button>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Link href="/">
                            <button type="button" className={styles.cancelBtn}>Cancel</button>
                        </Link>
                        <button
                            type="button"
                            className={styles.submitBtn}
                            onClick={handlePublish}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Question'} <Send size={16} />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div style={{ width: '300px', flexShrink: 0 }}>
                    <div className={styles.sidebarCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M21 12.5a8.5 8.5 0 1 0-17 0 6 6 0 0 0 3.39 5.37C8.16 18.3 9 19 9 20v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2c0-1 .84-1.7 1.61-2.13A6 6 0 0 0 21 12.5Z" /></svg>
                            </div>
                            <h2 className={styles.cardTitle}>Writing a good question</h2>
                        </div>

                        <div className={styles.tipList}>
                            <div className={styles.tipItem}>
                                <div className={styles.tipNumber}>1</div>
                                <div className={styles.tipContent}>
                                    <div className={styles.tipTitle}>Be Specific</div>
                                    <div className={styles.tipDesc}>Vague questions get vague answers. Provide details but keep it concise.</div>
                                </div>
                            </div>

                            <div className={styles.tipItem}>
                                <div className={styles.tipNumber}>2</div>
                                <div className={styles.tipContent}>
                                    <div className={styles.tipTitle}>Check for Duplicates</div>
                                    <div className={styles.tipDesc}>Someone might have already asked your question. Search before posting.</div>
                                </div>
                            </div>

                            <div className={styles.tipItem}>
                                <div className={styles.tipNumber}>3</div>
                                <div className={styles.tipContent}>
                                    <div className={styles.tipTitle}>Choose Right Experts</div>
                                    <div className={styles.tipDesc}>Directing your question to specialized scholars ensures a more accurate response.</div>
                                </div>
                            </div>

                            <div className={styles.tipItem}>
                                <div className={styles.tipNumber}>4</div>
                                <div className={styles.tipContent}>
                                    <div className={styles.tipTitle}>Respectful Tone</div>
                                    <div className={styles.tipDesc}>Maintain adab (etiquette) in your query to foster a beneficial discussion.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines Section remains unchanged */}
                    <div className={`${styles.sidebarCard} ${styles.sidebarCardGreen}`}>
                        <h3 className={styles.guidelinesTitle}>Community Guidelines</h3>
                        <p className={styles.guidelinesText}>
                            Please ensure your question adheres to our community standards. We do not allow hate speech, spam, or disrespect towards religious figures. <Link href="#" className={styles.guidelinesLink}>Read full guidelines</Link>
                        </p>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    )
}
