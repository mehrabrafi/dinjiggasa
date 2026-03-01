"use client"

import React, { useState } from "react"
import { Bell, Lock, Moon, UserCircle, User } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import styles from "./settings.module.css"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Account");

    return (
        <DashboardLayout>
            <main className={styles.mainContainer}>
                {/* Internal Settings Sidebar */}
                <aside className={styles.leftSidebar}>
                    <div className={styles.personalAccount}>
                        <img src="https://ui-avatars.com/api/?name=Ahmed+Ali&background=FFE5D0&color=FF8A00" alt="Ahmed Ali" className={styles.personalAvatar} />
                        <div className={styles.personalInfo}>
                            <span className={styles.personalName}>Ahmed Ali</span>
                            <span className={styles.personalLabel}>Personal Account</span>
                        </div>
                    </div>

                    <nav className={styles.sidebarNav}>
                        <button
                            className={`${styles.sidebarNavItem} ${activeTab === 'Account' ? styles.sidebarNavItemActive : ''}`}
                            onClick={() => setActiveTab('Account')}
                        >
                            <User size={18} className={styles.sidebarIcon} /> Account
                        </button>
                        <button
                            className={`${styles.sidebarNavItem} ${activeTab === 'Profile' ? styles.sidebarNavItemActive : ''}`}
                            onClick={() => setActiveTab('Profile')}
                        >
                            <UserCircle size={18} className={styles.sidebarIcon} /> Profile
                        </button>
                        <button
                            className={`${styles.sidebarNavItem} ${activeTab === 'Notifications' ? styles.sidebarNavItemActive : ''}`}
                            onClick={() => setActiveTab('Notifications')}
                        >
                            <Bell size={18} className={styles.sidebarIcon} /> Notifications
                        </button>
                        <button
                            className={`${styles.sidebarNavItem} ${activeTab === 'Privacy' ? styles.sidebarNavItemActive : ''}`}
                            onClick={() => setActiveTab('Privacy')}
                        >
                            <Lock size={18} className={styles.sidebarIcon} /> Privacy
                        </button>
                        <button
                            className={`${styles.sidebarNavItem} ${activeTab === 'Display' ? styles.sidebarNavItemActive : ''}`}
                            onClick={() => setActiveTab('Display')}
                        >
                            <Moon size={18} className={styles.sidebarIcon} /> Display
                        </button>
                    </nav>
                </aside>

                {/* Right Content */}
                <div className={styles.contentArea}>
                    {/* Section 1: Account Settings */}
                    {activeTab === 'Account' && (
                        <>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Account Settings</h2>
                                    <p className={styles.cardDescription}>Manage your login information and security.</p>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email Address</label>
                                    <input type="email" className={styles.input} defaultValue="ahmed.ali@example.com" />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>New Password</label>
                                        <input type="password" className={styles.input} placeholder="Min 8 characters" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Confirm Password</label>
                                        <input type="password" className={styles.input} placeholder="Re-enter password" />
                                    </div>
                                </div>

                                <div className={styles.actionsContainer}>
                                    <button className={styles.btnPrimary}>Save Account Changes</button>
                                </div>

                                <div className={styles.dangerZoneContainer}>
                                    <div className={styles.dangerZoneTextGroup}>
                                        <span className={styles.dangerZoneText}>Danger Zone</span>
                                        <span className={styles.dangerZoneSub}>Deactivating your account will remove all your data.</span>
                                    </div>
                                    <button className={styles.btnDangerText}>Deactivate Account</button>
                                </div>
                            </div>

                            {/* Section 2: Public Profile */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Public Profile</h2>
                                    <p className={styles.cardDescription}>Information visible to other users on the platform.</p>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Display Name</label>
                                    <input type="text" className={styles.input} defaultValue="Ahmed Ali" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Madhab Preference</label>
                                    <p className={styles.cardDescription} style={{ marginBottom: '0.75rem' }}>This helps us tailor answers to your school of thought.</p>
                                    <select className={styles.select} defaultValue="Shafi'i">
                                        <option value="Hanafi">Hanafi</option>
                                        <option value="Maliki">Maliki</option>
                                        <option value="Shafi'i">Shafi'i</option>
                                        <option value="Hanbali">Hanbali</option>
                                        <option value="None">Prefer not to say</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Bio</label>
                                    <textarea className={styles.textarea} placeholder="Write a short bio about yourself..."></textarea>
                                    <div className={styles.charCount}>0/200 characters</div>
                                </div>

                                <div className={styles.actionsContainer}>
                                    <button className={styles.btnDark}>Update Profile</button>
                                </div>
                            </div>

                            {/* Section 3: Display & Accessibility */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Display & Accessibility</h2>
                                    <p className={styles.cardDescription}>Customize how the platform looks for you.</p>
                                </div>

                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingIconBox}>
                                            <Moon size={20} />
                                        </div>
                                        <div className={styles.settingText}>
                                            <span className={styles.settingName}>Dark Mode</span>
                                            <span className={styles.settingDesc}>Switch between light and dark themes</span>
                                        </div>
                                    </div>
                                    <label className={styles.switch}>
                                        <input type="checkbox" />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>

                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingIconBox}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Tt</span>
                                        </div>
                                        <div className={styles.settingText}>
                                            <span className={styles.settingName}>Large Text</span>
                                            <span className={styles.settingDesc}>Increase font size for better readability</span>
                                        </div>
                                    </div>
                                    <label className={styles.switch}>
                                        <input type="checkbox" />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab !== 'Account' && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>{activeTab} Settings</h2>
                                <p className={styles.cardDescription}>Manage your {activeTab.toLowerCase()} preferences.</p>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>This section is currently under development.</p>
                        </div>
                    )}
                </div>
            </main>
        </DashboardLayout>
    )
}
