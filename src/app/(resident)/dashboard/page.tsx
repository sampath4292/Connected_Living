"use client"

import { useEffect, useState } from "react"
import { Users, Wrench, Receipt, Dumbbell } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
// Import API and Types
import { api, getIconForType, ActivityItem } from "@/lib/api"

export default function ResidentDashboard() {
    const [activityLog, setActivityLog] = useState<ActivityItem[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activities, count] = await Promise.all([
                    api.getActivities(),
                    api.getUnreadCount()
                ])
                setActivityLog(activities)
                setUnreadCount(count)
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

        // Poll for unread count every 5 seconds to keep it in sync with "live" notifications
        const interval = setInterval(async () => {
            const count = await api.getUnreadCount()
            setUnreadCount(count)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-white lg:bg-transparent pb-24 lg:pb-0">
            {/* Header Section */}
            <div className="p-6 pt-8 lg:p-8">
                <div className="flex justify-between items-center mb-6 lg:mb-8">
                    <div className="lg:hidden">
                        <h1 className="text-2xl font-bold text-[#1a237e]">Connected Living</h1>
                    </div>
                    <div className="hidden lg:block">
                        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                        <p className="text-gray-500 mt-1">Welcome back to your connected home</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/notifications" className="relative group">
                            {/* Notification Bell */}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-in zoom-in">{unreadCount}</span>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a237e] lg:text-gray-600 group-hover:text-[#1a237e] transition-colors"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </Link>

                        {/* Avatar Placeholder */}
                        <Link href="/profile" className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1a237e] hover:bg-blue-200 transition-colors">
                            <Users size={18} />
                        </Link>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Column (Main) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Welcome Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-lg lg:p-10 lg:rounded-[2rem]">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl lg:text-4xl font-bold mb-2">Welcome Home!</h2>
                                    <p className="opacity-90 text-sm lg:text-xl font-medium">Flat A-101, Tower 1</p>
                                </div>
                                <div className="h-12 w-12 lg:h-20 lg:w-20 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    {/* Building Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lg:w-10 lg:h-10"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
                                </div>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-[#1a237e] font-bold text-lg mb-4 lg:text-xl lg:mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-4 gap-4 px-2 lg:px-0 lg:gap-6">
                                <QuickAction icon={Users} label="Visitors" href="/visitors" />
                                <QuickAction icon={Dumbbell} label="Amenities" href="/amenities" />
                                <QuickAction icon={Receipt} label="Pay Bills" href="/payments" />
                                <QuickAction icon={Wrench} label="Complaints" href="/service-requests" />
                            </div>
                        </div>

                        {/* Desktop Extra Section */}
                        <div className="hidden lg:block mt-8">
                            <h3 className="text-[#1a237e] font-bold text-xl mb-6">Hub Highlights</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex flex-col justify-between h-48 hover:shadow-md transition-shadow cursor-pointer group">
                                    <div>
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Event</span>
                                        <h4 className="font-bold text-lg text-orange-900 mt-3 group-hover:text-orange-700">Diwali Celebration</h4>
                                        <p className="text-sm text-orange-800 mt-1">Join us for the grand celebration at the Club House.</p>
                                    </div>
                                    <div className="text-orange-600 font-medium text-sm">Oct 24, 6:00 PM</div>
                                </div>
                                <div className="bg-purple-50 border border-purple-100 p-6 rounded-3xl flex flex-col justify-between h-48 hover:shadow-md transition-shadow cursor-pointer group">
                                    <div>
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Notice</span>
                                        <h4 className="font-bold text-lg text-purple-900 mt-3 group-hover:text-purple-700">Pool Maintenance</h4>
                                        <p className="text-sm text-purple-800 mt-1">Swimming pool will be closed for maintenance.</p>
                                    </div>
                                    <div className="text-purple-600 font-medium text-sm">Tomorrow</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Side Widgets) */}
                    <div className="mt-8 lg:mt-0 lg:col-span-4 space-y-8">
                        <div>
                            <h3 className="text-[#1a237e] font-bold text-lg mb-4 lg:text-xl lg:mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <p className="text-sm text-gray-400">Loading activity...</p>
                                ) : (
                                    activityLog.map((item) => {
                                        const Icon = getIconForType(item.iconType)
                                        return (
                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow cursor-default group">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors", item.bg, item.iconColor, "group-hover:scale-105")}>
                                                        <Icon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 group-hover:text-[#1a237e] transition-colors">{item.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">{item.time}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Extra Widget for Desktop */}
                        <div className="hidden lg:block p-6 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                            <h3 className="font-bold text-indigo-900 mb-2 relative z-10">Did you know?</h3>
                            <p className="text-sm text-indigo-700 relative z-10">You can now book the tennis court 3 days in advance!</p>
                            <Link href="/amenities" className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800 relative z-10">
                                Book Now &rarr;
                            </Link>
                            <div className="absolute -bottom-4 -right-4 text-indigo-200 opacity-50">
                                <Dumbbell size={80} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickAction({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-[1.25rem] lg:rounded-[1.75rem] bg-gradient-to-b from-blue-600 to-indigo-700 flex items-center justify-center shadow-md text-white transition-transform group-hover:scale-105 group-hover:shadow-lg">
                <Icon size={28} className="lg:w-10 lg:h-10" />
            </div>
            <span className="text-xs lg:text-sm font-medium text-gray-600 group-hover:text-[#1a237e] transition-colors">{label}</span>
        </Link>
    )
}
