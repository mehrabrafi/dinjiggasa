"use client"

import { useEffect, useState } from 'react'
import { GraduationCap, PlayCircle, Clock, ArrowLeft, LayoutGrid } from "lucide-react"
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import api from '@/lib/axios'
import styles from './series.module.css'

interface Series {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    episodeCount: number;
    scholar: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

export default function SeriesListingPage() {
    const [series, setSeries] = useState<Series[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await api.get('/live/series')
                setSeries(res.data || [])
            } catch (error) {
                console.error('Failed to fetch series:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSeries()
    }, [])

    return (
        <DashboardLayout>
            <main className={styles.container}>
                <header className={styles.header}>
                    <Link href="/live" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Live TV
                    </Link>
                    <h1 className={styles.title}>Knowledge Series</h1>
                    <p className={styles.subtitle}>
                        In-depth series on specialized Islamic topics, delivered by world-renowned scholars.
                    </p>
                </header>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading series...</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {series.map((s) => (
                            <Link href={`/series/${s.id}`} key={s.id} className={styles.card}>
                                <div className={styles.thumbnailWrapper}>
                                    <img 
                                        src={s.thumbnailUrl || '/assets/images/mock/seerah.png'} 
                                        alt={s.title} 
                                        className={styles.thumbnail}
                                    />
                                    <div className={styles.episodeBadge}>
                                        {s.episodeCount} EPISODES
                                    </div>
                                    <div className={styles.overlay}>
                                        <div className={styles.playIcon}>
                                            <PlayCircle size={48} />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.seriesTitle}>{s.title}</h3>
                                    <p className={styles.seriesDesc}>{s.description}</p>
                                    <div className={styles.scholarRow}>
                                        <img 
                                            src={s.scholar?.avatar || `https://ui-avatars.com/api/?name=${s.scholar?.name}`} 
                                            className={styles.scholarAvatar}
                                        />
                                        <span className={styles.scholarName}>{s.scholar?.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {series.length === 0 && !loading && (
                    <div className={styles.empty}>
                        <LayoutGrid size={48} className={styles.emptyIcon} />
                        <h3>No series found</h3>
                        <p>New knowledge series are coming soon. Stay tuned!</p>
                    </div>
                )}
            </main>
        </DashboardLayout>
    )
}
