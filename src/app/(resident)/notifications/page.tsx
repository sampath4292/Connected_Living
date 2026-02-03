"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
// Import API
import { api, getIconForType, NotificationItem } from "@/lib/api"

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])

    useEffect(() => {
        // In a real app, this would be a URL fetch
        api.getNotifications().then(setNotifications)
    }, [])

    const getIconColor = (read: boolean) => {
        if (!read) return "text-[#1a237e]"
        return "text-gray-600"
    }

    const getIconBg = (read: boolean) => {
        if (!read) return "bg-[#1a237e]/10"
        return "bg-gray-100"
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-10 border-b border-gray-100 lg:border-none lg:p-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#1a237e] lg:text-2xl">Notifications</h1>
                </div>
                <button className="text-sm font-semibold text-[#1a237e] hover:text-blue-700">
                    Mark all read
                </button>
            </div>

            <div className="p-4 space-y-4 lg:p-6 lg:max-w-3xl">
                {notifications.map((notification) => {
                    // KEY CHANGE: Map string 'type' to actual Lucide Icon
                    const Icon = getIconForType(notification.type)

                    return (
                        <div
                            key={notification.id}
                            className={cn(
                                "p-4 rounded-xl flex gap-4 transition-colors",
                                notification.read
                                    ? "bg-white border border-gray-100"
                                    : "bg-blue-50/50 border border-blue-100 relative"
                            )}
                        >
                            {/* Icon */}
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                getIconBg(notification.read)
                            )}>
                                <Icon size={24} className={getIconColor(notification.read)} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className={cn(
                                        "font-semibold text-sm truncate pr-4",
                                        notification.read ? "text-gray-900" : "text-gray-900"
                                    )}>
                                        {notification.title}
                                    </h3>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-[#1a237e] flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                    {notification.description}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                    {notification.time}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
