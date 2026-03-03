"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import styles from "../auth.module.css"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await authService.login({ email, password })
            login({ user: data.user, access_token: data.access_token })
            toast.success("Successfully logged in!")

            router.push("/")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to login. Please check credentials.")
        } finally {
            setIsLoading(false)
        }
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
