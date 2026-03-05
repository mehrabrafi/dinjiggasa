"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, Suspense } from "react"
import { authService } from "@/services/auth.service"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import styles from "../auth.module.css"

function ResetPasswordForm() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        if (!tokenParam) {
            toast.error("Invalid reset link")
            router.push('/login')
        } else {
            setToken(tokenParam)
        }
    }, [searchParams, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)
        try {
            await authService.resetPassword({ token, newPassword: password })
            toast.success("Password reset successfully! You can now login.")
            router.push("/login")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.fullWidth}>
            <h2 className={styles.heading}>New Password</h2>
            <p className={styles.footerText} style={{ marginBottom: '20px', textAlign: 'center' }}>
                Please enter your new password below.
            </p>

            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>New Password</label>
                    <Input
                        type="password"
                        placeholder="Min 6 characters"
                        required
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Confirm New Password</label>
                    <Input
                        type="password"
                        placeholder="Repeat new password"
                        required
                        className={styles.inputField}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !token}
                    className={styles.submitButton}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}

