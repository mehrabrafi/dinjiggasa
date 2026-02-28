"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement signup functionality here
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-extrabold font-sans uppercase mb-10 text-gray-900 tracking-wide text-left">
                Sign Up
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="name"
                        type="text"
                        required
                        className="h-12 border-gray-200 rounded-none focus-visible:ring-primary"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="h-12 border-gray-200 rounded-none focus-visible:ring-primary"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="h-12 border-gray-200 rounded-none focus-visible:ring-primary"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Gender Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Gender
                    </label>
                    <select
                        name="gender"
                        className="flex h-12 w-full border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-gray-900"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Madhab Preference */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Madhab Preference
                    </label>
                    <select
                        name="madhab"
                        className="flex h-12 w-full border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-gray-900"
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
                    className="w-full h-14 mt-12 mb-8 bg-[#9AA4AE] hover:bg-[#7D8893] text-white font-bold uppercase tracking-widest text-sm rounded-none shadow-sm"
                >
                    Register
                </Button>

                <p className="text-sm font-medium text-gray-900 mt-8 text-left">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#FF5C5C] hover:text-[#E04B4B] font-bold">
                        LOG IN
                    </Link>
                </p>
            </form>
        </div>
    )
}
