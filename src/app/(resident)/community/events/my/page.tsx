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
                    <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-500/20">
                        <CheckCircle2 size={12} />
                        Approved
                    </div>
                )
            case "rejected":
                return (
                    <div className="flex items-center gap-1 bg-destructive/10 text-destructive px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-destructive/20">
                        <XCircle size={12} />
                        Rejected
                    </div>
                )
            default: // pending
                return (
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-yellow-500/20">
                        <Clock3 size={12} />
                        Pending Approval
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background pb-safe transition-colors">
            {/* Header */}
            <div className="bg-card px-6 py-6 rounded-b-[2rem] border-b border-border flex items-center justify-between shadow-sm z-20 sticky top-0 transition-colors">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 mr-2 hover:bg-accent rounded-full text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-primary tracking-tight">My Hosted Events</h1>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Manage your requests</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : myEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="bg-card p-4 rounded-full shadow-sm mb-4 border border-border">
                            <Calendar className="text-muted-foreground h-10 w-10 opacity-50" />
                        </div>
                        <h3 className="text-foreground font-bold mb-1">No Events Yet</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-xs">You haven't hosted any events or submitted any requests yet.</p>
                        <button
                            onClick={() => router.push("/community/events/create")}
                            className="text-primary font-bold text-sm bg-primary/10 px-6 py-3 rounded-xl hover:bg-primary/20 transition-colors"
                        >
                            Create Your First Event
                        </button>
                    </div>
                ) : (
                    myEvents.map((event) => (
                        <div key={event.id} className="bg-card rounded-[1.5rem] p-4 shadow-sm border border-border relative overflow-hidden transition-colors">
                            {/* Status Banner */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Hosted by You
                                </div>
                                {getStatusBadge(event.status)}
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{event.title}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-muted-foreground text-xs font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                                    {event.time}
                                </div>
                                <div className="flex items-center text-muted-foreground text-xs font-medium">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-pink-400" />
                                    {event.location}
                                </div>
                            </div>

                            {/* Action Placeholder (e.g. Edit/Cancel) - could enable later */}
                            {event.status === 'pending' && (
                                <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                    <AlertCircle size={12} />
                                    Waiting for admin approval. You will be notified once reviewed.
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Create Event FAB */}
            <button
                onClick={() => router.push("/community/events/create")}
                className="fixed bottom-24 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 z-40 lg:bottom-10"
            >
                <Plus size={24} />
            </button>
        </div>
    )
}
