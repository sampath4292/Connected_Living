"use client"

import { ArrowLeft, User, Truck, Car } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
// Note: Intentionally using lucide-react icons instead of custom SVGs for consistency and speed, as per current design system.
// Note: Assuming "Button" and "Input" from ui components are available.

export default function InviteVisitorPage() {
    const router = useRouter()
    const [visitorType, setVisitorType] = useState("guest")

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-4 lg:p-6 lg:border-none lg:bg-transparent">
                <div className="max-w-2xl mx-auto w-full flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#1a237e] lg:text-3xl">Invite Visitor</h1>
                </div>
            </div>

            <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full">
                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); router.push('/visitors') }}>

                    {/* Visitor Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Visitor Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            <TypeCard
                                id="guest"
                                icon={User}
                                label="Guest"
                                active={visitorType === "guest"}
                                onClick={() => setVisitorType("guest")}
                            />
                            <TypeCard
                                id="delivery"
                                icon={Truck}
                                label="Delivery"
                                active={visitorType === "delivery"}
                                onClick={() => setVisitorType("delivery")}
                            />
                            <TypeCard
                                id="cab"
                                icon={Car}
                                label="Cab"
                                active={visitorType === "cab"}
                                onClick={() => setVisitorType("cab")}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter visitor's name"
                                className="w-full h-14 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1a237e]/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mobile Number (Optional)</label>
                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                className="w-full h-14 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1a237e]/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
                                <input
                                    type="date"
                                    className="w-full h-14 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1a237e]/20 outline-none transition-all font-medium text-gray-900"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time</label>
                                <input
                                    type="time"
                                    className="w-full h-14 px-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1a237e]/20 outline-none transition-all font-medium text-gray-900"
                                    defaultValue="18:00"
                                />
                            </div>
                        </div>

                        {/* Single Entry Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-semibold text-gray-900">Single Entry Pass</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Code expires after one use</p>
                            </div>
                            <div className="h-6 w-11 bg-[#1a237e] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 lg:border-none lg:max-w-2xl lg:mx-auto lg:w-full">
                <button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
                >
                    Share Invite Code
                </button>
            </div>
        </div>
    )
}

function TypeCard({ id, icon: Icon, label, active, onClick }: { id: string, icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all duration-200",
                active
                    ? "border-[#1a237e] bg-[#1a237e]/5"
                    : "border-gray-100 bg-white hover:border-gray-200"
            )}
        >
            <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                active ? "bg-[#1a237e] text-white" : "bg-gray-100 text-gray-500"
            )}>
                <Icon size={20} />
            </div>
            <span className={cn(
                "text-xs font-bold",
                active ? "text-[#1a237e]" : "text-gray-500"
            )}>{label}</span>
        </button>
    )
}
