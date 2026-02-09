"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Calendar, Clock, IdCard } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function NewFrequentVisitorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [type, setType] = useState<"Guest" | "Delivery" | "Cab" | "Staff">("Staff")
    const [relation, setRelation] = useState("")
    const [validUntil, setValidUntil] = useState("")
    const dateInputRef = useRef<HTMLInputElement>(null)

    // Optional Time Slot
    const [hasTimeSlot, setHasTimeSlot] = useState(false)
    const [allowedTimeSlot, setAllowedTimeSlot] = useState("Morning (8am-12pm)")
    const TIME_SLOTS = ["Morning (8am-12pm)", "Afternoon (12pm-4pm)", "Evening (4pm-9pm)", "All Day"]

    const handleSubmit = async () => {
        if (!name || !validUntil) {
            // Simple validation feedback (could use toast if installed)
            alert("Please fill required fields")
            return
        }

        setLoading(true)
        try {
            await api.addFrequentVisitor({
                name,
                type,
                relation,
                validUntil,
                allowedTimeSlot: hasTimeSlot ? allowedTimeSlot : undefined,
                isActive: true,
                avatar: name[0].toUpperCase()
            })
            // Success feedback
            setTimeout(() => router.push('/visitors'), 500)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 bg-card/80 backdrop-blur-md z-10 border-b border-border p-4">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-foreground">New Long-Term Pass</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* Intro Card */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
                    <div className="bg-card p-2 rounded-xl text-primary shadow-sm">
                        <IdCard size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-primary">Frequent Visitor Pass</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Create a pass for maids, drivers, or tutors. They can enter using their code until the validity expires.
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Name */}
                    <div className="bg-card p-4 rounded-2xl border border-border space-y-4 shadow-sm">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visitor Name</label>
                            <div className="flex items-center gap-3 mt-2">
                                <User size={18} className="text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sunita Helper"
                                    className="flex-1 bg-transparent outline-none text-foreground font-semibold placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Type & Relation */}
                    <div className="bg-card p-4 rounded-2xl border border-border space-y-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="w-full mt-2 bg-background p-2 rounded-lg text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Cab">Daily Cab</option>
                                    <option value="Guest">Guest (Frequent)</option>
                                    <option value="Delivery">Regular Delivery</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</label>
                                <input
                                    type="text"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    placeholder="e.g. Maid"
                                    className="w-full mt-2 bg-background p-2 rounded-lg text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Validity */}
                    <div className="bg-card p-4 rounded-2xl border border-border space-y-4 shadow-sm">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} />
                                Valid Until
                            </label>
                            <div
                                className="relative group mt-2"
                                onClick={() => dateInputRef.current?.showPicker()}
                            >
                                <input
                                    type="text"
                                    readOnly
                                    value={validUntil ? validUntil.split('-').reverse().join('-') : ''}
                                    placeholder="DD-MM-YYYY"
                                    className="w-full bg-background p-3 rounded-xl text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 pointer-events-none border border-border placeholder:text-muted-foreground"
                                />
                                <input
                                    type="date"
                                    ref={dateInputRef}
                                    min={new Date().toISOString().split('T')[0]}
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                The code will stop working after this date.
                            </p>
                        </div>
                    </div>

                    {/* Optional Time Slot */}
                    <div className="bg-card p-4 rounded-2xl border border-border space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} />
                                Restrict Entry Time?
                            </label>
                            <div
                                onClick={() => setHasTimeSlot(!hasTimeSlot)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${hasTimeSlot ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <div className={`h-4 w-4 bg-white rounded-full transition-transform ${hasTimeSlot ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        {hasTimeSlot && (
                            <div className="grid gap-2 animate-in slide-in-from-top-2">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setAllowedTimeSlot(slot)}
                                        className={`text-left p-3 rounded-xl text-xs font-semibold border transition-all ${allowedTimeSlot === slot
                                            ? 'bg-primary/10 border-primary/30 text-primary'
                                            : 'bg-muted border-transparent text-muted-foreground hover:bg-accent'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Static Save Button */}
            <div className="p-4 bg-card border-t border-border max-w-md mx-auto">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Pass...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Create Pass</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
