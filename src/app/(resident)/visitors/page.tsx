"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Search, Filter, X, Ghost, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { api, getIconForType, VisitorItem, SavedVisitorItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"

export default function VisitorsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("upcoming")
    const [visitors, setVisitors] = useState<VisitorItem[]>([])
    const [savedVisitors, setSavedVisitors] = useState<SavedVisitorItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.getVisitors(),
            api.getSavedVisitors()
        ]).then(([vData, sData]) => {
            setVisitors(vData)
            setSavedVisitors(sData)
            setTimeout(() => setLoading(false), 500)
        })
    }, [])

    const filteredVisitors = activeTab === "upcoming"
        ? visitors.filter(v => ["Expected", "Inside", "Gate Pending"].includes(v.status))
        : visitors.filter(v => ["Departed", "Denied", "Expired", "Left"].includes(v.status))

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
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-4xl mx-auto w-full space-y-6">

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        suppressHydrationWarning
                        placeholder="Search visitors..."
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1a237e]/20 text-sm outline-none transition-all"
                    />
                </div>

                {/* Saved Visitors Section */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Frequent Visitors</h3>
                        <Link href="#" className="text-xs font-semibold text-[#1a237e]">View All</Link>
                    </div>

                    {loading ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-28 w-24 flex-shrink-0 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                            {savedVisitors.map(sv => (
                                <Link
                                    key={sv.id}
                                    href={`/visitors/edit/${sv.id}`}
                                    className="flex flex-col items-center justify-center h-28 w-24 flex-shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#1a237e]/30 hover:bg-blue-50/50 transition-all text-center p-2 gap-2 group"
                                >
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#1a237e] font-bold text-xs group-hover:scale-110 transition-transform overflow-hidden">
                                        {(sv.avatar && sv.avatar.includes('/')) ? (
                                            <img src={sv.avatar} alt={sv.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{sv.avatar || sv.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-gray-900 truncate w-20">{sv.name}</span>
                                        <span className="text-[10px] text-gray-500 truncate w-20">{sv.relation || sv.type}</span>
                                    </div>
                                </Link>
                            ))}
                            {/* Add New Quick Action in Horizontal Scroll */}
                            <Link href="/visitors/invite" className="flex flex-col items-center justify-center h-28 w-24 flex-shrink-0 bg-gray-50 border border-transparent border-dashed border-gray-300 rounded-xl hover:bg-gray-100 p-2 gap-2 transition-all">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-400">
                                    <Plus size={16} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">Add New</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tabs */}
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

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : filteredVisitors.length === 0 ? (
                        <EmptyState
                            icon={Ghost}
                            title="No Visitors Found"
                            description={activeTab === 'upcoming' ? "You have no upcoming visitors." : "No visitor history available."}
                            action={activeTab === 'upcoming' ? { label: "Invite Visitor", onClick: () => router.push('/visitors/invite') } : undefined}
                        />
                    ) : (
                        filteredVisitors.map((visitor) => {
                            const Icon = getIconForType(visitor.type)
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
                        })
                    )}
                </div>
            </div>

            {/* FAB for Mobile */}
            <Link href="/visitors/invite" className="fixed bottom-24 right-4 h-14 w-14 bg-[#1a237e] rounded-full flex items-center justify-center text-white shadow-lg lg:hidden hover:scale-105 active:scale-95 transition-all">
                <Plus size={28} />
            </Link>
        </div>
    )
}
