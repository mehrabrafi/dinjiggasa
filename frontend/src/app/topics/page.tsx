"use client"

import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TopicsPage() {
    const topics = [
        { name: "Spiritual Growth", count: 120, icon: "🌱" },
        { name: "Fiqh & Law", count: 85, icon: "⚖️" },
        { name: "Family & Marriage", count: 64, icon: "🏠" },
        { name: "History", count: 42, icon: "📜" },
        { name: "Hadith Studies", count: 38, icon: "📖" },
        { name: "Contemporary Issues", count: 76, icon: "🌐" },
    ]

    return (
        <DashboardLayout>
            <div style={{ flex: 1, padding: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Explore Topics</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {topics.map(topic => (
                        <div key={topic.name} style={{
                            padding: '2rem',
                            background: '#fff',
                            borderRadius: '1rem',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{topic.icon}</span>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{topic.name}</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{topic.count} Questions</p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
