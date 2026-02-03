"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User as UserIcon, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authenticate } from "@/lib/auth-mock"

export default function LoginPage() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Simple mock authentication
        const user = authenticate(username, password)

        if (user) {
            console.log("Logged in as:", user.role)
            router.push(user.redirectPath)
        } else {
            setError("Invalid username or password")
        }
    }

    // Use a simple placeholder SVG for the illustration since we don't have the asset
    const Illustration = () => (
        <div className="w-full flex justify-center mb-8">
            <div className="relative w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32 text-blue-500 opacity-80">
                        <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <path d="M12 6a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
                        <path d="M16 17.5a6 6 0 0 0-8 0" />
                    </svg>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Illustration />

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1a237e]">
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Login to continue
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <Input
                            type="text"
                            placeholder="Username"
                            startIcon={<UserIcon className="h-4 w-4" />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            startIcon={<Lock className="h-4 w-4" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                            }
                        />
                        <div className="flex justify-end mt-2">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-semibold text-[#1a237e] hover:text-blue-500"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button className="w-full h-12 rounded-xl text-base bg-[#1a237e] hover:bg-[#283593]" type="submit">
                            Login
                        </Button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-semibold leading-6 text-[#1a237e] hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}
