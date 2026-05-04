"use client"

import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = pathname === "/dashboard"

    return (
        <div className={!isDashboard ? "animate-in fade-in slide-in-from-right-4 duration-500 ease-out" : ""}>
            {children}
        </div>
    )
}
