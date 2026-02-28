"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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
        <div className="w-full">
            <h2 className="text-3xl font-extrabold font-sans uppercase mb-10 text-gray-900 tracking-wide text-left">
                Sign In
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Email
                    </label>
                    <Input
                        type="email"
                        autoComplete="email"
                        required
                        className="h-12 border-gray-200 rounded-none focus-visible:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Password
                    </label>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        required
                        className="h-12 border-gray-200 rounded-none focus-visible:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-primary underline">
                        Forgot your password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 mt-12 mb-8 bg-[#9AA4AE] hover:bg-[#7D8893] text-white font-bold uppercase tracking-widest text-sm rounded-none shadow-sm disabled:opacity-70"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <p className="text-sm font-medium text-gray-900 mt-8 text-left">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-[#FF5C5C] hover:text-[#E04B4B] font-bold">
                        SIGN UP
                    </Link>
                </p>
            </form>
        </div>
    )
}
