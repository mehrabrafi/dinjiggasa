"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authService } from "@/services/auth.service"
import toast from "react-hot-toast"
import styles from "../auth.module.css"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await authService.forgotPassword(email)
            toast.success(res.message || "Reset link sent to your email")
            setIsSubmitted(true)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send reset link")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className={styles.fullWidth}>
                <h2 className={styles.heading}>Check Your Email</h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p className={styles.footerText}>
                        If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                    </p>
                    <p className={styles.footerText} style={{ marginTop: '10px' }}>
                        Please check your inbox (and spam folder) for further instructions.
                    </p>
                </div>
                <Link href="/login" className={styles.submitButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', lineHeight: '40px' }}>
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.fullWidth}>
            <h2 className={styles.heading}>Reset Password</h2>
            <p className={styles.footerText} style={{ marginBottom: '20px', textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        required
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>

                <p className={styles.footerText} style={{ marginTop: '20px' }}>
                    Remember your password?{" "}
                    <Link href="/login" className={styles.footerLink}>
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    )
}
