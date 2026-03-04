"use client"

import React, { useState, useEffect } from 'react'
import styles from '../moderator.module.css'
import {
    Search,
    ShieldCheck,
    ShieldAlert,
    UserCheck,
    UserX,
    MoreVertical,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/auth/users')
            setUsers(res.data)
        } catch (error) {
            console.error('Failed to fetch users:', error)
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/auth/users/${userId}/verify`, { isVerified: !currentStatus })
            toast.success(currentStatus ? 'User unverified' : 'User verified')
            fetchUsers()
        } catch (error) {
            toast.error('Verification update failed')
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.patch(`/auth/users/${userId}/role`, { role: newRole })
            toast.success(`Role updated to ${newRole}`)
            fetchUsers()
        } catch (error) {
            toast.error('Failed to update role')
        }
    }

    const handleToggleBan = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/auth/users/${userId}/ban`, { isBanned: !currentStatus })
            toast.success(currentStatus ? 'User unbanned' : 'User banned')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to update ban status')
        }
    }

    return (
        <div className={styles.innerLayout}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>User Management</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8125rem' }}
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8125rem' }}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="USER">Regular Users</option>
                        <option value="SCHOLAR">Scholars</option>
                        <option value="MODERATOR">Moderators</option>
                    </select>
                </div>
            </div>

            <div className={styles.contentList}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No users found.</div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>USER</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ROLE</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>STATUS</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>JOINED</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: user.isBanned ? '#fff5f5' : 'transparent' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                    alt={user.name}
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                                                />
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: user.role === 'SCHOLAR' ? '#f5f3ff' : user.role === 'MODERATOR' ? '#fef2f2' : '#eff6ff',
                                                color: user.role === 'SCHOLAR' ? '#8b5cf6' : user.role === 'MODERATOR' ? '#ef4444' : '#3b82f6'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {user.isVerified ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        <CheckCircle2 size={14} /> Verified
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
                                                        <XCircle size={14} /> Unverified
                                                    </div>
                                                )}
                                                {user.isBanned && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        <UserX size={14} /> Banned
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {user.role !== 'ADMIN' && (
                                                    <>
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            style={{
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '6px',
                                                                border: '1px solid #e2e8f0',
                                                                fontSize: '0.75rem',
                                                                background: '#f8fafc',
                                                                color: '#475569'
                                                            }}
                                                        >
                                                            <option value="USER">User</option>
                                                            <option value="SCHOLAR">Scholar</option>
                                                            <option value="MODERATOR">Moderator</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleToggleBan(user.id, user.isBanned)}
                                                            className={styles.actionBtn}
                                                            style={{
                                                                padding: '0.25rem 0.75rem',
                                                                background: user.isBanned ? '#ecfdf5' : '#fef2f2',
                                                                color: user.isBanned ? '#059669' : '#ef4444',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {user.isBanned ? <UserCheck size={12} /> : <UserX size={12} />}
                                                            {user.isBanned ? 'Unban' : 'Ban User'}
                                                        </button>
                                                    </>
                                                )}

                                                {user.role === 'SCHOLAR' && (
                                                    <button
                                                        onClick={() => handleToggleVerify(user.id, user.isVerified)}
                                                        className={styles.actionBtn}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            background: user.isVerified ? '#fff1f2' : '#ecfdf5',
                                                            color: user.isVerified ? '#e11d48' : '#059669',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {user.isVerified ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                                        {user.isVerified ? 'Unverify' : 'Verify'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
