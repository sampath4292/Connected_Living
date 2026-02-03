"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Radio, BrainCircuit, Headset, MoreHorizontal, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResidentBottomNav() {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            label: "",
            icon: Home,
        },
        {
            href: "/hub",
            label: "Hub",
            icon: Radio,
        },
        {
            href: "/ai",
            label: "",
            icon: BrainCircuit, // Placeholder for AI
            primary: false,
        },
        {
            href: "/community",
            label: "Community",
            icon: Users,
        },
        {
            href: "/more",
            label: "",
            icon: MoreHorizontal,
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe rounded-t-[2rem] lg:hidden">
            <div className="flex items-center justify-between h-20 max-w-md mx-auto px-6">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    if (isActive) {
                        return (
                            <div key={link.href} className="flex items-center justify-center">
                                <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center shadow-lg transition-all transform scale-110">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 transition-all",
                                link.href === "/ai" ? "-mt-8" : "text-gray-400 hover:text-[#1a237e]"
                            )}
                        >
                            {link.href === "/ai" ? (
                                <div className="h-16 w-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 text-white transform hover:scale-105 transition-transform">
                                    <Icon className="w-8 h-8" />
                                </div>
                            ) : (
                                <Icon className="w-6 h-6" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div >
    )
}
