"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, XCircle, Clock3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, CommunityEventItem } from "@/lib/api"

export default function MyHostedEventsPage() {
    const router = useRouter()
    const [myEvents, setMyEvents] = useState<CommunityEventItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadMyEvents = async () => {
            try {
                // In a real app key off user ID. For mock, we filter or just use all for demo if we haven't set creatorId on all.
                // Let's filter by the mock creatorId "U-123" which we use for created events.
                const allEvents = await api.getCommunityEvents()
                const userEvents = allEvents.filter(e => e.creatorId === "U-123")
                setMyEvents(userEvents)
            } catch (error) {
                console.error("Failed to load my events", error)
            } finally {
                setLoading(false)
            }
        }
        loadMyEvents()
    }, [])

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "approved":
                return (
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-100">
                        <CheckCircle2 size={12} />
                        Approved
                    </div>
                )
            case "rejected":
                return (
                    <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-red-100">
                        <XCircle size={12} />
                        Rejected
                    </div>
                )
            default: // pending
                return (
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-yellow-100">
                        <Clock3 size={12} />
                        Pending Approval
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] pb-safe">
            {/* Header */}
            <div className="bg-white px-6 py-6 rounded-b-[2rem] border-b border-gray-100 flex items-center justify-between shadow-sm z-20 sticky top-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 mr-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1a237e] tracking-tight">My Hosted Events</h1>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Manage your requests</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/community/events/create")}
                    className="bg-[#1a237e] text-white p-2.5 rounded-xl shadow-md hover:bg-indigo-800 transition-colors flex items-center gap-2 pr-4 pl-3"
                >
                    <Plus size={18} />
                    <span className="text-xs font-bold">New Event</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a237e]"></div>
                    </div>
                ) : myEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Calendar className="text-gray-300 h-10 w-10" />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">No Events Yet</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">You haven't hosted any events or submitted any requests yet.</p>
                        <button
                            onClick={() => router.push("/community/events/create")}
                            className="text-[#1a237e] font-bold text-sm bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Create Your First Event
                        </button>
                    </div>
                ) : (
                    myEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                            {/* Status Banner */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-indigo-50 text-[#1a237e] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Hosted by You
                                </div>
                                {getStatusBadge(event.status)}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-500 text-xs font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                                    {event.time}
                                </div>
                                <div className="flex items-center text-gray-500 text-xs font-medium">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-pink-400" />
                                    {event.location}
                                </div>
                            </div>

                            {/* Action Placeholder (e.g. Edit/Cancel) - could enable later */}
                            {event.status === 'pending' && (
                                <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                                    <AlertCircle size={12} />
                                    Waiting for admin approval. You will be notified once reviewed.
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
