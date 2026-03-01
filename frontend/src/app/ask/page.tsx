"use client"

import { useAuthStore } from "@/store/auth.store"
import { Bold, Italic, List as ListIcon, Link as LinkIcon, Image as ImageIcon, Search, X, Plus, Send, Check } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import api from "@/lib/axios"
import styles from "./ask.module.css"

interface Scholar {
    id: string;
    name: string;
    avatar: string | null;
    specialization: string | null;
}

export default function AskQuestionPage() {
    const { user, token, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [isUrgent, setIsUrgent] = useState(false)
    const [scholars, setScholars] = useState<Scholar[]>([])
    const [selectedScholars, setSelectedScholars] = useState<Scholar[]>([])
    const [scholarSearch, setScholarSearch] = useState("")
    const [isScholarDropdownOpen, setIsScholarDropdownOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const scholarInputRef = useRef<HTMLInputElement>(null)
    const titleRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const res = await api.get("/scholars")
                setScholars(res.data)
            } catch (err) {
                console.error("Failed to fetch scholars:", err)
            }
        }
        fetchScholars()
    }, [])

    const filteredScholars = scholars.filter(s =>
        s.name.toLowerCase().includes(scholarSearch.toLowerCase()) &&
        !selectedScholars.find(sel => sel.id === s.id)
    ).slice(0, 5)

    const addScholar = (scholar: Scholar) => {
        if (selectedScholars.length < 1) {
            setSelectedScholars([scholar])
            setScholarSearch("")
            setIsScholarDropdownOpen(false)
        } else {
            setError("You can only select one scholar.")
        }
    }

    const removeScholar = (id: string) => {
        setSelectedScholars(selectedScholars.filter(s => s.id !== id))
    }

    const handlePublish = async () => {
        if (!isAuthenticated) {
            setError("You must be logged in to ask a question.")
            return
        }

        if (!title.trim()) {
            setError("Please provide a title for your question.")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            const res = await api.post("/questions", {
                title,
                body,
                scholarIds: selectedScholars.map(s => s.id),
                isUrgent
            })

            router.push("/")
        } catch (err: any) {
            console.error("Failed to publish question:", err)
            setError(err.response?.data?.message || "Failed to publish question.")
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
                        <label className={styles.label}>Choose Scholar</label>
                        <span className={styles.subLabel}>Select a scholar or expert to direct your question to.</span>

                        <div
                            className={`${styles.scholarInputWrapper} ${isScholarDropdownOpen ? styles.inputWithDropdown : ''}`}
                            onClick={() => {
                                if (selectedScholars.length < 1) {
                                    scholarInputRef.current?.focus()
                                }
                            }}
                        >
                            {selectedScholars.length === 0 && (
                                <Search size={16} className={styles.scholarSearchIcon} />
                            )}

                            {selectedScholars.map(scholar => (
                                <div key={scholar.id} className={styles.scholarPill}>
                                    <img
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=10b981&color=fff`}
                                        alt={scholar.name}
                                        className={styles.scholarPillImg}
                                    />
                                    {scholar.name}
                                    <span
                                        className={styles.removePill}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeScholar(scholar.id);
                                        }}
                                    >
                                        <X size={12} />
                                    </span>
                                </div>
                            ))}

                            {(selectedScholars.length < 1 || (selectedScholars.length >= 1 && isScholarDropdownOpen)) && (
                                <input
                                    ref={scholarInputRef}
                                    type="text"
                                    placeholder={selectedScholars.length > 0 ? "Search for scholars..." : "Search for scholars (e.g., Sheikh, Imam, Dr.)..."}
                                    className={styles.scholarInput}
                                    value={scholarSearch}
                                    onChange={(e) => {
                                        setScholarSearch(e.target.value)
                                        setIsScholarDropdownOpen(true)
                                    }}
                                    onFocus={() => setIsScholarDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsScholarDropdownOpen(false), 200)}
                                    disabled={selectedScholars.length >= 1}
                                    style={{ display: selectedScholars.length >= 1 ? 'none' : 'block' }}
                                />
                            )}

                            {isScholarDropdownOpen && (
                                <div className={styles.scholarDropdown}>
                                    {filteredScholars.length > 0 ? (
                                        filteredScholars.map(scholar => (
                                            <div
                                                key={scholar.id}
                                                className={styles.scholarOption}
                                                onClick={() => addScholar(scholar)}
                                            >
                                                <img
                                                    src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=10b981&color=fff`}
                                                    alt={scholar.name}
                                                    className={styles.scholarAvatar}
                                                />
                                                <div className={styles.scholarInfo}>
                                                    <span className={styles.scholarOptionName}>{scholar.name}</span>
                                                    <span className={styles.scholarSpec}>{scholar.specialization || 'Islamic Scholar'}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noScholars}>
                                            {scholarSearch ? `No scholars found matching "${scholarSearch}"` : "No scholars available"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Question</label>
                        <span className={styles.subLabel}>Start your question with "What", "How", "Why", etc.</span>
                        <textarea
                            ref={titleRef}
                            placeholder="e.g., What is the ruling on combining prayers during travel?"
                            className={`${styles.input} ${styles.titleInput}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            rows={1}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Context / Details (Optional)</label>

                        <textarea
                            className={styles.textarea}
                            placeholder="Include details about your situation to help scholars give a precise answer..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} onClick={() => setIsUrgent(!isUrgent)}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '6px', border: '2px solid', borderColor: isUrgent ? '#ef4444' : '#d1d5db',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isUrgent ? '#ef4444' : 'transparent', color: 'white', flexShrink: 0
                        }}>
                            {isUrgent && <Check size={16} strokeWidth={3} />}
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, color: '#111827', cursor: 'pointer', fontSize: '15px' }}>Mark as Urgent</label>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>Use your monthly quota (1 per month) to get faster responses from scholars.</div>
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
