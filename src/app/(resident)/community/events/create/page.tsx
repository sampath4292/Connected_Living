"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, MapPin, AlignLeft, Image as ImageIcon, Users, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

export default function CreateEventPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        participants: "", // Used for capacity/target audience size
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Basic validation
        if (!formData.title || !formData.date || !formData.time || !formData.location) {
            alert("Please fill in all required fields")
            setLoading(false)
            return
        }

        try {
            await api.createCommunityEvent({
                title: formData.title,
                description: formData.description,
                time: `${formData.date} at ${formData.time}`, // Format for display
                location: formData.location,
                // In a real app we would store the capacity/limit separately or in meta. 
                // For now we just create the event.
            })

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            router.push("/community/events")
            // In a real app, we'd show a toast here saying "Event submitted for approval"
        } catch (error) {
            console.error("Failed to create event", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] pb-safe">
            {/* Header */}
            <div className="bg-white px-6 py-6 rounded-b-[2rem] border-b border-gray-100 flex items-center gap-1 shadow-sm z-20 sticky top-0">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 mr-2 hover:bg-gray-50 rounded-full text-gray-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-[#1a237e] tracking-tight">Create Event</h1>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Submit a new activity</p>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Event Title</label>
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] focus-within:ring-4 focus-within:ring-[#1a237e]/5 transition-all shadow-sm">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="E.g., Sunday Morning Yoga"
                                className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] focus-within:ring-4 focus-within:ring-[#1a237e]/5 transition-all shadow-sm flex items-start gap-3">
                            <AlignLeft className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the event..."
                                rows={4}
                                className="w-full text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date</label>
                            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] transition-all shadow-sm flex items-center gap-2">
                                <Calendar className="text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full text-sm font-semibold text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Time</label>
                            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] transition-all shadow-sm flex items-center gap-2">
                                <Clock className="text-gray-400" size={18} />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full text-sm font-semibold text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] transition-all shadow-sm flex items-center gap-3">
                            <MapPin className="text-gray-400" size={18} />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="E.g., Community Hall"
                                className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Participants Limit */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Audience Limit</label>
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-[#1a237e] transition-all shadow-sm flex items-center gap-3">
                            <Users className="text-gray-400" size={18} />
                            <input
                                type="number"
                                name="participants"
                                value={formData.participants}
                                onChange={handleChange}
                                placeholder="Max participants (optional)"
                                className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Image Placeholder */}
                    <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-100 transition-colors">
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-[#1a237e] shadow-sm mb-3">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-bold text-[#1a237e]">Add Event Image</p>
                        <p className="text-xs text-gray-500 mt-1">Tap to select a cover photo</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a237e] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Submitting...
                            </>
                        ) : (
                            "Submit for Approval"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
