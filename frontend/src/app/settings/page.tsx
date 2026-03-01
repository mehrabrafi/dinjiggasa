"use client"

import React, { useState } from "react"
import { Bell, Lock, Moon, UserCircle, User, Camera, RefreshCw } from "lucide-react"
import Link from "next/link"
import styles from "./settings.module.css"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");

    return (
        <div className={styles.layout}>
            {/* Left Sidebar */}
            <aside className={styles.sidebar}>
                <Link href="/" className={styles.logoContainer}>
                    <div className={styles.logoIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className={styles.logoText}>DinJiggasa</span>
                </Link>

                <nav className={styles.navLinks}>
                    <button className={`${styles.navItem} ${activeTab === 'Account' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('Account')}>
                        <User size={18} className={styles.navIcon} /> Account
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'Profile' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('Profile')}>
                        <UserCircle size={18} className={styles.navIcon} /> Profile
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'Notifications' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('Notifications')}>
                        <Bell size={18} className={styles.navIcon} /> Notifications
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'Privacy' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('Privacy')}>
                        <Lock size={18} className={styles.navIcon} /> Privacy
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'Display' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('Display')}>
                        <Moon size={18} className={styles.navIcon} /> Display
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    {/* Render different tabs' content depending on active tab. But the mock shows multiple sections as if they scroll. We'll show all or just mock the whole layout as one "Profile" tab for now to match exactly */}
                    <div className={styles.centerArea}>
                        {/* Profile Information Block */}
                        <div className={styles.sectionTitleRow}>
                            <h2 className={styles.sectionTitle}>Profile Information</h2>
                            <span className={styles.visibilityLabel}>Publicly visible</span>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.photoSection}>
                                <div className={styles.avatarWrapper}>
                                    <img src="https://ui-avatars.com/api/?name=Ahmed+Ali&background=FFE5D0&color=FF8A00" alt="Avatar" className={styles.avatar} />
                                    <button className={styles.cameraBtn}>
                                        <Camera size={12} />
                                    </button>
                                </div>
                                <div className={styles.photoMeta}>
                                    <h3 className={styles.photoHeading}>Profile Photo</h3>
                                    <p className={styles.photoDesc}>PNG or JPG. Max size 2MB.</p>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input type="text" className={styles.input} defaultValue="Ahmed Al-Farsi" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Bio</label>
                                <textarea className={styles.textarea} defaultValue="Student of knowledge focused on Islamic history and Fiqh."></textarea>
                            </div>

                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.label}>Madhab Preference</label>
                                <select className={styles.select} defaultValue="Hanafi">
                                    <option value="Hanafi">Hanafi</option>
                                    <option value="Maliki">Maliki</option>
                                    <option value="Shafi'i">Shafi'i</option>
                                    <option value="Hanbali">Hanbali</option>
                                </select>
                                <p className={styles.helpText}>This helps scholars tailor their answers to your school of thought if applicable.</p>
                            </div>
                        </div>

                        {/* Account Settings Block */}
                        <h2 className={styles.sectionTitle}>Account Settings</h2>
                        <div className={styles.card}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <input type="email" className={styles.input} defaultValue="ahmed.alfarsi@example.com" />
                                    <button className={styles.verifyBtn}>Verify</button>
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.label}>Password</label>
                                <button className={styles.btnSecondary}>
                                    <RefreshCw size={14} /> Change Password
                                </button>
                            </div>
                        </div>

                        {/* Display & Interface Block */}
                        <h2 className={styles.sectionTitle}>Display & Interface</h2>
                        <div className={styles.card}>
                            <div className={styles.settingRow}>
                                <div>
                                    <h3 className={styles.settingName}>Dark Mode</h3>
                                    <p className={styles.settingDesc}>Adjust the interface to reduce eye strain</p>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actionsCard}>
                            <button className={styles.btnCancel}>Cancel</button>
                            <button className={styles.btnSave}>Save Changes</button>
                        </div>

                        {/* Footer */}
                        <footer className={styles.footer}>
                            <span>© 2026 DinJiggasa. All rights reserved.</span>
                            <div className={styles.footerLinks}>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Community Guidelines</a>
                            </div>
                        </footer>
                    </div>

                    {/* Right Widget */}
                    <div className={styles.rightSidebar}>
                        <div className={styles.helpWidget}>
                            <h3 className={styles.helpTitle}>NEED HELP?</h3>
                            <p className={styles.helpDesc}>If you're having trouble with your account or have privacy concerns, please contact our support team.</p>
                            <a href="#" className={styles.helpLink}>Help Center &rarr;</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
