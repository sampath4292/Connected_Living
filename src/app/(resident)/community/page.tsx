"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Calendar, Tag, Search, Send, Bell, ChevronLeft, MoreVertical, MapPin, Clock, User, Image as ImageIcon, Smile, Users, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { api, CommunityMessageItem, CommunityEventItem, NoticeItem } from "@/lib/api"

export default function CommunityPage() {
    // Views: landing (default), chat, notices, events
    const [currentView, setCurrentView] = useState<"landing" | "chat" | "notices" | "events">("landing")

    // Data States
    const [msgInput, setMsgInput] = useState("")
    const [messages, setMessages] = useState<CommunityMessageItem[]>([])
    const [notices, setNotices] = useState<NoticeItem[]>([])
    const [events, setEvents] = useState<CommunityEventItem[]>([])
    const [selectedEvent, setSelectedEvent] = useState<CommunityEventItem | null>(null)
    const [isLoadingEvent, setIsLoadingEvent] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const loadData = async () => {
            const [msgs, noteItems, eventItems] = await Promise.all([
                api.getCommunityMessages(),
                api.getNotices(),
                api.getCommunityEvents()
            ])
            setMessages(msgs)
            setNotices(noteItems)
            setEvents(eventItems)
        }
        loadData()
    }, [])

    useEffect(() => {
        if (currentView === "chat") {
            scrollToBottom()
        }
    }, [messages, currentView])

    const handleSend = async () => {
        if (!msgInput.trim()) return
        const newMsg = await api.sendCommunityMessage(msgInput)
        setMessages(prev => [...prev, newMsg])
        setMsgInput("")
    }

    const handleEventClick = async (id: number) => {
        setIsLoadingEvent(true)
        const eventDetails = await api.getCommunityEventById(id)
        if (eventDetails) {
            setSelectedEvent(eventDetails)
        }
        setIsLoadingEvent(false)
    }

    const handleBack = () => {
        if (selectedEvent) {
            setSelectedEvent(null)
            return
        }
        if (currentView !== "landing") {
            setCurrentView("landing")
            return
        }
    }

    // Helper to determine if we are in a 'sub-page'
    const isSubPage = currentView !== "landing"

    return (
        <div className={cn(
            "fixed inset-0 bottom-20 z-0 lg:static lg:z-auto lg:h-[calc(100vh-2rem)] flex flex-col bg-[#f8f9fa]",
            // Only fix the chat input at bottom if we are in chat mode
            currentView === "chat" ? "bottom-20" : ""
        )}>
            {/* Premium Header */}
            <div className="bg-white px-6 pt-6 pb-6 rounded-b-[2rem] border-b border-gray-100 flex flex-col gap-4 shadow-sm z-20">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        {/* Back Button Logic - Only for internal navigation */}
                        {(isSubPage || selectedEvent) && (
                            <button onClick={handleBack} className="p-2 -ml-2 mr-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                        )}

                        <div>
                            <h1 className="text-2xl font-extrabold text-[#1a237e] tracking-tight">
                                {selectedEvent ? "Event Details" :
                                    currentView === "landing" ? "Community Hub" :
                                        currentView === "chat" ? "General Chat" :
                                            currentView === "notices" ? "Announcements" : "Events"}
                            </h1>
                            {!selectedEvent && (
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <p className="text-xs text-gray-500 font-medium">Building A • 45 Online</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {currentView === "landing" && (
                        <div className="h-10 w-10 bg-[#1a237e]/5 rounded-2xl flex items-center justify-center text-[#1a237e]">
                            <Users size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative w-full">

                {/* --- LANDING MENU VIEW --- */}
                {currentView === "landing" && (
                    <div className="h-full overflow-y-auto p-4 space-y-4 animate-in slide-in-from-left duration-300">
                        {/* General Chat Card */}
                        <button
                            onClick={() => setCurrentView("chat")}
                            className="w-full bg-white py-10 px-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all group"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-300">
                                <MessageSquare size={28} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1a237e] transition-colors">General Chat</h3>
                                <p className="text-xs text-gray-500 mt-1">Join the conversation with neighbors</p>
                            </div>
                            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                3 New
                            </div>
                        </button>

                        {/* Announcements Card */}
                        <button
                            onClick={() => setCurrentView("notices")}
                            className="w-full bg-white py-10 px-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all group"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                <Megaphone size={28} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Announcements</h3>
                                <p className="text-xs text-gray-500 mt-1">Important updates & notices</p>
                            </div>
                            {notices.some(n => n.type === 'Emergency') && (
                                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {/* Events Card */}
                        <button
                            onClick={() => setCurrentView("events")}
                            className="w-full bg-white py-10 px-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all group"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                                <Calendar size={28} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-700 transition-colors">Events</h3>
                                <p className="text-xs text-gray-500 mt-1">Upcoming activities & workshops</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* --- CHAT VIEW --- */}
                {currentView === "chat" && (
                    <div className="absolute inset-0 flex flex-col bg-[#f8f9fa] animate-in slide-in-from-right duration-300">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <div className="flex justify-center">
                                <span className="text-[10px] bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-medium">Today</span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.role === "me"
                                return (
                                    <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                                        <div className={cn("h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold", msg.color)}>
                                            {msg.avatar}
                                        </div>
                                        <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                            <div className="flex items-baseline gap-2 mb-1 px-1">
                                                <span className="text-[10px] font-bold text-gray-600">{msg.sender}</span>
                                                <span className="text-[10px] text-gray-400">{msg.time}</span>
                                            </div>
                                            <div className={cn(
                                                "px-4 py-3 rounded-2xl text-sm shadow-sm",
                                                isMe
                                                    ? "bg-[#1a237e] text-white rounded-tr-sm"
                                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                                            )}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 pb-8 lg:pb-4">
                            <button className="text-gray-400 hover:text-[#1a237e] transition-colors p-2 rounded-full hover:bg-gray-50">
                                <PlusIcon size={20} />
                            </button>
                            <div className="flex-1 bg-gray-50 rounded-2xl flex items-center px-4 border border-transparent focus-within:border-[#1a237e]/30 focus-within:bg-white transition-all">
                                <input
                                    type="text"
                                    value={msgInput}
                                    onChange={(e) => setMsgInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent py-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                                />
                                <button className="text-gray-400 hover:text-[#1a237e]">
                                    <Smile size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleSend}
                                className={cn(
                                    "h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95",
                                    msgInput.trim() ? "bg-[#1a237e] text-white hover:bg-indigo-800" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                <Send size={18} className={msgInput.trim() ? "ml-1" : ""} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- NOTICES VIEW --- */}
                {currentView === "notices" && (
                    <div className="h-full overflow-y-auto p-4 space-y-4 animate-in slide-in-from-right duration-300">
                        {notices.map((notice) => (
                            <div key={notice.id} className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                {notice.type === "Emergency" && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                        IMPORTANT
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", notice.type === "Emergency" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500")}>
                                        <Bell size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{notice.type}</p>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">{notice.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">{notice.content}</p>
                                <p className="text-[10px] font-bold text-gray-400">{notice.date}</p>
                            </div>
                        ))}
                        {notices.length === 0 && (
                            <div className="text-center py-10 text-gray-400 text-xs">No notices found</div>
                        )}
                    </div>
                )}

                {/* --- EVENTS VIEW --- */}
                {currentView === "events" && !selectedEvent && (
                    <div className="h-full overflow-y-auto p-4 space-y-4 animate-in slide-in-from-right duration-300">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => handleEventClick(event.id)}
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
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
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
                                    <button className="w-full mt-3 bg-gray-50 hover:bg-gray-100 text-[#1a237e] font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wide">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <div className="text-center py-10 text-gray-400 text-xs">No upcoming events</div>
                        )}
                    </div>
                )}

                {/* --- EVENT DETAILS VIEW --- */}
                {selectedEvent && (
                    <div className="absolute inset-0 bg-[#f8f9fa] z-40 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
                        {/* Note: Header is handled above with 'Event Details' title and back button logic */}
                        <div className="p-4 space-y-5">
                            {/* Hero Image */}
                            <div className={cn("h-56 w-full rounded-[2rem] bg-gradient-to-tr relative shadow-md", selectedEvent.imageGradient)}>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                                    <div>
                                        <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/20">
                                            {selectedEvent.organizer || "Community Event"}
                                        </div>
                                        <h2 className="text-2xl font-bold leading-tight drop-shadow-md">{selectedEvent.title}</h2>
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
                                            <p className="text-sm font-bold text-gray-900">{selectedEvent.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                                        <p className="text-sm font-bold text-green-600">{selectedEvent.price || "Free"}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">About Event</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {selectedEvent.description || "No description provided for this event."}
                                </p>
                            </div>

                            {/* Attendees */}
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
                                            +{selectedEvent.participants}
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-[#1a237e] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-800 transition-colors">
                                    RSVP Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function PlusIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    )
}
