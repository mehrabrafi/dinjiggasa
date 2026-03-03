"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
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
    Send,
    CheckCircle2,
    Lightbulb,
    Info,
    ChevronDown,
    X,
    Square,
    Trash2,
    Plus,
    HelpCircle,
    Save
} from 'lucide-react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function AnswerQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params)
    const questionId = resolvedParams.id

    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text')
    const [categories, setCategories] = useState<string[]>([])
    const [question, setQuestion] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [answerText, setAnswerText] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)
    const [categoryInput, setCategoryInput] = useState('')
    const [allTags, setAllTags] = useState<string[]>([])
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)

    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string>('')
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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

        const fetchAllTags = async () => {
            try {
                const res = await api.get('/questions/tags/all')
                setAllTags(res.data)
            } catch (err) {
                console.error("Failed to fetch tags", err)
            }
        }

        const fetchDraft = async () => {
            try {
                const res = await api.get(`/questions/${questionId}/draft`)
                if (res.data) {
                    if (res.data.content && res.data.content !== 'Voice Answer') {
                        setAnswerText(res.data.content)
                    }
                    if (res.data.voiceUrl) {
                        setAudioUrl(res.data.voiceUrl)
                        setActiveTab('voice')
                    }
                }
            } catch (err) { }
        }

        fetchQuestion()
        fetchAllTags()
        fetchDraft()
    }, [isAuthenticated, user, router, questionId])

    const filteredTags = useMemo(() => {
        if (!categoryInput.trim()) return []
        return allTags.filter(t =>
            t.toLowerCase().includes(categoryInput.toLowerCase()) &&
            !categories.includes(t)
        )
    }, [allTags, categoryInput, categories])

    const removeCategory = (cat: string) => {
        setCategories(categories.filter(c => c !== cat))
    }

    const handleAddCategory = (forcedValue?: string) => {
        const val = forcedValue || categoryInput.trim()
        if (val) {
            if (!categories.includes(val)) {
                setCategories([...categories, val])
            }
            setCategoryInput('')
            setIsTagDropdownOpen(false)
        }
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (error) {
            console.error("Error accessing microphone", error)
            toast.error("Could not access microphone")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop())
        }
    }

    const discardVoice = () => {
        setAudioBlob(null)
        setAudioUrl('')
    }

    const handleSaveDraft = async () => {
        if (!answerText.trim() && !audioBlob && !audioUrl) {
            toast.error("Nothing to save as draft.")
            return
        }

        setIsSavingDraft(true)
        try {
            let voiceUrl = audioUrl;

            // If there's a new recording, upload it first
            if (activeTab === 'voice' && audioBlob) {
                const formData = new FormData()
                formData.append('file', audioBlob, 'voice-draft.webm')
                const uploadRes = await api.post('/upload/answer-voice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                voiceUrl = uploadRes.data.voiceUrl
            }

            await api.post(`/questions/${questionId}/draft`, {
                content: activeTab === 'text' ? answerText : 'Voice Answer',
                voiceUrl: voiceUrl
            })
            toast.success("Draft saved successfully!")
            if (voiceUrl) setAudioUrl(voiceUrl);
        } catch (err: any) {
            console.error("Failed to save draft", err)
            toast.error(err.response?.data?.message || "Failed to save draft")
        } finally {
            setIsSavingDraft(false)
        }
    }

    const handlePublish = async () => {
        if (categories.length === 0) {
            toast.error("Please add at least one category before publishing.")
            return
        }

        if (activeTab === 'text' && !answerText.trim()) {
            toast.error("Answer cannot be empty")
            return
        }

        if (activeTab === 'voice' && !audioBlob && !audioUrl) {
            toast.error("Please record a voice answer")
            return
        }

        setIsPublishing(true)
        try {
            let voiceUrl = audioUrl;

            if (activeTab === 'voice' && audioBlob) {
                const formData = new FormData()
                formData.append('file', audioBlob, 'voice-answer.webm')
                const uploadRes = await api.post('/upload/answer-voice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                voiceUrl = uploadRes.data.voiceUrl
            }

            await api.post(`/questions/${questionId}/answers`, {
                content: activeTab === 'text' ? answerText : 'Voice Answer',
                categories: categories,
                voiceUrl: voiceUrl
            })
            toast.success("Answer published successfully!")
            router.push('/scholar-panel/pending')
        } catch (err: any) {
            console.error("Failed to publish answer", err)
            toast.error(err.response?.data?.message || "Failed to publish answer")
        } finally {
            setIsPublishing(false)
        }
    }


    const isTextEmpty = !answerText || answerText === '<p><br></p>' || answerText.replace(/<[^>]*>?/gm, '').trim() === '';
    const hasText = !isTextEmpty;
    const hasVoice = audioBlob !== null || audioUrl !== '' || isRecording;

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
                        <input
                            type="text"
                            placeholder="Search existing or type new..."
                            className={styles.categoryInput}
                            value={categoryInput}
                            onChange={(e) => {
                                setCategoryInput(e.target.value)
                                setIsTagDropdownOpen(true)
                            }}
                            onFocus={() => setIsTagDropdownOpen(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCategory();
                                }
                            }}
                        />
                        {isTagDropdownOpen && filteredTags.length > 0 && (
                            <div className={styles.tagDropdown}>
                                {filteredTags.map(tag => (
                                    <div
                                        key={tag}
                                        className={styles.tagOption}
                                        onClick={() => handleAddCategory(tag)}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Section */}
                <div className={styles.editorSection}>
                    <div className={styles.editorTabs}>
                        <div
                            className={`${styles.editorTab} ${activeTab === 'text' ? styles.editorTabActive : ''}`}
                            onClick={() => {
                                if (hasVoice && activeTab !== 'text') {
                                    toast.error("Please discard your voice answer first to write a text answer.");
                                    return;
                                }
                                setActiveTab('text');
                            }}
                            style={{ opacity: (activeTab !== 'text' && hasVoice) ? 0.5 : 1, cursor: (activeTab !== 'text' && hasVoice) ? 'not-allowed' : 'pointer' }}
                        >
                            <TextCursorInput size={18} /> Text Answer
                        </div>
                        <div
                            className={`${styles.editorTab} ${activeTab === 'voice' ? styles.editorTabActive : ''}`}
                            onClick={() => {
                                if (hasText && activeTab !== 'voice') {
                                    toast.error("Please clear your text answer first to record a voice answer.");
                                    return;
                                }
                                setActiveTab('voice');
                            }}
                            style={{ opacity: (activeTab !== 'voice' && hasText) ? 0.5 : 1, cursor: (activeTab !== 'voice' && hasText) ? 'not-allowed' : 'pointer' }}
                        >
                            <Mic size={18} /> Voice Answer
                        </div>
                    </div>

                    {activeTab === 'text' && (
                        <>
                            <div className={styles.editorBody} style={{ padding: '0', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <style>{`
                                    .ql-toolbar.ql-snow {
                                        background: #f8faf9 !important;
                                        border: none !important;
                                        border-bottom: 1px solid #e2e8f0 !important;
                                        padding: 8px 12px !important;
                                        border-radius: 20px 20px 0 0 !important;
                                    }
                                    .ql-container.ql-snow {
                                        border: none !important;
                                        font-size: 1.05rem !important;
                                        font-family: inherit !important;
                                        flex: 1 !important;
                                        background: transparent !important;
                                        min-height: 350px !important;
                                    }
                                    .ql-editor {
                                        min-height: 350px !important;
                                        padding: 1.5rem !important;
                                        color: #1e293b !important;
                                        line-height: 1.8 !important;
                                    }
                                    .ql-editor.ql-blank::before {
                                        color: #cbd5e1 !important;
                                        font-style: italic !important;
                                        left: 1.5rem !important;
                                    }
                                    .ql-toolbar.ql-snow .ql-picker-label:hover,
                                    .ql-toolbar.ql-snow .ql-picker-label.ql-active,
                                    .ql-toolbar.ql-snow .ql-picker-item:hover,
                                    .ql-toolbar.ql-snow .ql-picker-item.ql-selected,
                                    .ql-toolbar.ql-snow button:hover,
                                    .ql-toolbar.ql-snow button:focus,
                                    .ql-toolbar.ql-snow button.ql-active {
                                        color: #006D5B !important;
                                    }
                                    .ql-toolbar.ql-snow .ql-stroke {
                                        stroke: #475569;
                                    }
                                    .ql-toolbar.ql-snow button:hover .ql-stroke,
                                    .ql-toolbar.ql-snow button:focus .ql-stroke,
                                    .ql-toolbar.ql-snow button.ql-active .ql-stroke,
                                    .ql-toolbar.ql-snow .ql-picker-label:hover .ql-stroke,
                                    .ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-stroke {
                                        stroke: #006D5B !important;
                                    }
                                    .ql-toolbar.ql-snow .ql-fill {
                                        fill: #475569;
                                    }
                                    .ql-toolbar.ql-snow button:hover .ql-fill,
                                    .ql-toolbar.ql-snow button:focus .ql-fill,
                                    .ql-toolbar.ql-snow button.ql-active .ql-fill,
                                    .ql-toolbar.ql-snow .ql-picker-label:hover .ql-fill,
                                    .ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-fill {
                                        fill: #006D5B !important;
                                    }
                                    .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
                                        margin-bottom: 0.5rem;
                                        color: #006D5B;
                                    }
                                `}</style>
                                <ReactQuill
                                    theme="snow"
                                    value={answerText}
                                    onChange={setAnswerText}
                                    placeholder="Begin your answer here with Bismillah..."
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            ['blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }]
                                        ]
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'voice' && (
                        <div className={styles.editorBody} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
                            {!audioBlob && !audioUrl ? (
                                <>
                                    <div onClick={isRecording ? stopRecording : startRecording} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '50%', background: isRecording ? '#fee2e2' : '#ecfdf5', color: isRecording ? '#ef4444' : '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s', boxShadow: isRecording ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none' }}>
                                        {isRecording ? <Square size={48} /> : <Mic size={48} />}
                                    </div>
                                    <p style={{ color: '#64748b', fontWeight: 500 }}>{isRecording ? 'Listening... click to stop' : 'Click microphone to record your answer'}</p>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
                                    <audio src={audioUrl} controls style={{ width: '100%' }} />
                                    <button onClick={discardVoice} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                                        <Trash2 size={18} /> Discard & Record Again
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actionRow}>
                    <button className={styles.clarificationBtn}>
                        <HelpCircle size={18} /> Ask for Clarification
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className={styles.draftBtn}
                            onClick={handleSaveDraft}
                            disabled={isSavingDraft || isPublishing || (activeTab === 'text' && isTextEmpty) || (activeTab === 'voice' && !hasVoice)}
                            style={{ opacity: (isSavingDraft || isPublishing) ? 0.7 : 1 }}
                        >
                            <Save size={18} /> {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            className={styles.publishBtn}
                            onClick={handlePublish}
                            disabled={isPublishing || categories.length === 0 || (activeTab === 'text' && isTextEmpty) || (activeTab === 'voice' && !hasVoice)}
                            style={{ opacity: (isPublishing || categories.length === 0) ? 0.7 : 1 }}
                        >
                            <Send size={18} /> {isPublishing ? 'Publishing...' : 'Publish Answer'}
                        </button>
                    </div>
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


        </div>
    )
}
