"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Search, Clock, Filter, Ghost } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { api, getIconForType, VisitorItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"

export default function VisitorsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("upcoming")
    const [visitors, setVisitors] = useState<VisitorItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getVisitors().then(data => {
            setVisitors(data)
            setTimeout(() => setLoading(false), 500)
        })
    }, [])

    const filteredVisitors = activeTab === "upcoming"
        ? visitors.filter(v => ["Expected", "Inside", "Gate Pending"].includes(v.status))
        : visitors.filter(v => ["Departed", "Denied", "Expired"].includes(v.status))

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 lg:border-none p-4 lg:p-6 lg:bg-transparent">
                <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} suppressHydrationWarning className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full lg:hidden">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-[#1a237e] lg:text-3xl">My Visitors</h1>
                    </div>
                    <Link href="/visitors/invite" className="hidden lg:flex items-center gap-2 bg-[#1a237e] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm">
                        <Plus size={20} />
                        <span>Invite Visitor</span>
                    </Link>
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-4xl mx-auto w-full space-y-6">
                {/* Search & Tabs */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            suppressHydrationWarning
                            placeholder="Search visitors..."
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1a237e]/20 text-sm outline-none transition-all"
                        />
                    </div>

                    <div className="flex p-1 bg-gray-100/80 rounded-xl">
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            suppressHydrationWarning
                            className={cn(
                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                activeTab === "upcoming" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Upcoming & Active
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            suppressHydrationWarning
                            className={cn(
                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                activeTab === "history" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            History
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredVisitors.map((visitor) => {
                        const Icon = getIconForType(visitor.type)

                        // Helper to get color style based on type string, can be moved to logic/api if complex
                        let bg, color
                        if (visitor.type === 'Delivery') { bg = 'bg-blue-50'; color = 'text-blue-600' }
                        else if (visitor.type === 'Guest') { bg = 'bg-purple-50'; color = 'text-purple-600' }
                        else { bg = 'bg-orange-50'; color = 'text-orange-600' }

                        return (
                            <div key={visitor.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                                        <Icon size={24} className={color} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{visitor.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{visitor.type}</span>
                                            <span className="text-xs text-gray-500">• {visitor.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-lg tracking-wider text-[#1a237e]">{visitor.code}</div>
                                    <div className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider mt-1",
                                        visitor.status === "Inside" ? "text-green-600" :
                                            visitor.status === "Expected" ? "text-blue-600" : "text-gray-400"
                                    )}>
                                        {visitor.status}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* FAB for Mobile */}
            <Link href="/visitors/invite" className="fixed bottom-24 right-4 h-14 w-14 bg-[#1a237e] rounded-full flex items-center justify-center text-white shadow-lg lg:hidden hover:scale-105 active:scale-95 transition-all">
                <Plus size={28} />
            </Link>
        </div>
    )
}
