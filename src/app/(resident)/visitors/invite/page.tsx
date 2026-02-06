"use client"

import { ArrowLeft, User, Truck, Car, CheckCircle, Share2, ShieldCheck, Mail, Phone, Calendar, Clock, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
// Assuming api is available
import { api, InviteParams } from "@/lib/api"

export default function InviteVisitorPage() {
    const router = useRouter()
    const [visitorType, setVisitorType] = useState<"guest" | "delivery" | "cab">("guest")
    const [loading, setLoading] = useState(false)
    const [successData, setSuccessData] = useState<{ code?: string, message: string } | null>(null)

    // Form States
    const [formData, setFormData] = useState({
        // Common
        date: new Date().toISOString().split('T')[0],
        time: "18:00",

        // Guest
        name: "",
        phone: "",
        email: "",
        photo: "",
        singleEntry: true,

        // Delivery
        vendor: "", // "Amazon", "Zomato" etc.

        // Cab
        driverName: "",
        vehicleNo: "",
        service: "", // "Uber", "Ola"
        model: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Validation Logic
        if (visitorType === 'guest') {
            if (!formData.name || !formData.date || !formData.time) {
                alert("Please fill all mandatory fields")
                setLoading(false)
                return
            }
            if (!formData.phone && !formData.email) {
                alert("Either Phone or Email is required for Guests")
                setLoading(false)
                return
            }
        } else if (visitorType === 'delivery') {
            if (!formData.vendor || !formData.date) {
                alert("Vendor and Date are mandatory")
                setLoading(false)
                return
            }
        } else if (visitorType === 'cab') {
            if (!formData.driverName || !formData.vehicleNo || !formData.service || !formData.date) {
                alert("Driver details and Date are mandatory")
                setLoading(false)
                return
            }
        }

        try {
            let payload: InviteParams
            if (visitorType === 'guest') {
                payload = {
                    type: "Guest",
                    name: formData.name,
                    date: formData.date,
                    time: formData.time,
                    singleEntry: formData.singleEntry,
                    phone: formData.phone,
                    email: formData.email,
                    avatar: formData.photo
                }
            } else if (visitorType === 'delivery') {
                payload = {
                    type: "Delivery",
                    vendor: formData.vendor,
                    date: formData.date,
                    name: formData.name,
                    phone: formData.phone,
                    time: formData.time
                }
            } else {
                payload = {
                    type: "Cab",
                    driverName: formData.driverName,
                    vehicleNo: formData.vehicleNo,
                    service: formData.service,
                    date: formData.date,
                    time: formData.time,
                    model: formData.model
                }
            }

            const res = await api.inviteVisitor(payload)
            if (res.success) {
                setSuccessData({ code: res.code, message: res.message })
            }
        } catch (error) {
            console.error(error)
            alert("Failed to invite visitor")
        } finally {
            setLoading(false)
        }
    }

    // Success View
    if (successData) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{successData.message}</h2>
                {successData.code && (
                    <div className="my-6 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-indigo-200">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Pass Code</p>
                        <p className="text-4xl font-mono font-bold text-indigo-700 tracking-wider">{successData.code}</p>
                    </div>
                )}
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                    {visitorType === 'guest' ? "Code has been sent to the guest." : "Security has been notified."}
                </p>
                <div className="flex gap-4 w-full max-w-xs">
                    <button onClick={() => router.back()} className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50">
                        Close
                    </button>
                    {visitorType === 'guest' && (
                        <button className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700">
                            <Share2 size={18} /> Share
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-4 lg:p-6 lg:border-none lg:bg-transparent">
                <div className="max-w-2xl mx-auto w-full flex items-center gap-3">
                    <button onClick={() => router.back()} suppressHydrationWarning className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#1a237e] lg:text-3xl">Invite {visitorType === 'guest' ? 'Visitor' : visitorType === 'delivery' ? 'Delivery' : 'Cab'}</h1>
                </div>
            </div>

            <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full">
                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* Visitor Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Entry Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            <TypeCard id="guest" icon={User} label="Guest" active={visitorType === "guest"} onClick={() => setVisitorType("guest")} />
                            <TypeCard id="delivery" icon={Truck} label="Delivery" active={visitorType === "delivery"} onClick={() => setVisitorType("delivery")} />
                            <TypeCard id="cab" icon={Car} label="Cab" active={visitorType === "cab"} onClick={() => setVisitorType("cab")} />
                        </div>
                    </div>

                    {/* DYNAMIC FORM FIELDS */}
                    <div className="space-y-5">

                        {/* --- GUEST FORM --- */}
                        {visitorType === 'guest' && (
                            <>
                                {/* Photo Upload */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative group">
                                        <div className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-all overflow-hidden",
                                            formData.photo ? "border-indigo-500 bg-white" : "border-gray-300 bg-gray-50 group-hover:bg-gray-100"
                                        )}>
                                            {formData.photo ? (
                                                <img src={formData.photo} alt="Guest" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="text-gray-400 group-hover:text-gray-500 transition-colors" size={32} />
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 bg-[#1a237e] text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                            <Camera size={14} />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2 absolute -bottom-6">Add Photo</p>
                                </div>

                                <Input label="Guest Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter guest name" />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact (One Required)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border focus:bg-white focus:border-indigo-200 outline-none" />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 border focus:bg-white focus:border-indigo-200 outline-none" />
                                        </div>
                                    </div>
                                    {(!formData.phone && !formData.email) && <p className="text-xs text-orange-500">* Please provide either phone or email</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required icon={Calendar} />
                                    <Input label="Time" name="time" type="time" value={formData.time} onChange={handleChange} required icon={Clock} />
                                </div>

                                <Toggle label="Single Entry Pass" sub="Code expires after one use" checked={formData.singleEntry} onChange={(c) => setFormData(p => ({ ...p, singleEntry: c }))} />
                            </>
                        )}

                        {/* --- DELIVERY FORM --- */}
                        {visitorType === 'delivery' && (
                            <>
                                <Input label="Vendor / App Name" name="vendor" value={formData.vendor} onChange={handleChange} required placeholder="e.g. Amazon, Zomato, Swiggy" />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required icon={Calendar} />
                                    <Input label="Time (Optional)" name="time" type="time" value={formData.time} onChange={handleChange} icon={Clock} />
                                </div>

                                <Input label="Delivery Person Name (Optional)" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name if known" />
                                <Input label="Mobile Number (Optional)" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter mobile number" />
                            </>
                        )}

                        {/* --- CAB FORM --- */}
                        {visitorType === 'cab' && (
                            <>
                                <Input label="Cab Service" name="service" value={formData.service} onChange={handleChange} required placeholder="e.g. Uber, Ola, Private" />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Driver Name" name="driverName" value={formData.driverName} onChange={handleChange} required placeholder="Driver Name" />
                                    <Input label="Vehicle Number" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} required placeholder="e.g. KA 01 AB 1234" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required icon={Calendar} />
                                    <Input label="Time (Optional)" name="time" type="time" value={formData.time} onChange={handleChange} icon={Clock} />
                                </div>

                                <Input label="Car Model (Optional)" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Swift Dzire" />
                            </>
                        )}

                    </div>
                </form>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 lg:border-none lg:max-w-2xl lg:mx-auto lg:w-full">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full h-14 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : visitorType === 'guest' ? (
                        <>Share Invite Code <Share2 size={20} /></>
                    ) : (
                        <>Share with Security <ShieldCheck size={20} /></>
                    )}
                </button>
            </div>
        </div>
    )
}

// --- Components ---

function TypeCard({ id, icon: Icon, label, active, onClick }: { id: string, icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            suppressHydrationWarning
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

function Input({ label, icon: Icon, type, value, onChange, className, ...props }: any) {
    const dateRef = useRef<HTMLInputElement>(null)
    // Custom Date Logic
    if (type === 'date') {
        // Format YYYY-MM-DD to DD-MM-YYYY for display
        const displayValue = value ? value.split('-').reverse().join('-') : ''

        return (
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">{label}</label>
                <div className="relative group" onClick={() => dateRef.current?.showPicker()}>
                    {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400 z-10" size={18} />}

                    {/* Visible Input (Formatted) */}
                    <input
                        type="text"
                        readOnly
                        placeholder="DD-MM-YYYY"
                        value={displayValue}
                        className={cn(
                            "w-full h-12 rounded-xl bg-white border-2 border-transparent focus:border-[#1a237e]/20 outline-none transition-all font-medium text-black placeholder:text-gray-400 pointer-events-none",
                            Icon ? "pl-10 pr-4" : "px-4",
                            className
                        )}
                    />

                    {/* Hidden Native Picker Overlay */}
                    <input
                        {...props}
                        type="date"
                        ref={dateRef}
                        min={new Date().toISOString().split('T')[0]}
                        value={value}
                        onChange={onChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400" size={18} />}
                <input
                    {...props}
                    type={type}
                    value={value}
                    onChange={onChange}
                    suppressHydrationWarning
                    className={cn(
                        "w-full h-12 rounded-xl bg-white border-2 border-transparent focus:border-[#1a237e]/20 outline-none transition-all font-medium text-black placeholder:text-gray-400",
                        Icon ? "pl-10 pr-4" : "px-4",
                        className
                    )}
                />
            </div>
        </div>
    )
}

function Toggle({ label, sub, checked, onChange }: { label: string, sub?: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer" onClick={() => onChange(!checked)}>
            <div>
                <h4 className="font-semibold text-gray-900">{label}</h4>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
            <div className={cn("h-6 w-11 rounded-full relative transition-colors", checked ? "bg-[#1a237e]" : "bg-gray-300")}>
                <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all", checked ? "right-1" : "left-1")}></div>
            </div>
        </div>
    )
}
