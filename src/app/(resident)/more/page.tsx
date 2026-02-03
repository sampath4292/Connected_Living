"use client"

import { useState } from "react"
import {
    Moon, Sun, Monitor, Users, Car, ChevronRight,
    Bell, Shield, Phone, FileText, ChevronLeft, Settings
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function MorePage() {
    // View State
    const [currentView, setCurrentView] = useState<"main" | "appearance">("main")

    // Theme State
    const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

    // Notification States (Default all true)
    const [notifications, setNotifications] = useState({
        communityChat: true,
        announcements: true,
        events: true,
        amenities: true,
        payments: true
    })

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleBack = () => {
        if (currentView !== "main") {
            setCurrentView("main")
        } else {
            // Default back behavior handled by existing Link
        }
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-24 lg:pb-8">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-6 rounded-b-[2rem] border-b border-gray-100 flex flex-col gap-4 shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {currentView !== "main" && (
                            <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                        )}

                        <h1 className="text-3xl font-extrabold text-[#1a237e] tracking-tight">
                            {currentView === "appearance" ? "Appearance" : "Settings"}
                        </h1>
                    </div>
                    {currentView === "main" && (
                        <div className="h-10 w-10 bg-[#1a237e]/5 rounded-2xl flex items-center justify-center text-[#1a237e]">
                            <Settings size={20} />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-8 max-w-3xl mx-auto">

                {currentView === "main" ? (
                    <>
                        {/* --- GENERAL SECTION --- */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">General</h2>

                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
                                {/* Appearance Link */}
                                <button
                                    onClick={() => setCurrentView("appearance")}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Sun size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Appearance</h3>
                                            <p className="text-xs text-gray-500">Light, Dark, System</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-400 capitalize">{theme}</span>
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </div>
                                </button>

                                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Users size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Manage Family Members</h3>
                                            <p className="text-xs text-gray-500">Add or remove residents</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Car size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Manage Vehicles</h3>
                                            <p className="text-xs text-gray-500">Update vehicle details</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </button>
                            </div>
                        </section>


                        {/* --- NOTIFICATION PREFERENCES --- */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Notification Preferences</h2>
                            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 divide-y divide-gray-50">
                                {[
                                    { id: 'communityChat', label: 'Community Chat', icon: Bell, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { id: 'announcements', label: 'Announcements', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
                                    { id: 'events', label: 'Events', icon: FileText, color: 'text-pink-600', bg: 'bg-pink-50' },
                                    { id: 'amenities', label: 'Amenities Suggestions', icon: Monitor, color: 'text-green-600', bg: 'bg-green-50' },
                                    { id: 'payments', label: 'Payment Notifications', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            {/* <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", item.bg, item.color)}>
                                                <item.icon size={16} />
                                            </div> */}
                                            <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-colors relative",
                                                notifications[item.id as keyof typeof notifications] ? "bg-[#1a237e]" : "bg-gray-200"
                                            )}
                                        >
                                            <span className={cn(
                                                "absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform shadow-sm",
                                                notifications[item.id as keyof typeof notifications] ? "translate-x-5" : ""
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- EMERGENCY CONTACT --- */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Emergency Contacts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Security</h3>
                                            <p className="text-xs text-gray-500 font-mono">+91 98765 43210</p>
                                        </div>
                                    </div>
                                    <button className="h-9 w-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                        <Phone size={18} />
                                    </button>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Facility Manager</h3>
                                            <p className="text-xs text-gray-500 font-mono">+91 12345 67890</p>
                                        </div>
                                    </div>
                                    <button className="h-9 w-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                        <Phone size={18} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* --- LEGAL DOCS --- */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Legal</h2>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Community Guidelines</h3>
                                            <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Terms of Service</h3>
                                            <p className="text-xs text-gray-500">Legal Agreement</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Privacy Policy</h3>
                                            <p className="text-xs text-gray-500">Data usage & rights</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </button>
                            </div>
                        </section>

                        <div className="text-center pt-8 pb-4">
                            <p className="text-xs text-gray-400 font-medium">Connected Living App • v1.0.2</p>
                        </div>
                    </>
                ) : (
                    // --- APPEARANCE SUB-VIEW ---
                    <div className="animate-in slide-in-from-right duration-300">
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Choose a Theme</h2>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
                                {/* Light Mode */}
                                <button
                                    onClick={() => setTheme("light")}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                            <Sun size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900">Light Mode</span>
                                    </div>
                                    {theme === "light" && (
                                        <div className="h-6 w-6 rounded-full bg-[#1a237e] flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    )}
                                </button>

                                {/* Dark Mode */}
                                <button
                                    onClick={() => setTheme("dark")}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                            <Moon size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900">Dark Mode</span>
                                    </div>
                                    {theme === "dark" && (
                                        <div className="h-6 w-6 rounded-full bg-[#1a237e] flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    )}
                                </button>

                                {/* System Default */}
                                <button
                                    onClick={() => setTheme("system")}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <Monitor size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900">System Default</span>
                                    </div>
                                    {theme === "system" && (
                                        <div className="h-6 w-6 rounded-full bg-[#1a237e] flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
