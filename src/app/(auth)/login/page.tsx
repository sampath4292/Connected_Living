"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    Building2,
    Eye,
    EyeOff,
    Lock,
    Shield,
    User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export default function LoginPage() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSecurity, setIsSecurity] = React.useState(false)
    const [deviceId, setDeviceId] = React.useState("device-1")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (isSecurity) {
                const response = await api.security.login({ username, password, deviceId })
                if (response.accessToken) {
                    router.push("/security-visitors")
                }
            } else {
                const response = await api.login(username, password)
                if (response.accessToken) {
                    router.push("/dashboard")
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid username or password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-background" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute right-[-5rem] top-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />

            <main className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/70 p-6 shadow-[0_25px_80px_-28px_rgba(15,23,42,0.45)] backdrop-blur-2xl ring-1 ring-white/30 sm:p-8">
                    <header className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Connected Living</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your community portal.</p>
                    </header>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div
                            className="grid grid-cols-2 rounded-xl border border-border/70 bg-muted/60 p-1"
                            role="tablist"
                            aria-label="Account type"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={!isSecurity}
                                onClick={() => setIsSecurity(false)}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                    !isSecurity
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Resident
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={isSecurity}
                                onClick={() => setIsSecurity(true)}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                    isSecurity
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Security
                            </button>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="username"
                                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    type="text"
                                    startIcon={<UserIcon className="h-4 w-4" />}
                                    className="h-12 rounded-xl border-border/70 bg-background/85 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                                    placeholder={isSecurity ? "guard1" : "resident_101"}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="password"
                                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        startIcon={<Lock className="h-4 w-4" />}
                                        className="h-12 rounded-xl border-border/70 bg-background/85 pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {!isSecurity && (
                                    <div className="flex justify-end pt-0.5">
                                        <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {isSecurity && (
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="device-id"
                                        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    >
                                        Device ID
                                    </label>
                                    <Input
                                        id="device-id"
                                        type="text"
                                        startIcon={<Shield className="h-4 w-4" />}
                                        className="h-12 rounded-xl border-border/70 bg-background/85 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder="device-1"
                                        value={deviceId}
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        required={isSecurity}
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <footer className="mt-6 border-t border-border/70 pt-4 text-center text-xs text-muted-foreground">
                        {isSecurity ? "Authorized personnel only." : "Contact your society admin for login credentials."}
                    </footer>
                </div>
            </main>

            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                Terms . Privacy . Support
            </div>

            <div className="h-8 sm:h-0" />
        </div>
    )
}
