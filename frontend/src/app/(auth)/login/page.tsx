"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, Suspense } from "react"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "@/services/auth.service"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import styles from "../auth.module.css"

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}

function LoginContent() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [showOTP, setShowOTP] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const login = useAuthStore((state) => state.login)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || "/"

    useEffect(() => {
        let timer: any
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await authService.login({ email, password })
            login({ user: data.user, access_token: data.access_token })
            toast.success("Successfully logged in!")
            router.push(callbackUrl)
        } catch (error: any) {
            const message = error.response?.data?.message || ""
            if (message.includes("verify your email address")) {
                toast.error(message)
                setShowOTP(true)
            } else {
                toast.error(message || "Failed to login. Please check credentials.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otpCode.length !== 6) {
            toast.error("Please enter a valid 6-digit code")
            return
        }
        setIsVerifying(true)
        try {
            await authService.verifyOTP({ email, code: otpCode })
            toast.success("Email verified successfully! You can now login.")
            setShowOTP(false)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Verification failed")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResendOTP = async () => {
        if (countdown > 0) return
        setIsResending(true)
        try {
            const res = await authService.resendOTP(email)
            toast.success("New OTP sent to your email")
            if (res.waitTime) setCountdown(res.waitTime)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend code")
        } finally {
            setIsResending(false)
        }
    }

    if (showOTP) {
        return (
            <div className={styles.fullWidth}>
                <h2 className={styles.heading}>Verify Email</h2>
                <p className={styles.footerText} style={{ marginBottom: '20px' }}>
                    A 6-digit code has been sent to <strong>{email}</strong>.
                </p>

                <form className={styles.formGroup} onSubmit={handleVerifyOTP}>
                    <div className={styles.field}>
                        <label className={styles.label}>Verification Code</label>
                        <Input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            className={styles.inputField}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isVerifying}
                        className={styles.submitButton}
                    >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                    </Button>

                    <p className={styles.footerText}>
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={isResending || countdown > 0}
                            className={styles.footerLink}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                                padding: 0,
                                fontWeight: 'bold',
                                opacity: countdown > 0 ? 0.6 : 1
                            }}
                        >
                            {isResending ? "RESENDING..." : countdown > 0 ? `RESEND IN ${countdown}s` : "RESEND CODE"}
                        </button>
                    </p>

                    <p className={styles.footerText} style={{ marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={() => setShowOTP(false)}
                            className={styles.footerLink}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            Back to Sign In
                        </button>
                    </p>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.fullWidth}>
            <h2 className={styles.heading}>
                Sign In
            </h2>

            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Email
                    </label>
                    <Input
                        type="email"
                        autoComplete="email"
                        required
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        Password
                    </label>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        required
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.forgotPasswordRow}>
                    <Link href="/forgot-password" className={styles.forgotPassword}>
                        Forgot your password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <p className={styles.footerText}>
                    Don't have an account?{" "}
                    <Link href="/register" className={styles.footerLink}>
                        SIGN UP
                    </Link>
                </p>
            </form>
        </div>
    )
}
