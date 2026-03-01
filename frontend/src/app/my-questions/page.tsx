"use client"

import React, { useState } from "react"
import { Search, MoreVertical, Eye, ChevronLeft, ChevronRight, ChevronDown, Clock, MessageSquare, ListOrdered } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./my-questions.module.css"

export default function MyQuestionsPage() {
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
                    {/* Question Card 1 - Answered */}
                    <div className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.statusContainer}>
                                <span className={`${styles.badge} ${styles.badgeAnswered}`}>
                                    <div className={styles.badgeDot}></div> Answered
                                </span>
                                <span className={styles.dateText}>Asked on Oct 12, 2023</span>
                            </div>
                            <MoreVertical size={20} className={styles.moreIcon} />
                        </div>

                        <h3 className={styles.questionTitle}>
                            Is it permissible to combine prayers when traveling for business if the distance is short but traffic is heavy?
                        </h3>

                        <div className={styles.answerBox}>
                            <div className={styles.answerAuthor}>
                                <img src="https://ui-avatars.com/api/?name=Sheikh+Abdullah&background=f97316&color=fff" alt="Scholar" className={styles.authorAvatar} />
                                <span className={styles.authorText}>Answered by Sheikh Abdullah</span>
                            </div>
                            <p className={styles.answerText}>
                                According to the majority of scholars, the definition of travel (safar) that permits shortening and combining prayers is based on distance, generally considered to be around 48 miles (approx 80km). However, regarding heavy traffic within...
                            </p>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <MessageSquare size={16} /> 2 Answers
                                </div>
                                <div className={styles.statItem}>
                                    <Eye size={16} /> 1.2k Views
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}>Edit</button>
                                <button className={styles.actionBtn}>Delete</button>
                                <button className={styles.viewThreadBtn}>View Thread</button>
                            </div>
                        </div>
                    </div>

                    {/* Question Card 2 - Pending Review */}
                    <div className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.statusContainer}>
                                <span className={`${styles.badge} ${styles.badgePending}`}>
                                    <div className={styles.badgeDot}></div> Pending Review
                                </span>
                                <span className={styles.dateText}>Asked on Nov 05, 2023</span>
                            </div>
                            <MoreVertical size={20} className={styles.moreIcon} />
                        </div>

                        <h3 className={styles.questionTitle}>
                            Clarification regarding the calculation of Zakat on long-term investments and stocks?
                        </h3>

                        <div className={styles.awaitingBox}>
                            <Clock size={16} /> Awaiting Scholar
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.stats}>
                                <div style={{ width: '1px' }}></div> {/* Empty for alignment */}
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}>Edit</button>
                                <button className={styles.actionBtn}>Delete</button>
                                <button className={styles.viewDetailsBtn}>View Details</button>
                            </div>
                        </div>
                    </div>

                    {/* Question Card 3 - Answered */}
                    <div className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.statusContainer}>
                                <span className={`${styles.badge} ${styles.badgeAnswered}`}>
                                    <div className={styles.badgeDot}></div> Answered
                                </span>
                                <span className={styles.dateText}>Asked on Sep 22, 2023</span>
                            </div>
                            <MoreVertical size={20} className={styles.moreIcon} />
                        </div>

                        <h3 className={styles.questionTitle}>
                            What is the ruling on using perfumes that contain alcohol?
                        </h3>

                        <div className={styles.answerBox}>
                            <div className={styles.answerAuthor}>
                                <img src="https://ui-avatars.com/api/?name=Mufti+Ibrahim&background=c2410c&color=fff" alt="Scholar" className={styles.authorAvatar} />
                                <span className={styles.authorText}>Answered by Mufti Ibrahim</span>
                            </div>
                            <p className={styles.answerText}>
                                The alcohol used in perfumes is typically denatured alcohol (ethanol) which is synthetically produced or derived differently than khamr (intoxicants meant for drinking). Most contemporary scholars hold the view that this type of alcohol is...
                            </p>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <MessageSquare size={16} /> 5 Answers
                                </div>
                                <div className={styles.statItem}>
                                    <Eye size={16} /> 3.4k Views
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}>Edit</button>
                                <button className={styles.actionBtn}>Delete</button>
                                <button className={styles.viewThreadBtn}>View Thread</button>
                            </div>
                        </div>
                    </div>

                    {/* Question Card 4 - Draft */}
                    <div className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.statusContainer}>
                                <span className={`${styles.badge} ${styles.badgeDraft}`}>
                                    <div className={styles.badgeDot}></div> Draft
                                </span>
                                <span className={styles.dateText}>Last edited 2 days ago</span>
                            </div>
                            <MoreVertical size={20} className={styles.moreIcon} />
                        </div>

                        <h3 className={styles.questionTitle}>
                            Question about inheritance laws for distant relatives...
                        </h3>

                        <div className={styles.cardFooter}>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>Not published yet</div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}>Continue Editing</button>
                                <button className={styles.actionBtn}>Discard</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <button className={styles.pageBtn}>
                        <ChevronLeft size={18} />
                    </button>
                    <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <span className={styles.pageDots}>...</span>
                    <button className={styles.pageBtn}>
                        <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </DashboardLayout>
    )
}
