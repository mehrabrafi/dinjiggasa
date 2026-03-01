"use client"

import { useEffect, useState } from 'react'
import { Search, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import DashboardLayout from '@/components/layout/DashboardLayout'
import api from '@/lib/axios'
import styles from './scholars.module.css'

interface Scholar {
    id: string;
    name: string;
    avatar: string | null;
    specialization: string | null;
    bio: string | null;
    isVerified: boolean;
    reputation: number;
}

export default function ScholarsPage() {
    const [scholars, setScholars] = useState<Scholar[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('All')

    const tabs = ['All', 'Fiqh', 'Hadith', 'History', 'Contemporary Issues', 'Theology', 'Family & Marriage']

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const res = await api.get('/scholars')
                setScholars(res.data)
            } catch (error) {
                console.error('Failed to fetch scholars:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchScholars()
    }, [])

    return (
        <DashboardLayout>
            <main className={styles.scholarsContainer}>
                <section className={styles.titleSection}>
                    <h1 className={styles.title}>Our Scholars</h1>
                    <p className={styles.subtitle}>
                        Browse our directory of verified scholars and experts in Islamic jurisprudence, history, and theology to find guidance for your questions.
                    </p>
                </section>

                <section className={styles.filterSection}>
                    <div className={styles.scholarSearch}>
                        <Search size={20} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Search for scholars by name or expertise..."
                        />
                    </div>

                    <div className={styles.tags}>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tag} ${activeTab === tab ? styles.tagActive : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                {loading ? (
                    <div>Loading scholars...</div>
                ) : (
                    <div className={styles.scholarGrid}>
                        {scholars.map((scholar) => (
                            <div key={scholar.id} className={styles.scholarCard}>
                                <div className={styles.cardHeader}>
                                    <img
                                        src={scholar.avatar || `https://ui-avatars.com/api/?name=${scholar.name}&background=006D5B&color=fff`}
                                        alt={scholar.name}
                                        className={styles.avatar}
                                    />
                                    {scholar.isVerified && (
                                        <div className={styles.verifiedBadge}>
                                            <CheckCircle2 size={12} fill="#10b981" color="#fff" /> Verified
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className={styles.scholarName}>{scholar.name}</h3>
                                    <p className={styles.specialization}>{scholar.specialization}</p>
                                    <p className={styles.bio}>{scholar.bio}</p>
                                </div>

                                <div className={styles.cardActions}>
                                    <button className={styles.viewProfileBtn}>View Profile</button>
                                    <button className={`${styles.askBtn} ${styles.askBtnPrimary}`}>Ask Question</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.pagination}>
                    <button className={styles.pageBtn}><ChevronLeft size={18} /></button>
                    <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <span className={styles.pageEllipsis}>...</span>
                    <button className={styles.pageBtn}>12</button>
                    <button className={styles.pageBtn}><ChevronRight size={18} /></button>
                </div>
            </main>
        </DashboardLayout>
    )
}
