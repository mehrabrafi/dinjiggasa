import Image from "next/image"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Islamic pattern or scenery"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>

            {/* Right side - Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="bg-primary text-white p-2 rounded-lg">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="font-bold text-3xl tracking-tight text-gray-900">দ্বীন জিজ্ঞাসা</span>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
