"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Clock, MapPin, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, CommunityEventItem } from "@/lib/api"

export default function CommunityEventsPage() {
    const router = useRouter()
    const [events, setEvents] = useState<CommunityEventItem[]>([])
    const [hasHostedEvents, setHasHostedEvents] = useState(false)

    useEffect(() => {
        const loadEvents = async () => {
            const data = await api.getCommunityEvents()
            // Check if user has ANY events (including pending)
            const userHasEvents = data.some(e => e.creatorId === "U-123")
            setHasHostedEvents(userHasEvents)

            // Only show approved events (or events without status for legacy)
            const publicEvents = data.filter(e => !e.status || e.status === "approved")
            setEvents(publicEvents)
        }
        loadEvents()
    }, [])

    const handleRSVP = async (e: React.MouseEvent, event: CommunityEventItem) => {
        e.stopPropagation() // Prevent navigation to details
        const newStatus = event.rsvpStatus === "going" ? "not_going" : "going"

        try {
            const success = await api.rsvpEvent(event.id, newStatus)
            if (success) {
                setEvents(prevEvents => prevEvents.map(ev =>
                    ev.id === event.id
                        ? { ...ev, rsvpStatus: newStatus, participants: newStatus === "going" ? ev.participants + 1 : ev.participants - 1 }
                        : ev
                ))
            }
        } catch (error) {
            console.error("RSVP failed", error)
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-white px-6 py-6 rounded-b-[2rem] border-b border-gray-100 flex items-center justify-between shadow-sm z-20 sticky top-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => router.push("/community")}
                        className="p-2 -ml-2 mr-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1a237e] tracking-tight">Events</h1>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Upcoming activities & workshops</p>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => router.push(`/community/events/${event.id}`)}
                        className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
                    >
                        <div className={cn("h-32 w-full rounded-[1.25rem] bg-gradient-to-tr mb-3 relative overflow-hidden", event.imageGradient)}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-black text-xs font-bold shadow-sm">
                                <span className="text-[10px] uppercase text-gray-500 block">Guests</span>
                                {event.participants}
                            </div>
                            <button className="absolute bottom-3 right-3 bg-[#1a237e] text-white p-2 rounded-full shadow-lg transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                                <ChevronLeft className="h-4 w-4 rotate-180" />
                            </button>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{event.title}</h3>
                                {event.rsvpStatus === "going" && (
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                        Registered
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-[#1a237e]" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-[#1a237e]" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={(e) => handleRSVP(e, event)}
                                    className={cn(
                                        "flex-1 font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wide shadow-sm",
                                        event.rsvpStatus === "going"
                                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                                            : "bg-[#1a237e] text-white hover:bg-indigo-800"
                                    )}
                                >
                                    {event.rsvpStatus === "going" ? "Cancel RSVP" : "Register"}
                                </button>
                                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#1a237e] font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wide">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-xs">No upcoming events</div>
                )}

                {/* Spacing for bottom button */}
                <div className="h-16" />

                {/* My Hosted Events Button - Only if user has events */}
                {hasHostedEvents && (
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => router.push("/community/events/my")}
                            className="bg-white text-[#1a237e] px-6 py-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-100 hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 font-bold text-xs uppercase tracking-wide"
                        >
                            View My Hosted Events
                        </button>
                    </div>
                )}
            </div>

            {/* Create Event FAB */}
            <button
                onClick={() => router.push("/community/events/create")}
                className="fixed bottom-24 right-6 bg-[#1a237e] text-white p-4 rounded-full shadow-lg shadow-indigo-300 hover:bg-indigo-800 transition-transform hover:scale-105 active:scale-95 z-40 lg:bottom-10"
            >
                <Plus size={24} />
            </button>
        </div>
    )
}
