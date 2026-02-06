"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, QrCode, AlertTriangle, Share2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, getIconForType, BookingItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [booking, setBooking] = useState<BookingItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getBookingById(id).then(data => {
            setBooking(data || null)
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-24 p-6 flex flex-col items-center justify-center">
                <Skeleton className="h-96 w-full max-w-sm rounded-[2rem]" />
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Booking Not Found</h2>
                <button onClick={() => router.back()} className="mt-6 text-[#1a237e] font-bold hover:underline">
                    Go Back
                </button>
            </div>
        )
    }

    // Get icon based on amenity ID/Type mapping logic
    const iconType = booking.amenityId as any
    const Icon = getIconForType(iconType) || Calendar

    return (
        <div className="min-h-screen bg-[#1a237e] pb-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 lg:p-6">
                <div className="flex items-center gap-3 max-w-md mx-auto w-full text-white mb-6">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Booking Ticket</h1>
                </div>

                {/* Ticket Card */}
                <div className="max-w-md mx-auto w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl">
                    {/* Top Section */}
                    <div className="p-8 pb-10 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#1a237e]">
                                <Icon size={32} />
                            </div>
                            <span className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border",
                                booking.status === "Confirmed" ? "bg-green-50 text-green-700 border-green-100" :
                                    booking.status === "Pending" ? "bg-orange-50 text-orange-700 border-orange-100" :
                                        booking.status === "Completed" ? "bg-gray-50 text-gray-600 border-gray-100" :
                                            "bg-red-50 text-red-700 border-red-100"
                            )}>
                                {booking.status}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{booking.amenityName}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin size={16} />
                            <span>Community Center, Block A</span>
                        </div>

                        {/* Divider with circles */}
                        <div className="absolute left-0 bottom-0 w-full h-8 translate-y-1/2 flex items-center justify-between px-[-1rem]">
                            <div className="w-8 h-8 rounded-full bg-[#1a237e] -ml-4" />
                            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-4" />
                            <div className="w-8 h-8 rounded-full bg-[#1a237e] -mr-4" />
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="bg-gray-50 p-8 pt-10 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                <div className="flex items-center gap-2 font-bold text-gray-900">
                                    <Calendar size={18} className="text-[#1a237e]" />
                                    <span>{booking.date}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                                <div className="flex items-center gap-2 font-bold text-gray-900">
                                    <Clock size={18} className="text-[#1a237e]" />
                                    <span>{booking.slots[0].split(' ')[0]}</span>
                                    <span className="text-gray-400 text-xs font-normal">Onwards</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Slots</p>
                            <div className="flex flex-wrap gap-2">
                                {booking.slots.map(slot => (
                                    <span key={slot} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                                        {slot}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {booking.status === "Confirmed" && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center gap-4 shadow-sm">
                                <div className="pointer-events-none">
                                    <QrCode size={120} className="text-gray-900" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booking ID</p>
                                    <p className="font-mono text-lg font-bold text-[#1a237e] tracking-wider">{booking.id}</p>
                                </div>
                                <p className="text-xs text-center text-gray-400 max-w-[200px]">
                                    Scan this code at the facility entrance for access.
                                </p>
                            </div>
                        )}

                        {booking.status === "Pending" && (
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center gap-4 text-center">
                                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                    <Clock size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Awaiting Approval</h3>
                                    <p className="text-sm text-gray-500 mt-1">Your booking request is being reviewed by the admin.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            {/* Only show Share button if NOT Cancelled */}
                            {booking.status !== "Cancelled" && (
                                <button className="flex-1 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                            )}
                            {(booking.status === "Confirmed" || booking.status === "Pending") && (
                                <button
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to cancel this booking?")) {
                                            await api.cancelBooking(booking.id)
                                            setBooking(prev => prev ? { ...prev, status: "Cancelled" } : null)
                                        }
                                    }}
                                    className="flex-1 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-red-100 transition-colors"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
