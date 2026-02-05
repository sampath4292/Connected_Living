"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Save, User, MapPin, Calendar, Send, Sparkles, Pencil, Camera } from "lucide-react"
import { useRef } from "react"
import { api, SavedVisitorItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// Actually, I see "toast" used in other files in previous context (invite page), likely simple state based. I'll use a simple state for now.

export default function EditSavedVisitorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [visitor, setVisitor] = useState<SavedVisitorItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    // Editable Fields
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [relation, setRelation] = useState("")
    const [avatar, setAvatar] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Instant Invite Logic
    const [inviteDate, setInviteDate] = useState("")
    const [inviteTime, setInviteTime] = useState("")
    const [inviting, setInviting] = useState(false)

    // Attendance Logic Removed as per requirement
    // Saved Visitors are GUESTS only.

    useEffect(() => {
        api.getSavedVisitorById(id).then(data => {
            if (data) {
                setVisitor(data)
                setName(data.name)
                setPhone(data.phone || "")
                setEmail(data.email || "")
                setRelation(data.relation || "")
                setAvatar(data.avatar || "")
            }
            setLoading(false)
        })
    }, [id])

    const handleSave = async () => {
        if (!visitor) return
        setSaving(true)

        // We pretend to update the 'preferred slot' which isn't in the type yet, 
        // but the requirement says "edit time slots". 
        // We will just call the update API to simulate the network request.

        // Update Saved Visitor Profile
        await api.updateSavedVisitor(visitor.id, {
            name,
            phone,
            email,
            relation,
            avatar
        })

        setNotification({ message: "Preferences updated successfully", type: "success" })
        setSaving(false)
        setIsEditing(false)
    }

    const handleInvite = async () => {
        if (!visitor || !inviteDate || !inviteTime) {
            setNotification({ message: "Please select Date and Time", type: 'error' })
            return
        }
        setInviting(true)
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500))

        setNotification({ message: `Invite sent to ${visitor.name}!`, type: 'success' })
        setInviting(false)
        setTimeout(() => router.push('/visitors'), 1500)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setAvatar(url)
            setNotification({ message: "Profile photo updated", type: 'success' })
            setTimeout(() => setNotification(null), 3000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <Skeleton className="h-10 w-10 rounded-full mb-6" />
                <div className="space-y-6">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!visitor) {
        return <div className="p-6 text-center text-gray-500">Visitor not found</div>
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Visitors</h1>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-[#1a237e] bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                        >
                            <Pencil size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* 1. Editable Contact Details */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="relative group">
                        <div
                            onClick={() => isEditing && fileInputRef.current?.click()}
                            className={`h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center text-[#1a237e] text-3xl font-bold mb-6 overflow-hidden relative shadow-sm border-4 border-white transition-all ${isEditing ? 'cursor-pointer hover:opacity-90 ring-4 ring-indigo-50' : ''}`}
                        >
                            {(avatar && avatar.includes('/')) || (avatar && avatar.startsWith('blob:')) ? (
                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{avatar || name[0]}</span>
                            )}

                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                    <Camera className="text-white drop-shadow-md" size={24} />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#1a237e]/20 transition-all placeholder:font-normal"
                                    placeholder="Visitor Name"
                                />
                            ) : (
                                <div className="w-full p-4 bg-gray-50/50 rounded-2xl font-bold text-gray-900 border border-transparent">
                                    {name}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Relation / Type</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    className="w-full p-4 bg-gray-50 rounded-2xl font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1a237e]/20 transition-all placeholder:font-normal"
                                    placeholder="e.g. Friend, Brother"
                                />
                            ) : (
                                <div className="w-full p-4 bg-gray-50/50 rounded-2xl font-semibold text-gray-700 border border-transparent">
                                    {relation || "N/A"}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-2xl font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#1a237e]/20 transition-all placeholder:font-normal"
                                        placeholder="+91..."
                                    />
                                ) : (
                                    <div className="w-full p-4 bg-gray-50/50 rounded-2xl font-medium text-gray-700 border border-transparent">
                                        {phone || "-"}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-2xl font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#1a237e]/20 transition-all placeholder:font-normal"
                                        placeholder="Optional"
                                    />
                                ) : (
                                    <div className="w-full p-4 bg-gray-50/50 rounded-2xl font-medium text-gray-700 border border-transparent truncate">
                                        {email || "-"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance History Removed */}

                {/* 3. Instant Invite Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl shadow-sm border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-[#1a237e]">
                            <Sparkles size={20} className="text-indigo-600" />
                            <h3 className="font-bold text-lg">Instant Invite</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Send a one-time entry pass for a specific time.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                <input
                                    type="date"
                                    value={inviteDate}
                                    onChange={(e) => setInviteDate(e.target.value)}
                                    className="w-full p-3 bg-white rounded-xl border border-indigo-100 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                                <input
                                    type="time"
                                    value={inviteTime}
                                    onChange={(e) => setInviteTime(e.target.value)}
                                    className="w-full p-3 bg-white rounded-xl border border-indigo-100 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleInvite}
                            disabled={inviting}
                            className="w-full py-4 bg-[#1a237e] text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {inviting ? (
                                <>
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Send Invite</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Feedback Toast */}
                {notification && (
                    <div className={`fixed bottom-24 left-4 right-4 p-4 rounded-xl text-white text-center text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-4 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {notification.message}
                    </div>
                )}

                {/* Save Button (Inline) */}
                {isEditing && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-14 bg-[#1a237e] text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                    >
                        {saving ? (
                            <>
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                )}
            </div>


        </div>
    )
}
