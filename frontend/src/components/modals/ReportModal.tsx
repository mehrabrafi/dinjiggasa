"use client"

import React, { useState } from 'react'
import { X, Flag, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react'
import styles from './ReportModal.module.css'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    questionId?: string
    answerId?: string
    title: string
}

const REPORT_REASONS = [
    { id: 'SPAM', label: 'Spam', desc: 'Irrelevant or repetitive content' },
    { id: 'OFFENSIVE', label: 'Offensive Language', desc: 'Hate speech, harassment, or rudeness' },
    { id: 'INCORRECT', label: 'Incorrect Information', desc: 'Misleading or factually wrong data' },
    { id: 'DUPLICATE', label: 'Duplicate Content', desc: 'This has already been posted' },
    { id: 'OTHER', label: 'Other', desc: 'None of the above' },
]

export default function ReportModal({ isOpen, onClose, questionId, answerId, title }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState('')
    const [details, setDetails] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (!selectedReason) {
            toast.error('Please select a reason')
            return
        }

        setIsSubmitting(true)
        try {
            await api.post('/reports', {
                reason: selectedReason,
                details: details,
                questionId,
                answerId
            })
            setIsSuccess(true)
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
                setSelectedReason('')
                setDetails('')
            }, 2000)
        } catch (error) {
            console.error('Failed to submit report:', error)
            toast.error('Failed to submit report. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <Flag size={20} className={styles.reportIcon} />
                        <h3>Report Content</h3>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className={styles.successView}>
                        <CheckCircle2 size={48} className={styles.successIcon} />
                        <h4>Thank You!</h4>
                        <p>Your report has been submitted. Our moderators will review it shortly to keep DinJiggasa safe.</p>
                    </div>
                ) : (
                    <div className={styles.body} style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', width: '100%', alignItems: 'stretch' }}>
                            {/* Left Side: Preview & Reasons */}
                            <div style={{ flex: '1.4', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className={styles.contentPreview} style={{ margin: 0, background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Reporting Content:</span>
                                    <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>{title}</span>
                                </div>

                                <div className={styles.reasonSection}>
                                    <label className={styles.sectionLabel} style={{ fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Why are you reporting this?</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                        {REPORT_REASONS.map(reason => (
                                            <div
                                                key={reason.id}
                                                className={`${styles.reasonCard} ${selectedReason === reason.id ? styles.selected : ''}`}
                                                onClick={() => setSelectedReason(reason.id)}
                                                style={{ minHeight: '56px', padding: '0.5rem 0.75rem' }}
                                            >
                                                <div className={styles.reasonInfo}>
                                                    <span className={styles.reasonLabel} style={{ fontSize: '0.8125rem' }}>{reason.label}</span>
                                                    <span className={styles.reasonDesc} style={{ fontSize: '0.65rem' }}>{reason.desc}</span>
                                                </div>
                                                {selectedReason === reason.id && <CheckCircle2 size={14} className={styles.checkIcon} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Details & Actions */}
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                                <div className={styles.detailsSection} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <label className={styles.sectionLabel} style={{ fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Additional Details</label>
                                    <textarea
                                        value={details}
                                        onChange={e => setDetails(e.target.value)}
                                        placeholder="Optional: Provide more context..."
                                        className={styles.textarea}
                                        style={{ flex: 1, minHeight: '120px', margin: 0 }}
                                    />
                                </div>

                                <div className={styles.actions} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button onClick={onClose} className={styles.cancelBtn} style={{ flex: 1 }}>Cancel</button>
                                    <button
                                        onClick={handleSubmit}
                                        className={styles.submitBtn}
                                        disabled={isSubmitting || !selectedReason}
                                        style={{ flex: 2 }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
