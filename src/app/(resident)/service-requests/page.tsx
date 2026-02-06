"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Search, Filter, Inbox } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { api, getIconForType, ServiceRequestItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"

export default function ServiceRequestsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("open")
    const [requests, setRequests] = useState<ServiceRequestItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch data
        api.getServiceRequests().then(data => {
            setRequests(data)
            setTimeout(() => setLoading(false), 500) // Demo delay
        })
    }, [])

    const filteredRequests = activeTab === "open"
        ? requests.filter(r => ["Open", "In Progress"].includes(r.status))
        : requests.filter(r => ["Resolved", "Closed"].includes(r.status))

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 lg:border-none p-4 lg:p-6 lg:bg-transparent">
                <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} suppressHydrationWarning className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full lg:hidden">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-[#1a237e] lg:text-3xl">Service Requests</h1>
                    </div>
                    <Link href="/service-requests/new" suppressHydrationWarning className="hidden lg:flex items-center gap-2 bg-[#1a237e] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm">
                        <Plus size={20} />
                        <span>New Request</span>
                    </Link>
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-4xl mx-auto w-full space-y-6">
                {/* Search & Tabs */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                suppressHydrationWarning
                                placeholder="Search requests..."
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#1a237e]/20 text-sm text-black placeholder:text-gray-400 outline-none transition-all"
                            />
                        </div>
                        <button suppressHydrationWarning className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="flex p-1 bg-gray-100/80 rounded-xl">
                        <button
                            onClick={() => setActiveTab("open")}
                            suppressHydrationWarning
                            className={cn(
                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                activeTab === "open" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab("closed")}
                            suppressHydrationWarning
                            className={cn(
                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                activeTab === "closed" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            History
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))
                    ) : filteredRequests.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title="No Service Requests"
                            description={activeTab === 'open' ? "You don't have any active service requests." : "No past service requests found."}
                            action={activeTab === 'open' ? { label: "Create Request", onClick: () => router.push('/service-requests/new') } : undefined}
                        />
                    ) : (
                        filteredRequests.map((req) => {
                            const Icon = getIconForType(req.category)

                            let statusColor = "bg-gray-100 text-gray-600"
                            if (req.status === "In Progress") statusColor = "bg-blue-100 text-blue-700"
                            if (req.status === "Open") statusColor = "bg-orange-100 text-orange-700"
                            if (req.status === "Resolved") statusColor = "bg-green-100 text-green-700"

                            return (

                                <Link href={`/service-requests/${req.id}`} key={req.id} className="block bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 group-hover:bg-[#1a237e] group-hover:text-white transition-colors">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{req.category}</span>
                                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusColor)}>{req.status}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 mt-1 truncate">{req.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                                            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                                <span>{req.date}</span>
                                                <span>•</span>
                                                <span>ID: {req.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )

                        })
                    )}
                </div>
            </div>

            {/* FAB for Mobile */}
            <Link href="/service-requests/new" className="fixed bottom-24 right-4 h-14 w-14 bg-[#1a237e] rounded-full flex items-center justify-center text-white shadow-lg lg:hidden hover:scale-105 active:scale-95 transition-all">
                <Plus size={28} />
            </Link>
        </div>
    )
}
