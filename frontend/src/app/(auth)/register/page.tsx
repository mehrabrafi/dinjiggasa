"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await authService.register(formData)
            toast.success("Registration successful! Please login.")
            router.push("/login")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register. Please try again.")
        } finally {
            setIsLoading(false)
        }
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
