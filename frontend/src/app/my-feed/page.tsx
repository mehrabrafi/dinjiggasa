"use client"

import DashboardLayout from '@/components/layout/DashboardLayout'
import styles from '../dashboard.module.css'
import { Bookmark } from 'lucide-react'

export default function MyFeedPage() {
    return (
        <DashboardLayout>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
                <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Bookmark size={48} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Your Saved Answers</h1>
                <p style={{ color: '#6b7280', maxWidth: '400px', lineHeight: '1.5' }}>
                    This is where you'll find all the Islamic guidance you've saved for quick reference. Start exploring and click the bookmark icon to save your favorite answers!
                </p>
                <button style={{
                    marginTop: '2rem',
                    padding: '0.75rem 2rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    cursor: 'pointer'
                }}>
                    Explore Feed
                </button>
            </div>
        </DashboardLayout>
    )
}
