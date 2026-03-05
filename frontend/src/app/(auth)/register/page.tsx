"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import styles from "../auth.module.css"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        madhab: "",
    })

    const [otpCode, setOtpCode] = useState("")
    const [showOTP, setShowOTP] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const router = useRouter()

    useEffect(() => {
        let timer: any
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await authService.register(formData)
            toast.success(res.message || "OTP sent to your email!")
            if (res.waitTime) setCountdown(res.waitTime)
            setShowOTP(true)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register. Please try again.")
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
            await authService.verifyOTP({ email: formData.email, code: otpCode })
            toast.success("Email verified successfully! You can now login.")
            router.push("/login")
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
            const res = await authService.resendOTP(formData.email)
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
                    A 6-digit code has been sent to <strong>{formData.email}</strong>.
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
                        {isVerifying ? "Verifying..." : "Verify & Register"}
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
                            Back to Sign Up
                        </button>
                    </p>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.fullWidth}>
            <h2 className={styles.heading}>
                Sign Up
            </h2>

            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Full Name <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <Input
                        name="name"
                        type="text"
                        required
                        className={styles.inputField}
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        Email <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <Input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={styles.inputField}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        Password <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <Input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={styles.inputField}
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Gender Selection */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        Gender
                    </label>
                    <select
                        name="gender"
                        className={styles.selectField}
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Madhab Preference */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        Madhab Preference
                    </label>
                    <select
                        name="madhab"
                        className={styles.selectField}
                        value={formData.madhab}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Madhab preference</option>
                        <option value="hanafi">Hanafi</option>
                        <option value="shafi">Shafi'i</option>
                        <option value="maliki">Maliki</option>
                        <option value="hanbali">Hanbali</option>
                        <option value="none">No Preference / Salafi</option>
                    </select>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? "Registering..." : "Register"}
                </Button>

                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.footerLink}>
                        LOG IN
                    </Link>
                </p>
            </form>
        </div>
    )
}
