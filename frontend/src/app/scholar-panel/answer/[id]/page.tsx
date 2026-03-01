"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import styles from '../answer-question.module.css'
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

export default function AnswerQuestionPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('text')
    const [categories, setCategories] = useState(['Fiqh', 'Hadith'])

    const removeCategory = (cat: string) => {
        setCategories(categories.filter(c => c !== cat))
    }

    return (
        <div className={styles.answerContainer}>
            <div className={styles.mainColumn}>
                {/* Question Details Card */}
                <div className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                        <div className={styles.idBadge}>Question ID: #29481</div>
                        <div className={styles.submissionMeta}>Submitted 2 hours ago • By Abdullah</div>
                    </div>
                    <h1 className={styles.questionTitle}>Significance of Laylat al-Qadr and how to spend it</h1>
                    <p className={styles.questionText}>
                        "What is the significance of the night of Laylat al-Qadr, and how should one best spend it according to the Sunnah? Are there specific surahs recommended for the night prayer?"
                    </p>
                    <div className={styles.tagGroup}>
                        <span className={styles.tag}>#Ramadan</span>
                        <span className={styles.tag}>#Sunnah</span>
                        <span className={styles.tag}>#Fiqh</span>
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
                        <div className={styles.suggestion}>Social Issues</div>
                        <div className={styles.suggestion}>History</div>
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

                    <div className={styles.editorToolbar}>
                        <div className={styles.toolbarBtn}><Bold size={18} /></div>
                        <div className={styles.toolbarBtn}><Italic size={18} /></div>
                        <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                        <div className={styles.toolbarBtn}><List size={18} /></div>
                        <div className={styles.toolbarBtn}><ListOrdered size={18} /></div>
                        <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                        <div className={styles.toolbarBtn}><Quote size={18} /></div>
                        <div className={styles.toolbarBtn}><Type size={18} /></div>
                        <div className={styles.toolbarBtn}><Quote size={18} rotate={180} /></div>
                        <div className={styles.toolbarBtn} style={{ margin: '0 0.5rem', width: '1px', height: '1.25rem', background: '#e2e8f0' }} />
                        <div className={styles.toolbarBtn}><Link2 size={18} /></div>
                        <div className={styles.autosave}>Auto-saved 1m ago</div>
                    </div>

                    <div className={styles.editorBody}>
                        <div className={styles.placeholder}>Begin your answer here with Bismillah...</div>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actionRow}>
                    <button className={styles.clarificationBtn}>
                        <HelpCircle size={18} /> Ask for Clarification
                    </button>
                    <button className={styles.publishBtn}>
                        <Send size={18} /> Publish Answer
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
