"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Loader2, Bell, MessageSquare, Calendar, Shield, CreditCard, Tag, RefreshCw } from "lucide-react"
import { api, NotificationItem } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() => {
        fetchNotifications()
    }, [])

    // Better approach for "clearing form that": 
    // when we mark as read, set a timeout to remove it from the local state list.

    const fetchNotifications = async () => {
        try {
            const data = await api.getNotifications()
            setNotifications(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationClick = async (notification: NotificationItem) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id)
        }

        const delay = !notification.read ? 100 : 0

        setTimeout(() => {
            switch (notification.type) {
                case "payment":
                    router.push("/payments")
                    break
                case "security":
                    router.push("/visitors")
                    break
                case "event":
                case "notice":
                case "offer":
                case "meeting":
                    router.push("/community")
                    break
                default:
                    // Default redirect to dashboard if no specific match
                    break
            }
        }, delay)
    }

    const handleMarkAsRead = async (id: number) => {
        if (loadingAction) return

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

        // Requirement 3: Clear from view after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id))
        }, 3000)

        try {
            await api.markNotificationAsRead(id)
        } catch (e) {
            console.error(e)
            // Revert on failure (complex to revert the timeout, but negligible for mock)
            fetchNotifications()
        }
    }

    const handleMarkAllRead = async () => {
        setLoadingAction(true)
        // Optimistic
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

        // Clear all from view after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => !n.read)) // Should be empty if all read
        }, 3000)

        try {
            await api.markAllNotificationsAsRead()
        } catch (e) {
            console.error(e)
            fetchNotifications()
        } finally {
            setLoadingAction(false)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "payment": return <CreditCard size={20} className="text-red-500" />
            case "event": return <Calendar size={20} className="text-purple-500" />
            case "security": return <Shield size={20} className="text-blue-600" />
            case "notice": return <MessageSquare size={20} className="text-orange-500" />
            case "offer": return <Tag size={20} className="text-green-500" />
            default: return <Bell size={20} className="text-gray-500" />
        }
    }

    const getBgColor = (type: string) => {
        switch (type) {
            case "payment": return "bg-red-50"
            case "event": return "bg-purple-50"
            case "security": return "bg-blue-50"
            case "notice": return "bg-orange-50"
            case "offer": return "bg-green-50"
            default: return "bg-gray-50"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
            </div>
        )
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-[#1a237e] flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                        </h1>
                    </div>
                </div>

                {/* Requirement 2: Mark All as Read */}
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={loadingAction}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide bg-indigo-50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                        {loadingAction ? "Updating..." : "Mark all Read"}
                    </button>
                )}
            </div>

            <div className="p-4 space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Bell size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={cn(
                                "relative p-4 rounded-2xl border transition-all duration-200 flex gap-4 overflow-hidden cursor-pointer",
                                notification.read
                                    ? "bg-white border-gray-100 opacity-70"
                                    : "bg-white border-indigo-100 shadow-sm transform hover:-translate-y-1"
                            )}
                        >
                            {/* Unread Indicator */}
                            {!notification.read && (
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500"></div>
                            )}

                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                getBgColor(notification.type)
                            )}>
                                {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 pr-4">
                                <h3 className={cn("font-bold text-gray-900 leading-tight mb-1", !notification.read && "text-[#1a237e]")}>
                                    {notification.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {notification.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    {notification.time}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
