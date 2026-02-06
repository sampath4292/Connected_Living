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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe rounded-t-[32px] lg:hidden border-t border-gray-100">
            <div className="flex h-20 max-w-lg mx-auto relative">
                {links.map((link) => {
                    const Icon = link.icon
                    const isAi = link.href === "/ai"
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex-1 flex flex-col items-center justify-center relative"
                        >
                            {isAi ? (
                                <div className={cn(
                                    "absolute -top-6 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 transform",
                                    isActive
                                        ? "bg-gradient-to-br from-violet-600 to-indigo-700 border-indigo-50 scale-110 shadow-indigo-200"
                                        : "bg-gradient-to-br from-violet-500 to-indigo-500 border-white hover:scale-105"
                                )}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                            ) : (
                                <div className={cn(
                                    "flex flex-col items-center transition-all duration-300",
                                    isActive ? "text-[#1a237e] scale-110" : "text-gray-400 hover:text-gray-600"
                                )}>
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        isActive ? "bg-indigo-50" : "bg-transparent"
                                    )}>
                                        <Icon className="w-6 h-6 outline-none" />
                                    </div>
                                    {link.label && (
                                        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                                            {link.label}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
