"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./notifications.module.css"
import { Check, Volume2, ThumbsUp, User, Globe, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import Link from "next/link"

export default function NotificationsPage() {
    const filters = ["All"]; // Simplified filters for now, easily extendable later
    const [activeFilter, setActiveFilter] = useState("All");

    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string, isCurrentlyRead: boolean) => {
        if (isCurrentlyRead) return;
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const filteredNotifications = notifications.filter((notif) => {
        if (activeFilter === "All") return true;
        return true;
    });

    return (
        <DashboardLayout>
            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Notifications</h1>
                    <button className={styles.markAllBtn} onClick={markAllAsRead}>Mark all as read</button>
                </div>

                <div className={styles.tabs}>
                    {filters.map((tab, idx) => (
                        <button key={tab} className={`${styles.tab} ${idx === 0 ? styles.tabActive : ''}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No notifications yet.</div>
                ) : (
                    <div className={styles.notificationList}>
                        {filteredNotifications.map((notif) => (
                            <Link key={notif.id} href={notif.questionId ? `/questions/${notif.questionId}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div
                                    className={`${styles.notifItem} ${!notif.isRead ? styles.notifUnread : ''}`}
                                    onClick={() => markAsRead(notif.id, notif.isRead)}
                                >
                                    <div className={styles.notifLeft}>
                                        <div className={styles.avatarContainer}>
                                            <img src={notif.sender?.avatar || `https://ui-avatars.com/api/?name=${notif.sender?.name || 'System'}&background=${!notif.isRead ? '006D5B' : 'f3f4f6'}&color=${!notif.isRead ? 'fff' : '6b7280'}`} className={styles.avatar} alt="Avatar" />
                                        </div>
                                        <div className={styles.notifInfo}>
                                            <div className={styles.notifActionRow}>
                                                <span className={styles.notifText}>
                                                    {notif.sender?.name && <span className={styles.userName}>{notif.sender.name} </span>}
                                                    {notif.message}
                                                </span>
                                            </div>
                                            <span className={styles.subtext}>
                                                {notif.type === 'QUESTION_ACCEPTED' && "Your question has been accepted."}
                                                {notif.type === 'QUESTION_ANSWERED' && "Tap to read the answer."}
                                                {notif.type === 'QUESTION_DECLINED' && "The scholar has declined your question."}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.notifRight}>
                                        <span className={styles.time}>
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                        {!notif.isRead && <div className={styles.unreadDot}></div>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <button className={styles.viewOlderBtn}>
                    View older notifications <Check size={14} className={styles.chevronIcon} />
                </button>
            </main>
        </DashboardLayout>
    )
}
