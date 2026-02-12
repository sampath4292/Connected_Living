"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, Calendar, Clock, User, Phone, MapPin,
    Truck, Car, Share2, ShieldCheck, Info, Users,
    BadgeAlert, BadgeCheck, XCircle, Timer, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { api, getIconForType, VisitorItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function VisitorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [visitor, setVisitor] = useState<VisitorItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const v = await api.getVisitorById(parseInt(id))
            setVisitor(v || null)
            setLoading(false)
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (!visitor) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                    <Info size={32} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Visitor Not Found</h2>
                <button onClick={() => router.back()} className="mt-6 text-primary font-bold hover:underline">
                    Go Back
                </button>
            </div>
        )
    }

    const Icon = getIconForType(visitor.type)

    let statusBg, statusColor, StatusIcon
    if (visitor.status === "Inside") {
        statusBg = "bg-green-500/10"
        statusColor = "text-green-600 dark:text-green-500"
        StatusIcon = BadgeCheck
    } else if (visitor.status === "Expected") {
        statusBg = "bg-blue-500/10"
        statusColor = "text-blue-600 dark:text-blue-400"
        StatusIcon = Timer
    } else if (visitor.status === "Expired" || visitor.status === "Denied") {
        statusBg = "bg-red-500/10"
        statusColor = "text-red-600 dark:text-red-500"
        StatusIcon = XCircle
    } else {
        statusBg = "bg-muted"
        statusColor = "text-muted-foreground"
        StatusIcon = Info
    }

    const typeGradients: Record<string, string> = {
        Guest: "from-purple-500 to-indigo-600",
        Delivery: "from-blue-400 to-blue-600",
        Cab: "from-orange-400 to-orange-600",
        Service: "from-teal-400 to-teal-600"
    }

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-border lg:border-none p-4 lg:p-6 lg:bg-transparent">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-foreground hover:bg-accent rounded-full transition-all active:scale-95">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-foreground lg:text-3xl">Visitor Entry Pass</h1>
                    </div>
                    <button className="p-2 text-foreground hover:bg-accent rounded-full transition-all">
                        <Share2 size={24} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">

                {/* Main Pass Card */}
                <div className="relative overflow-hidden bg-card rounded-[2.5rem] border border-border shadow-xl ring-1 ring-white/10">
                    {/* Top Decorative Section */}
                    <div className={cn("h-32 w-full bg-gradient-to-r relative", typeGradients[visitor.type] || "from-primary to-primary/80")}>
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                        <div className="absolute -bottom-10 left-8 h-20 w-20 rounded-3xl bg-card border-4 border-card shadow-lg flex items-center justify-center overflow-hidden">
                            {visitor.image ? (
                                <img src={visitor.image} alt={visitor.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-primary font-bold text-2xl bg-primary/5">
                                    {visitor.name[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-14 pb-8 px-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-foreground tracking-tight">{visitor.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {visitor.type}
                                    </span>
                                    <span className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5", statusBg, statusColor)}>
                                        <StatusIcon size={12} strokeWidth={3} />
                                        {visitor.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex flex-col items-center min-w-[140px]">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Pass Code</p>
                                <p className="text-4xl font-black font-mono text-primary tracking-widest">{visitor.code}</p>
                            </div>
                        </div>

                        <div className="h-px bg-border/50 w-full" />

                        {/* Pass Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DetailBox
                                icon={Calendar}
                                label="Date"
                                value={visitor.date ? visitor.date.split('-').reverse().join('-') : "N/A"}
                            />
                            <DetailBox
                                icon={Clock}
                                label="Time"
                                value={visitor.time?.split(',').pop()?.trim() || "N/A"}
                            />
                            <DetailBox
                                icon={User}
                                label="Host"
                                value={visitor.hostName || "Me"}
                            />
                            <DetailBox
                                icon={ShieldCheck}
                                label="Approval"
                                value={visitor.approvalType || "System"}
                            />
                        </div>
                    </div>

                    {/* Security Footer */}
                    <div className="bg-muted/30 p-4 px-8 border-t border-border flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                            <ShieldCheck size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Verified Entrypass by Connected Living Security
                        </p>
                    </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visitor Info */}
                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Users size={18} className="text-primary" /> Visitor Information
                        </h3>
                        <div className="space-y-3">
                            {visitor.mobile && (
                                <div className="flex items-center justify-between py-2 border-b border-border/50">
                                    <span className="text-sm text-muted-foreground">Mobile</span>
                                    <span className="text-sm font-bold text-foreground">{visitor.mobile}</span>
                                </div>
                            )}
                            {visitor.purpose && (
                                <div className="flex items-center justify-between py-2 border-b border-border/50">
                                    <span className="text-sm text-muted-foreground">Purpose</span>
                                    <span className="text-sm font-bold text-foreground">{visitor.purpose}</span>
                                </div>
                            )}
                            {visitor.vehicleNo && (
                                <div className="flex items-center justify-between py-2 border-b border-border/50">
                                    <span className="text-sm text-muted-foreground">Vehicle Number</span>
                                    <span className="text-sm font-bold text-foreground uppercase">{visitor.vehicleNo}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Unit ID</span>
                                <span className="text-sm font-bold text-foreground">{visitor.unitId || "A-101"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Arrival Logs */}
                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Timer size={18} className="text-primary" /> Entry / Exit Logs
                        </h3>
                        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                            {visitor.entryTime ? (
                                <LogItem
                                    label="Checked In"
                                    time={visitor.entryTime}
                                    status="success"
                                    icon={BadgeCheck}
                                />
                            ) : (
                                <LogItem
                                    label="Upcoming Arrival"
                                    time={visitor.time?.split(',').pop()?.trim() || "Expected soon"}
                                    status="pending"
                                    icon={Timer}
                                />
                            )}

                            {visitor.exitTime && (
                                <LogItem
                                    label="Checked Out"
                                    time={visitor.exitTime}
                                    status="neutral"
                                    icon={XCircle}
                                />
                            )}

                            {visitor.status === "Expired" && (
                                <LogItem
                                    label="Pass Expired"
                                    time="Used or Timing passed"
                                    status="error"
                                    icon={XCircle}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <button className="flex-1 h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]">
                        <Share2 size={20} /> Share Pass Code
                    </button>
                    {visitor.status === "Expected" && (
                        <button className="flex-1 h-14 bg-red-500/10 text-red-500 font-bold rounded-2xl border border-red-500/20 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-[0.98]">
                            <Trash2 size={20} /> Revoke Pass
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function DetailBox({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <Icon size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
    )
}

function LogItem({ label, time, status, icon: Icon }: { label: string, time: string, status: 'success' | 'pending' | 'error' | 'neutral', icon: any }) {
    const colors = {
        success: "text-green-500 bg-card border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
        pending: "text-blue-500 bg-card border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
        error: "text-red-500 bg-card border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
        neutral: "text-muted-foreground bg-card border-border shadow-none"
    }

    return (
        <div className="flex items-center gap-4 relative z-10">
            <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center", colors[status])}>
                <Icon size={12} strokeWidth={3} />
            </div>
            <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{time}</p>
            </div>
        </div>
    )
}
