"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../answer-question.module.css'
import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import {
    Hash,
    Clock,
    Tag,
    TextCursorInput,
    Mic,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Type,
    Link2,
    HelpCircle,
    Send,
    CheckCircle2,
    Lightbulb,
    Info,
    ChevronDown,
    X
} from 'lucide-react'

export default function AnswerQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params)
    const questionId = resolvedParams.id

    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState('text')
    const [categories, setCategories] = useState<string[]>([])
    const [question, setQuestion] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [answerText, setAnswerText] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        if (user?.role !== 'SCHOLAR' && user?.role !== 'ADMIN') {
            toast.error("You are not authorized to view this page.")
            router.push('/')
            return
        }

        const fetchQuestion = async () => {
            try {
                const res = await api.get(`/questions/${questionId}`)
                setQuestion(res.data)

                // Set initial categories if question has tags
                if (res.data.tags && res.data.tags.length > 0) {
                    setCategories(res.data.tags.map((t: any) => t.name))
                }
            } catch (err: any) {
                console.error("Failed to load question", err)
                if (err.response?.status !== 404) {
                    toast.error("Failed to load question details")
                }
                setQuestion(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestion()
    }, [isAuthenticated, user, router, questionId])

    const removeCategory = (cat: string) => {
        setCategories(categories.filter(c => c !== cat))
    }

    const handlePublish = async () => {
        if (!answerText.trim()) {
            toast.error("Answer cannot be empty")
            return
        }

        // Ideally you want to check word length or other conditions here

        setIsPublishing(true)
        try {
            await api.post(`/questions/${questionId}/answers`, {
                content: answerText
            })
            toast.success("Answer published successfully!")
            router.push('/scholar-panel/new-questions')
        } catch (err: any) {
            console.error("Failed to publish answer", err)
            toast.error(err.response?.data?.message || "Failed to publish answer")
        } finally {
            setIsPublishing(false)
        }
    }

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 600, color: 'var(--primary)' }}>Loading question...</div>
    }

    if (!question) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 600, color: '#ef4444' }}>Question not found</div>
    }

    return (
        <div className={styles.answerContainer}>
            <div className={styles.mainColumn}>
                {/* Question Details Card */}
                <div className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                        <div className={styles.idBadge}>Question ID: #{question.id.substring(0, 6)}</div>
                        <div className={styles.submissionMeta}>
                            Submitted {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <h1 className={styles.questionTitle}>{question.title}</h1>
                    <p className={styles.questionText}>
                        "{question.body}"
                    </p>
                    <div className={styles.tagGroup}>
                        {question.tags?.map((tag: any) => (
                            <span key={tag.id} className={styles.tag}>#{tag.name}</span>
                        ))}
                        {(!question.tags || question.tags.length === 0) && (
                            <span className={styles.tag}>#General</span>
                        )}
                    </div>
                </div>

                {/* Categorization Section */}
                <div className={styles.categorySection}>
                    <div className={styles.sectionLabel}>
                        <Tag size={18} className={styles.sectionIcon} /> Categorize this Answer
                    </div>
                    <div className={styles.categoryInputContainer}>
                        {categories.map(cat => (
                            <div key={cat} className={styles.appliedCategory}>
                                {cat} <X size={14} className={styles.removeCategory} onClick={() => removeCategory(cat)} />
                            </div>
                        ))}
                        <input type="text" placeholder="Search or add categories..." className={styles.categoryInput} />
                    </div>
                    <div className={styles.suggestedGroup}>
                        <span className={styles.suggestedLabel}>Suggested Categories:</span>
                        <div className={styles.suggestion}>Fiqh</div>
                        <div className={styles.suggestion}>Hadith</div>
                        <div className={styles.suggestion}>Contemporary</div>
                        <div className={styles.suggestion}>Spirituality</div>
                    </div>
                </div>

                {/* Editor Section */}
                <div className={styles.editorSection}>
                    <div className={styles.editorTabs}>
                        <div
                            className={`${styles.editorTab} ${activeTab === 'text' ? styles.editorTabActive : ''}`}
                            onClick={() => setActiveTab('text')}
                        >
                            <TextCursorInput size={18} /> Text Answer
                        </div>
                        <div
                            className={`${styles.editorTab} ${activeTab === 'voice' ? styles.editorTabActive : ''}`}
                            onClick={() => setActiveTab('voice')}
                        >
                            <Mic size={18} /> Voice Answer
                        </div>
                    </div>

                    {activeTab === 'text' && (
                        <>
                            <div className={styles.editorToolbar}>
                                <div className={styles.toolbarBtn}><Bold size={18} /></div>
                                <div className={styles.toolbarBtn}><Italic size={18} /></div>
                                <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                                <div className={styles.toolbarBtn}><List size={18} /></div>
                                <div className={styles.toolbarBtn}><ListOrdered size={18} /></div>
                                <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                                <div className={styles.toolbarBtn}><Quote size={18} /></div>
                                <div className={styles.toolbarBtn}><Type size={18} /></div>
                                <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                                <div className={styles.toolbarBtn}><Link2 size={18} /></div>
                                {/* <div className={styles.autosave}>Auto-saved 1m ago</div> */}
                            </div>

                            <div className={styles.editorBody} style={{ padding: 0 }}>
                                <textarea
                                    style={{
                                        width: '100%',
                                        minHeight: '400px',
                                        padding: '2rem',
                                        border: 'none',
                                        resize: 'vertical',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        color: '#334155'
                                    }}
                                    placeholder="Begin your answer here with Bismillah..."
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                ></textarea>
                            </div>
                        </>
                    )}

                    {activeTab === 'voice' && (
                        <div className={styles.editorBody} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '2rem', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Mic size={48} />
                            </div>
                            <p style={{ color: '#64748b', fontWeight: 500 }}>Voice answers are coming soon!</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actionRow}>
                    <button className={styles.clarificationBtn}>
                        <HelpCircle size={18} /> Ask for Clarification
                    </button>
                    <button
                        className={styles.publishBtn}
                        onClick={handlePublish}
                        disabled={isPublishing || !answerText.trim() || activeTab !== 'text'}
                        style={{ opacity: (isPublishing || !answerText.trim() || activeTab !== 'text') ? 0.7 : 1 }}
                    >
                        <Send size={18} /> {isPublishing ? 'Publishing...' : 'Publish Answer'}
                    </button>
                </div>

                {/* Footer Section */}
                <footer className={styles.footer}>
                    <div className={styles.copyright}>© 2024 Scholar Portal. For authorized scholarly use only.</div>
                    <div className={styles.footerLinks}>
                        <span className={styles.footerLink}>Guidelines</span>
                        <span className={styles.footerLink}>Support</span>
                        <span className={styles.footerLink}>Privacy Policy</span>
                    </div>
                </footer>
            </div>

            <div className={styles.sidebarColumn}>
                {/* Guidelines Card */}
                <div className={styles.sidebarCard}>
                    <div className={styles.cardTitleSection}>
                        <Lightbulb size={20} /> Scholar Guidelines
                    </div>
                    <div className={styles.guidelineList}>
                        <div className={styles.guidelineItem}>
                            <div className={styles.checkWrapper}><CheckCircle2 size={16} /></div>
                            <span>Ensure all Quranic verses include the Arabic text alongside the translation.</span>
                        </div>
                        <div className={styles.guidelineItem}>
                            <div className={styles.checkWrapper}><CheckCircle2 size={16} /></div>
                            <span>Verify Hadith authenticity and mention the grade (Sahih, Hasan, etc.).</span>
                        </div>
                        <div className={styles.guidelineItem}>
                            <div className={styles.checkWrapper}><CheckCircle2 size={16} /></div>
                            <span>Maintain a compassionate, clear, and professional tone throughout your answer.</span>
                        </div>
                        <div className={styles.guidelineItem}>
                            <div className={styles.checkWrapper}><CheckCircle2 size={16} /></div>
                            <span>Use bullet points for lists to improve readability for mobile users.</span>
                        </div>
                        <div className={styles.guidelineItem}>
                            <div className={styles.checkWrapper}><CheckCircle2 size={16} /></div>
                            <span>Reference contemporary scholars when discussing modern fiqh issues.</span>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className={styles.statusCard}>
                    <div className={styles.statusLabel}>Editor Status</div>
                    <div className={styles.statusIndicator}>
                        <div className={styles.activeDot} /> Active Session
                    </div>
                </div>
            </div>
        </div>
    )
}
