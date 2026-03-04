"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../moderator.module.css'
import {
    Filter,
    Search,
    ChevronDown,
    ShieldAlert,
    Check,
    X,
    Eye,
    UserX,
    UserCheck
} from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('PENDING')
    const [reports, setReports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/reports')
            setReports(res.data)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
            toast.error('Failed to load reports')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/reports/${id}/status`, { status })
            toast.success(`Report ${status.toLowerCase()}`)
            fetchReports()
        } catch (error) {
            console.error('Failed to update report status:', error)
            toast.error('Action failed')
        }
    }

    const handleDeleteContent = async (reportId: string, questionId?: string, answerId?: string) => {
        if (!confirm('Are you sure you want to delete this content permanently?')) return

        try {
            if (questionId) {
                await api.delete(`/questions/${questionId}`)
            } else if (answerId) {
                await api.delete(`/questions/answers/${answerId}`)
            }
            await api.patch(`/reports/${reportId}/status`, { status: 'RESOLVED' })
            toast.success('Content removed and report resolved')
            fetchReports()
        } catch (error) {
            console.error('Failed to delete content:', error)
            toast.error('Deletion failed')
        }
    }

    const handleToggleBan = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/auth/users/${userId}/ban`, { isBanned: !currentStatus })
            toast.success(currentStatus ? 'User unbanned' : 'User banned')
            fetchReports()
        } catch (error) {
            toast.error('Failed to update ban status')
        }
    }

    const filteredReports = activeTab === 'all'
        ? reports
        : reports.filter((r: any) => r.status === activeTab)

    return (
        <div className={styles.innerLayout}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Content Reports & Safety</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8125rem' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'all' ? 700 : 500, color: activeTab === 'all' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'all' ? '2px solid #3b82f6' : 'none' }}>
                    All Reports ({reports.length})
                </button>
                <button
                    onClick={() => setActiveTab('PENDING')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'PENDING' ? 700 : 500, color: activeTab === 'PENDING' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'PENDING' ? '2px solid #3b82f6' : 'none' }}>
                    Pending ({reports.filter((r: any) => r.status === 'PENDING').length})
                </button>
                <button
                    onClick={() => setActiveTab('RESOLVED')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'RESOLVED' ? 700 : 500, color: activeTab === 'RESOLVED' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'RESOLVED' ? '2px solid #3b82f6' : 'none' }}>
                    Resolved ({reports.filter((r: any) => r.status === 'RESOLVED').length})
                </button>
                <button
                    onClick={() => setActiveTab('DISMISSED')}
                    style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', cursor: 'pointer', fontWeight: activeTab === 'DISMISSED' ? 700 : 500, color: activeTab === 'DISMISSED' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'DISMISSED' ? '2px solid #3b82f6' : 'none' }}>
                    Dismissed ({reports.filter((r: any) => r.status === 'DISMISSED').length})
                </button>
            </div>

            <div className={styles.contentList}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading reports...</div>
                ) : filteredReports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No reports found.</div>
                ) : filteredReports.map((report: any) => (
                    <div key={report.id} className={styles.contentCard} style={{ opacity: report.status !== 'PENDING' ? 0.7 : 1 }}>
                        <div className={styles.contentMeta}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className={`${styles.contentType} ${report.questionId ? styles.typeQuestion : report.answerId ? styles.typeAnswer : styles.typeReport}`}>
                                    {report.questionId ? 'Question' : report.answerId ? 'Answer' : 'Report'}
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f43f5e', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                                    {report.reason}
                                </span>
                            </div>
                            <span className={styles.activityTime}>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className={styles.contentTitle}>{report.question?.title || report.answer?.content?.substring(0, 100) || 'Deleted Content'}</h3>
                        <div className={styles.contentExcerpt}>
                            <strong>Reporter:</strong> {report.reporter?.name || 'Unknown'} <span className={styles.activityDot} style={{ width: '4px', height: '4px', display: 'inline-block', verticalAlign: 'middle', margin: '0 5px', background: '#94a3b8' }}></span>
                            <strong>Details:</strong> {report.details || 'No additional details'}
                        </div>
                        <div className={styles.contentActions}>
                            {report.status === 'PENDING' ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                                        className={`${styles.actionBtn} ${styles.approveBtn}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669' }}
                                    >
                                        <Check size={14} /> Dismiss Report
                                    </button>
                                    <Link
                                        href={report.questionId ? `/questions/${report.questionId}` : report.answerId ? `/questions/${report.answer?.questionId}` : '#'}
                                        className={`${styles.actionBtn}`}
                                        style={{ border: '1px solid #e2e8f0', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                    >
                                        <Eye size={14} /> Preview
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteContent(report.id, report.questionId, report.answerId)}
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <X size={14} /> Delete Content
                                    </button>
                                    {((report.question?.author || report.answer?.author)) && (
                                        <button
                                            onClick={() => {
                                                const author = report.question?.author || report.answer?.author;
                                                handleToggleBan(author.id, author.isBanned);
                                            }}
                                            className={styles.actionBtn}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                background: (report.question?.author?.isBanned || report.answer?.author?.isBanned) ? '#ecfdf5' : '#fef2f2',
                                                color: (report.question?.author?.isBanned || report.answer?.author?.isBanned) ? '#059669' : '#ef4444',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {(report.question?.author?.isBanned || report.answer?.author?.isBanned) ? <UserCheck size={14} /> : <UserX size={14} />}
                                            {(report.question?.author?.isBanned || report.answer?.author?.isBanned) ? 'Unban Author' : 'Ban Author'}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button className={`${styles.actionBtn}`} style={{ background: '#f1f5f9', color: '#64748b', cursor: 'default' }}>
                                    {report.status}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
