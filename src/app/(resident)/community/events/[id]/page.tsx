"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, CommunityEventItem } from "@/lib/api"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [event, setEvent] = useState<CommunityEventItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadEvent = async () => {
            const id = parseInt(resolvedParams.id)
            if (isNaN(id)) return

            const data = await api.getCommunityEventById(id)
            if (data) {
                setEvent(data)
            }
            setLoading(false)
        }
        loadEvent()
    }, [resolvedParams.id])

    const handleRSVP = async (newStatus: "going" | "not_going") => {
        if (!event) return
        setLoading(true) // Using loading state for button feedback could be better as separate state but this works for simplicity/blocking

        try {
            const success = await api.rsvpEvent(event.id, newStatus)
            if (success) {
                setEvent(prev => prev ? ({
                    ...prev,
                    rsvpStatus: newStatus,
                    participants: newStatus === "going" ? prev.participants + 1 : prev.participants - 1
                }) : null)
            }
        } catch (error) {
            console.error("RSVP failed", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
        </div>
    )

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] gap-4">
            <p className="text-gray-500">Event not found</p>
            <button onClick={() => router.back()} className="text-[#1a237e] font-bold">Go Back</button>
        </div>
    )

    const isRegistered = event.rsvpStatus === "going"

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-white px-6 py-6 rounded-b-[2rem] border-b border-gray-100 flex items-center justify-between shadow-sm z-20 sticky top-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => router.push("/community/events")}
                        className="p-2 -ml-2 mr-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1a237e] tracking-tight">Event Details</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Hero Image */}
                <div className={cn("h-56 w-full rounded-[2rem] bg-gradient-to-tr relative shadow-md", event.imageGradient)}>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                        <div>
                            <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/20">
                                {event.organizer || "Community Event"}
                            </div>
                            <h2 className="text-2xl font-bold leading-tight drop-shadow-md">{event.title}</h2>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1a237e]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Date & Time</p>
                                <p className="text-sm font-bold text-gray-900">{event.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                            <p className="text-sm font-bold text-green-600">{event.price || "Free"}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                                <p className="text-sm font-bold text-gray-900">{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">About Event</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {event.description || "No description provided for this event."}
                    </p>
                </div>

                {/* Attendees & RSVP */}
                <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Attendees</p>
                        <div className="flex -space-x-2 mt-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                                    U{i}
                                </div>
                            ))}
                            <div className="h-8 w-8 rounded-full bg-[#1a237e] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                                +{event.participants}
                            </div>
                        </div>
                    </div>

                    {isRegistered ? (
                        <div className="flex items-center gap-2">
                            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-bold border border-green-200 cursor-default">
                                Registered
                            </div>
                            <button
                                onClick={() => handleRSVP("not_going")}
                                className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors font-medium text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleRSVP("going")}
                            className="bg-[#1a237e] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-800 transition-colors"
                        >
                            RSVP Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
