"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Radio, BrainCircuit, Headset, MoreHorizontal, LogOut, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResidentSidebar() {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            label: "Home",
            icon: Home,
        },
        {
            href: "/hub",
            label: "Smart Hub",
            icon: Radio,
        },
        {
            href: "/ai",
            label: "AI Assistant",
            icon: BrainCircuit,
        },
        {
            href: "/community",
            label: "Community",
            icon: Users,
        },
        {
            href: "/more",
            label: "More",
            icon: MoreHorizontal,
        },
    ]

    return (
        <div className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-[#1a237e]">Connected<br />Living</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-[#1a237e]/5 text-[#1a237e] font-semibold"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                                link.href === "/ai" && !isActive && "text-violet-600 hover:bg-violet-50 hover:text-violet-700 font-medium"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-[#1a237e]" : "text-gray-400",
                                link.href === "/ai" && "text-violet-600 animate-pulse"
                            )} />
                            <span>{link.label}</span>
                            {link.href === "/ai" && (
                                <span className="ml-auto bg-violet-100 text-violet-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}
