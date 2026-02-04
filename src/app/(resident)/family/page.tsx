"use client"

import { useState, useEffect } from "react"
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Users,
    User,
    Loader2,
    Check,
    X,
    Camera
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api, FamilyMemberItem } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FamilyPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<FamilyMemberItem[]>([])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null) // null = adding new
    const [formData, setFormData] = useState<Partial<FamilyMemberItem>>({
        name: "",
        relation: "Child",
        age: "",
        phone: ""
    })
    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const data = await api.getFamilyMembers()
            setMembers(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (member?: FamilyMemberItem) => {
        if (member) {
            setEditingId(member.id)
            setFormData(member)
        } else {
            setEditingId(null)
            setFormData({ name: "", relation: "Child", age: "", phone: "" })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.name || !formData.age) return
        setLoadingAction(true)
        try {
            if (editingId) {
                await api.updateFamilyMember(editingId, formData)
            } else {
                await api.addFamilyMember(formData as Omit<FamilyMemberItem, "id">)
            }
            await fetchMembers()
            setIsModalOpen(false)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingAction(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this family member?")) return
        setLoadingAction(true)
        try {
            await api.deleteFamilyMember(id)
            await fetchMembers()
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingAction(false)
        }
    }

    // Helper for Avatar Fallback
    const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : "?"

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-red-100 text-red-600",
            "bg-green-100 text-green-600",
            "bg-blue-100 text-blue-600",
            "bg-yellow-100 text-yellow-600",
            "bg-purple-100 text-purple-600",
            "bg-pink-100 text-pink-600",
            "bg-indigo-100 text-indigo-600",
            "bg-orange-100 text-orange-600",
            "bg-teal-100 text-teal-600",
            "bg-cyan-100 text-cyan-600",
        ]
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e]">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-[#1a237e]">Family Members</h1>
                <button onClick={() => handleOpenModal()} className="p-2 -mr-2 text-[#1a237e] bg-indigo-50 rounded-full h-10 w-10 flex items-center justify-center">
                    <Plus size={24} />
                </button>
            </div>

            <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">

                        {/* Action Buttons (Absolute Positioned) */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(member)} className="p-2 text-indigo-600 bg-white/90 rounded-full hover:bg-indigo-50 shadow-sm border border-indigo-100">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 bg-white/90 rounded-full hover:bg-red-50 shadow-sm border border-red-100">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className={cn(
                            "h-24 w-24 rounded-full flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100",
                            member.avatar ? "bg-slate-100" : getAvatarColor(member.name)
                        )}>
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold">{getInitials(member.name)}</span>
                            )}
                        </div>

                        {/* Name & Relation */}
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">{member.name}</h3>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">{member.relation}</span>

                        {/* Details */}
                        <div className="space-y-1 w-full pt-3 border-t border-gray-50">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Age</span>
                                <span className="font-medium text-gray-900">{member.age} yrs</span>
                            </div>
                            {member.phone && (
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Phone</span>
                                    <span className="font-medium text-gray-900">{member.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No family members added yet.</p>
                        <Button onClick={() => handleOpenModal()} variant="outline" className="mt-4">Add Member</Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#1a237e]">
                                {editingId ? "Edit Member" : "Add Member"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Avatar Upload */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className={cn(
                                        "h-24 w-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm ring-1 ring-gray-100",
                                        formData.avatar ? "bg-slate-100" : (formData.name ? getAvatarColor(formData.name) : "bg-slate-100 text-slate-300")
                                    )}>
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            formData.name ? (
                                                <span className="text-3xl font-bold">{getInitials(formData.name)}</span>
                                            ) : (
                                                <User size={48} />
                                            )
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-[#1a237e] text-white rounded-full cursor-pointer hover:bg-[#151b60] transition-colors shadow-md">
                                        <Camera size={14} />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, avatar: reader.result as string })
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                <Input
                                    placeholder="e.g. Aarav Singh"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Relation</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.relation}
                                        onChange={(e) => setFormData({ ...formData, relation: e.target.value as any })}
                                    >
                                        <option value="Spouse">Spouse</option>
                                        <option value="Child">Child</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Age</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 8"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone (Optional)</label>
                                <Input
                                    type="tel"
                                    placeholder="e.g. 9876543210"
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <Button onClick={handleSave} className="w-full bg-[#1a237e] hover:bg-[#151b60] mt-4" disabled={loadingAction || !formData.name}>
                                {loadingAction ? <Loader2 className="animate-spin" /> : (editingId ? "Save Changes" : "Add Member")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
