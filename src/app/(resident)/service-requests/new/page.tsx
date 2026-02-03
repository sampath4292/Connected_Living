"use client"

import { useState } from "react"
import { ArrowLeft, Upload, Camera, Zap, Waves, Hammer, Package, MessageSquare, CheckCircle2, Mic } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const CATEGORIES = [
    { id: "Electrician", icon: Zap, label: "Electrician", color: "text-yellow-600", bg: "bg-yellow-50" },
    { id: "Plumber", icon: Waves, label: "Plumber", color: "text-blue-600", bg: "bg-blue-50" },
    { id: "Carpenter", icon: Hammer, label: "Carpenter", color: "text-orange-600", bg: "bg-orange-50" },
    { id: "Appliance", icon: Package, label: "Appliance", color: "text-purple-600", bg: "bg-purple-50" },
    { id: "Others", icon: MessageSquare, label: "Others (AI)", color: "text-indigo-600", bg: "bg-indigo-50" },
]

export default function NewServiceRequestPage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [step, setStep] = useState(1)
    const [description, setDescription] = useState("")

    const handleCategorySelect = (id: string) => {
        setSelectedCategory(id)
        setStep(2)
    }

    const isOthers = selectedCategory === "Others"

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-4 lg:p-6">
                <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                    <button onClick={() => step === 1 ? router.back() : setStep(1)} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#1a237e]">{step === 1 ? "Select Category" : "Request Details"}</h1>
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-2xl mx-auto w-full pb-24">

                {step === 1 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className="flex flex-col items-center justify-center p-6 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#1a237e]/20 hover:bg-gray-50 transition-all gap-4 ring-offset-2 focus:ring-2 focus:ring-[#1a237e] outline-none group"
                            >
                                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300", cat.bg)}>
                                    <cat.icon size={32} className={cat.color} />
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-[#1a237e]">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        {/* Selected Category Banner */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="h-10 w-10 rounded-full bg-[#1a237e] flex items-center justify-center text-white">
                                {(() => {
                                    const CatIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon || MessageSquare
                                    return <CatIcon size={20} />
                                })()}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-bold uppercase">Category</p>
                                <p className="font-bold text-[#1a237e]">{CATEGORIES.find(c => c.id === selectedCategory)?.label}</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Change</button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {isOthers && (
                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-indigo-900 text-sm">
                                    <div className="p-2 bg-white rounded-full h-8 w-8 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                        <Zap size={14} fill="currentColor" />
                                    </div>
                                    <p>
                                        <strong>AI Assistant:</strong> Upload a photo or describe the issue. Our AI will automatically categorize and assign the right team.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <div className="relative">
                                    <textarea
                                        className="w-full h-32 p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1a237e]/20 text-sm outline-none resize-none"
                                        placeholder={isOthers ? "Describe what needs fixing... (e.g. 'Crack in living room wall')" : "Describe the issue..."}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    {isOthers && (
                                        <button className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#1a237e] transition-colors">
                                            <Mic size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isOthers ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Add Photo (Required for AI)</label>
                                    <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer group">
                                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <Camera size={24} className="text-indigo-600" />
                                        </div>
                                        <p className="text-sm font-bold text-indigo-900">Tap to Upgrade Photo</p>
                                        <p className="text-xs text-indigo-500 mt-1">or drag and drop here</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Preferred Time</label>
                                    <input type="datetime-local" className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1a237e]/20 text-sm outline-none" />
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    className="w-full h-14 bg-[#1a237e] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    onClick={() => router.push('/service-requests')}
                                >
                                    <span>{isOthers ? "Analyze & Submit" : "Submit Request"}</span>
                                    <CheckCircle2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
