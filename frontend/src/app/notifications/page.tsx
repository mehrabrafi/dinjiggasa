"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./notifications.module.css"
import { Check, Volume2, ThumbsUp, User, Globe } from "lucide-react"

export default function NotificationsPage() {
    const filters = ["All", "Answers", "Upvotes", "Mentions"];

    const notifications = [
        {
            id: 1,
            type: "answer",
            user: "Sheikh Ahmad",
            avatar: "man-1",
            action: "answered your question about Zakat",
            subtext: "Tap to listen to the voice answer",
            time: "2h ago",
            isUnread: true,
            hasVoice: true
        },
        {
            id: 2,
            type: "comment",
            user: "Scholar Mariam",
            avatar: "woman-1",
            action: "commented on your post regarding Hajj preparations",
            subtext: "\"May Allah make your journey easy and accepted...\"",
            time: "5h ago",
            isUnread: false
        },
        {
            id: 3,
            type: "upvote",
            action: "Your answer on 'Sadaqah in Ramadan' was upvoted",
            subtext: "Your contribution is helping 15 other users today.",
            time: "8h ago",
            isUnread: false,
            icon: <ThumbsUp size={16} />
        },
        {
            id: 4,
            type: "mention",
            user: "Sarah",
            avatar: "woman-2",
            action: "mentioned you in a discussion",
            subtext: "\"@User123 This is exactly the reference I was looking for!\"",
            time: "1d ago",
            isUnread: false
        },
        {
            id: 5,
            type: "system",
            user: "Sheikh Ibrahim",
            avatar: "man-2",
            action: "is now online for Live Q&A",
            subtext: "Join the session to ask your questions directly.",
            time: "2d ago",
            isUnread: false,
            isVerified: true
        }
    ];

    return (
        <DashboardLayout>
            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Notifications</h1>
                    <button className={styles.markAllBtn}>Mark all as read</button>
                </div>

                <div className={styles.tabs}>
                    {filters.map((tab, idx) => (
                        <button key={tab} className={`${styles.tab} ${idx === 0 ? styles.tabActive : ''}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className={styles.notificationList}>
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`${styles.notifItem} ${notif.isUnread ? styles.notifUnread : ''}`}>
                            <div className={styles.notifLeft}>
                                <div className={styles.avatarContainer}>
                                    {notif.type === 'upvote' ? (
                                        <div className={styles.notifIconPill}>
                                            <ThumbsUp size={18} />
                                        </div>
                                    ) : notif.type === 'system' ? (
                                        <div className={styles.avatarWrapper}>
                                            <img src={`https://ui-avatars.com/api/?name=${notif.user}&background=006D5B&color=fff`} className={styles.avatar} alt="" />
                                            <div className={styles.verifiedBadge}>
                                                <Check size={8} fill="#fff" color="#fff" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${notif.user || 'User'}&background=${notif.isUnread ? '006D5B' : 'f3f4f6'}&color=${notif.isUnread ? 'fff' : '6b7280'}`} className={styles.avatar} alt="" />
                                    )}
                                </div>
                                <div className={styles.notifInfo}>
                                    <div className={styles.notifActionRow}>
                                        <span className={styles.notifText}>
                                            {notif.user && <span className={styles.userName}>{notif.user} </span>}
                                            {notif.action}
                                        </span>
                                        {notif.hasVoice && <Volume2 size={14} className={styles.voiceIcon} />}
                                    </div>
                                    <span className={styles.subtext}>{notif.subtext}</span>
                                </div>
                            </div>
                            <div className={styles.notifRight}>
                                <span className={styles.time}>{notif.time}</span>
                                {notif.isUnread && <div className={styles.unreadDot}></div>}
                            </div>
                        </div>
                    ))}
                </div>

                <button className={styles.viewOlderBtn}>
                    View older notifications <Check size={14} className={styles.chevronIcon} />
                </button>
            </main>
        </DashboardLayout>
    )
}
