"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout'
import api from '@/lib/axios'

export default function TopicsPage() {
    const [topics, setTopics] = useState<any[]>([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await api.get('/questions/tags/trending');
                setTopics(res.data);
            } catch (err) {
                console.error("Failed to fetch topics", err);
            }
        };
        fetchTopics();
    }, []);

    return (
        <DashboardLayout>
            <div style={{ flex: 1, padding: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Explore Topics</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {topics.map(topic => (
                        <Link href={`/topics/${encodeURIComponent(topic.name.toLowerCase())}`} key={topic.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                padding: '2rem',
                                background: '#fff',
                                borderRadius: '1rem',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                height: '100%'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{topic.icon}</span>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{topic.name}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{topic.count} {topic.count === 1 ? 'Question' : 'Questions'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
