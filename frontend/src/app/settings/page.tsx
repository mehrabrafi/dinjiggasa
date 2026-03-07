"use client"

import React, { useState, useEffect } from "react"
import { Lock, Moon, UserCircle, User, Camera, RefreshCw, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { useTheme } from "next-themes"
import styles from "./settings.module.css"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const { logout, user, updateUser } = useAuthStore()
    const router = useRouter()
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        madhab: '',
        bio: '',
        educationalQualifications: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                madhab: user.madhab || 'Hanafi',
                bio: user.bio || '',
                educationalQualifications: user.educationalQualifications || ''
            });
        }
    }, [user]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully!");
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const response = await api.post('/upload/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update user in store and cookies
            if (user) {
                updateUser({ ...user, avatar: response.data.avatarUrl });
            }
            toast.success("Profile photo updated!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to upload avatar");
        } finally {
            setIsUploading(false);
        }
    }

    const handleProfileUpdate = async () => {
        setIsUpdatingProfile(true);
        try {
            const response = await api.post('/auth/profile', profileData);
            updateUser(response.data.user);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsUpdatingProfile(false);
        }
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
                        {!mounted ? null : (
                            <>
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
                                                    <img
                                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FFE5D0&color=FF8A00`}
                                                        alt="Avatar"
                                                        className={styles.avatar}
                                                    />
                                                    <label className={styles.cameraBtn}>
                                                        <Camera size={12} />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            style={{ display: 'none' }}
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                    {isUploading && <div className={styles.uploadOverlay}><RefreshCw size={16} className={styles.spinner} /></div>}
                                                </div>
                                                <div className={styles.photoMeta}>
                                                    <h3 className={styles.photoHeading}>Profile Photo</h3>
                                                    <p className={styles.photoDesc}>PNG or JPG. Max size 2MB.</p>
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Full Name</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                />
                                            </div>

                                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                                <label className={styles.label}>Madhab Preference</label>
                                                <select
                                                    className={styles.select}
                                                    value={profileData.madhab}
                                                    onChange={(e) => setProfileData({ ...profileData, madhab: e.target.value })}
                                                >
                                                    <option value="Hanafi">Hanafi</option>
                                                    <option value="Maliki">Maliki</option>
                                                    <option value="Shafi'i">Shafi'i</option>
                                                    <option value="Hanbali">Hanbali</option>
                                                    <option value="Salafi">Salafi</option>
                                                </select>
                                                <p className={styles.helpText}>This helps scholars tailor their answers to your school of thought if applicable.</p>
                                            </div>

                                            {user?.role === 'SCHOLAR' && (
                                                <>
                                                    <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                                                        <label className={styles.label}>Biography / Description</label>
                                                        <textarea
                                                            className={styles.textarea}
                                                            value={profileData.bio}
                                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                            placeholder="Tell us a bit about yourself..."
                                                            rows={4}
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                                        <label className={styles.label}>Educational Qualifications</label>
                                                        <textarea
                                                            className={styles.textarea}
                                                            value={profileData.educationalQualifications}
                                                            onChange={(e) => setProfileData({ ...profileData, educationalQualifications: e.target.value })}
                                                            placeholder="List your degrees, ijazahs, or other relevant qualifications..."
                                                            rows={3}
                                                        />
                                                    </div>
                                                </>
                                            )}

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
                                                    <input type="email" className={styles.input} defaultValue={user?.email || ""} />
                                                    <button className={styles.verifyBtn}>Verify</button>
                                                </div>
                                            </div>

                                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                                <label className={styles.label}>Password</label>
                                                {!showPasswordForm ? (
                                                    <button
                                                        className={styles.btnSecondary}
                                                        onClick={() => setShowPasswordForm(true)}
                                                    >
                                                        <RefreshCw size={14} /> Change Password
                                                    </button>
                                                ) : (
                                                    <div className={styles.passwordForm}>
                                                        <div className={styles.formGroup}>
                                                            <label className={styles.label}>Current Password</label>
                                                            <input
                                                                type="password"
                                                                className={styles.input}
                                                                placeholder="Enter current password"
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label className={styles.label}>New Password</label>
                                                            <input
                                                                type="password"
                                                                className={styles.input}
                                                                placeholder="New password (min 6 chars)"
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label className={styles.label}>Confirm New Password</label>
                                                            <input
                                                                type="password"
                                                                className={styles.input}
                                                                placeholder="Confirm new password"
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className={styles.passwordFormActions}>
                                                            <button
                                                                type="button"
                                                                className={styles.btnCancel}
                                                                onClick={() => {
                                                                    setShowPasswordForm(false);
                                                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={styles.btnPrimary}
                                                                onClick={handlePasswordChange}
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? "Updating..." : "Update Password"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
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
                                            <input
                                                type="checkbox"
                                                checked={mounted && theme === 'dark'}
                                                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>



                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Font Size</label>
                                        <select className={styles.select} defaultValue="Medium">
                                            <option value="Small">Small</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Large">Large</option>
                                        </select>
                                    </div>


                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className={styles.actionsCard}>
                            <button className={styles.btnCancel}>Cancel</button>
                            <button
                                className={styles.btnSave}
                                onClick={handleProfileUpdate}
                                disabled={isUpdatingProfile}
                            >
                                {isUpdatingProfile ? "Saving..." : "Save Changes"}
                            </button>
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
