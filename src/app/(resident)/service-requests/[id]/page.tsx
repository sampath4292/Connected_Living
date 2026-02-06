"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2, AlertTriangle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, getIconForType, ServiceRequestItem, StaffItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [request, setRequest] = useState<ServiceRequestItem | null>(null)
    const [staff, setStaff] = useState<StaffItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const req = await api.getServiceRequestById(id)
            setRequest(req || null)

            if (req && req.assignedTo) {
                const staffMember = await api.getStaffById(req.assignedTo)
                setStaff(staffMember || null)
            }
            setLoading(false)
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-64 w-full rounded-2xl mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Request Not Found</h2>
                <button onClick={() => router.back()} className="mt-6 text-[#1a237e] font-bold hover:underline">
                    Go Back
                </button>
            </div>
        )
    }

    const Icon = getIconForType(request.category)

    let statusColor = "bg-gray-100 text-gray-600"
    if (request.status === "In Progress") statusColor = "bg-blue-100 text-blue-700"
    if (request.status === "Open") statusColor = "bg-orange-100 text-orange-700"
    if (request.status === "Resolved") statusColor = "bg-green-100 text-green-700"

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-4">
                <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#1a237e]">Request Details</h1>
                </div>
            </div>

            <div className="p-4 max-w-2xl mx-auto space-y-6">

                {/* Status Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Icon size={28} />
                        </div>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide", statusColor)}>
                            {request.status}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{request.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <span className="font-bold text-gray-400">ID: {request.id}</span>
                        <span>•</span>
                        <span>{request.category}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Created On</p>
                            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                <Calendar size={14} className="text-[#1a237e]" />
                                {request.date}
                            </div>
                        </div>
                        {request.preferredDate && (
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Preferred Date</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                    <Clock size={14} className="text-[#1a237e]" />
                                    {request.preferredDate} {request.preferredTime ? `, ${request.preferredTime}` : ''}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description & Photo */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{request.description}</p>

                    {(request.photo || request.image) && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100">
                            <img
                                src={request.photo || request.image}
                                alt="Request Attachment"
                                className="w-full h-auto object-cover max-h-64"
                            />
                        </div>
                    )}
                </div>

                {/* Assigned Staff (History/Active) */}
                {staff && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">
                            {request.status === "Resolved" || request.status === "Closed" ? "Service Completed By" : "Assigned To"}
                        </h3>

                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
                                {staff.name[0]}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{staff.name}</h4>
                                <p className="text-sm text-gray-500">{staff.role}</p>
                            </div>

                        </div>

                        {request.status === "Resolved" && (
                            <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3 text-green-800 text-sm">
                                <CheckCircle2 size={16} />
                                <span className="font-medium">Job marked as completed successfully.</span>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
