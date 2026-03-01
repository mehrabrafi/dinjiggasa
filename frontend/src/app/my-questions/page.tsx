"use client"

import React, { useState, useEffect } from "react"
import { Search, MoreVertical, Eye, ChevronLeft, ChevronRight, ChevronDown, Clock, ListOrdered } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./my-questions.module.css"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"

interface Question {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    views: number;
    acceptedById: string | null;
    _count: { answers: number };
    answers: Array<{
        author: {
            name: string;
            avatar: string | null;
        }
    }>;
}

export default function MyQuestionsPage() {
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [questions, setQuestions] = useState<Question[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        const fetchQuestions = async () => {
            try {
                const res = await api.get('/questions/my-questions')
                setQuestions(res.data)
            } catch (error) {
                console.error("Error fetching my questions:", error)
                toast.error("Failed to load your questions")
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [isAuthenticated, router])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        try {
            await api.post(`/questions/${id}/delete`)
            toast.success("Question deleted")
            setQuestions(questions.filter(q => q.id !== id))
        } catch (error) {
            console.error("Error deleting question:", error)
            toast.error("Failed to delete question")
        }
    }

    const filteredQuestions = questions.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className={styles.contentArea}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>My Questions</h1>
                    <p className={styles.pageDescription}>Manage and track the questions you have asked the community.</p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Search your questions..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.filters}>
                        <button className={styles.filterSelect}>
                            Status: All <ChevronDown size={16} color="#64748b" />
                        </button>
                        <button className={styles.filterSelect}>
                            Sort: Newest <ListOrdered size={16} color="#64748b" />
                        </button>
                    </div>
                </div>

                <div className={styles.cardList}>
                    {isLoading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading your questions...</div>
                    ) : filteredQuestions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No questions found.</div>
                    ) : (
                        filteredQuestions.map(q => {
                            const hasAnswers = q._count.answers > 0;

                            let statusText = "Pending Review";
                            let statusClass = styles.badgePending;
                            if (hasAnswers) {
                                statusText = "Answered";
                                statusClass = styles.badgeAnswered;
                            } else if (q.acceptedById) {
                                statusText = "Accepted (Under Review)";
                                statusClass = styles.badgeDraft;
                            }

                            return (
                                <div key={q.id} className={styles.card}>
                                    <div className={styles.cardTop}>
                                        <div className={styles.statusContainer}>
                                            <span className={`${styles.badge} ${statusClass}`}>
                                                <div className={styles.badgeDot}></div> {statusText}
                                            </span>
                                            <span className={styles.dateText}>Asked on {new Date(q.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <h3 className={styles.questionTitle}>
                                        <Link href={`/questions/${q.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {q.title}
                                        </Link>
                                    </h3>

                                    {hasAnswers && q.answers.length > 0 ? (
                                        <div className={styles.answerBox}>
                                            <div className={styles.answerAuthor}>
                                                <img
                                                    src={q.answers[0].author.avatar || `https://ui-avatars.com/api/?name=${q.answers[0].author.name}&background=f97316&color=fff`}
                                                    alt="Scholar"
                                                    className={styles.authorAvatar}
                                                />
                                                <span className={styles.authorText}>Answered by {q.answers[0].author.name}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.awaitingBox}>
                                            <Clock size={16} /> Awaiting Scholar
                                        </div>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <div className={styles.stats}>
                                            <div className={styles.statItem}>
                                                <Eye size={16} /> {q.views} Views
                                            </div>
                                        </div>
                                        {(!q.acceptedById && !hasAnswers) && (
                                            <div className={styles.actions}>
                                                <button className={styles.actionBtn}>Edit</button>
                                                <button className={styles.actionBtn} onClick={() => handleDelete(q.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && filteredQuestions.length > 0 && (
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn}>
                            <ChevronLeft size={18} />
                        </button>
                        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                        <button className={styles.pageBtn}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

