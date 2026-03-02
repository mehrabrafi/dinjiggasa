"use client"

import React, { useState } from "react"
import { Bell, Lock, Moon, UserCircle, User, Camera, RefreshCw, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import styles from "./settings.module.css"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const { logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

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

                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    {/* Render different tabs' content depending on active tab */}
                    <div className={styles.centerArea}>
                        {activeTab === 'Profile' && (
                            <>
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
                            </>
                        )}

                        {activeTab === 'Account' && (
                            <>
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
                            </>
                        )}

                        {activeTab === 'Notifications' && (
                            <>
                                <h2 className={styles.sectionTitle}>Notifications</h2>
                                <div className={styles.card}>
                                    <div className={styles.settingRow}>
                                        <div>
                                            <h3 className={styles.settingName}>Reply Notifications</h3>
                                            <p className={styles.settingDesc}>Get notified when someone replies to your questions</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" defaultChecked />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                    <div className={styles.settingRow} style={{ marginTop: '1.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Scholar Mentions</h3>
                                            <p className={styles.settingDesc}>Get notified when a scholar mentions you or your question</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" defaultChecked />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                    <div className={styles.settingRow} style={{ marginTop: '1.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Weekly Digest</h3>
                                            <p className={styles.settingDesc}>Receive a weekly summary of top questions and answers</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                    <div className={styles.settingRow} style={{ marginTop: '1.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Push Notifications</h3>
                                            <p className={styles.settingDesc}>Get real-time updates directly on your device</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'Privacy' && (
                            <>
                                <h2 className={styles.sectionTitle}>Privacy Settings</h2>
                                <div className={styles.card}>
                                    <div className={styles.settingRow}>
                                        <div>
                                            <h3 className={styles.settingName}>Profile Visibility</h3>
                                            <p className={styles.settingDesc}>Make your profile visible to everyone on the platform</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" defaultChecked />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                    <div className={styles.settingRow} style={{ marginTop: '1.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Search Engine Indexing</h3>
                                            <p className={styles.settingDesc}>Allow search engines to index your public questions and profile</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" defaultChecked />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                    <div className={styles.formGroup} style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                                        <Link href="/privacy-policy" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Read Our Detailed Privacy Policy &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'Display' && (
                            <>
                                <h2 className={styles.sectionTitle}>Display & Interface</h2>
                                <div className={styles.card}>
                                    <div className={styles.settingRow} style={{ marginBottom: '1.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Dark Mode</h3>
                                            <p className={styles.settingDesc}>Switch between light and dark themes</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Language</label>
                                        <select className={styles.select} defaultValue="English">
                                            <option value="English">English</option>
                                            <option value="Bengali">Bengali (বাংলা)</option>
                                            <option value="Arabic">Arabic (العربية)</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Font Size</label>
                                        <select className={styles.select} defaultValue="Medium">
                                            <option value="Small">Small</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Large">Large</option>
                                        </select>
                                    </div>

                                    <div className={styles.settingRow} style={{ marginTop: '0.5rem' }}>
                                        <div>
                                            <h3 className={styles.settingName}>Compact View</h3>
                                            <p className={styles.settingDesc}>Reduce spacing between elements to show more content</p>
                                        </div>
                                        <label className={styles.switch}>
                                            <input type="checkbox" />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

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
