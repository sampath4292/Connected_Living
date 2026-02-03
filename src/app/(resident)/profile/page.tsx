"use client"

import {
    ArrowLeft,
    Edit2,
    Phone,
    Mail,
    Home,
    Calendar,
    Users,
    Car,
    fileText, // using generic if Receipt not available
    Receipt,
    Lock,
    Settings,
    HelpCircle,
    LogOut,
    ChevronRight,
    Camera
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
    const router = useRouter()

    const user = {
        name: "Vikram",
        unit: "Flat A-101 • Tower 1",
        phone: "+91 98765 43210",
        email: "vikram@email.com ",
        memberSince: "Jan 2024",
        avatar: null
    }

    const menuItems = [
        { icon: Users, label: "Family Members", sub: "Manage family members", href: "/family" },
        { icon: Car, label: "My Vehicles", sub: "Manage registered vehicles", href: "/vehicles" },
        { icon: Receipt, label: "Payment History", sub: "View all transactions", href: "/payments" },
        { icon: Lock, label: "Change Password", sub: "Update your password", href: "/change-password" },
        { icon: Settings, label: "Settings", sub: "App preferences", href: "/settings" },
        { icon: HelpCircle, label: "Help & Support", sub: "Get help", href: "/support" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e]">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-[#1a237e]">Profile</h1>
                <button className="p-2 -mr-2 text-[#1a237e]">
                    <Edit2 size={24} />
                </button>
            </div>

            <div className="p-6">
                {/* Profile Card */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="h-28 w-28 rounded-full bg-indigo-100 border-4 border-white shadow-sm flex items-center justify-center text-[#1a237e]">
                            {/* Avatar */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 opacity-80">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#1a237e] p-2 rounded-full border-2 border-white text-white">
                            <Camera size={16} />
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-[#1a237e]">{user.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{user.unit}</p>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <InfoRow icon={Phone} label="Phone" value={user.phone} />
                    <div className="h-[1px] bg-gray-100 mx-14"></div>
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <div className="h-[1px] bg-gray-100 mx-14"></div>
                    <InfoRow icon={Home} label="Flat" value={user.unit.replace("Flat ", "").replace(" • Tower 1", ", Tower 1")} />
                    <div className="h-[1px] bg-gray-100 mx-14"></div>
                    <InfoRow icon={Calendar} label="Member Since" value={user.memberSince} />
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.href}>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-[#1a237e] flex items-center justify-center">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 leading-tight">{item.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-300" />
                            </div>
                        </Link>
                    ))}

                    {/* Logout */}
                    <button className="w-full bg-red-50 p-4 rounded-2xl flex items-center justify-between group hover:bg-red-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200">
                                <LogOut size={24} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-red-600 leading-tight">Logout</p>
                                <p className="text-xs text-red-400 mt-1">Sign out of your account</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-red-300" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-[#1a237e] flex items-center justify-center flex-shrink-0">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    )
}
