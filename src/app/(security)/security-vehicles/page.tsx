"use client"

import { useEffect, useState } from "react"
import { Car, Search, ChevronLeft, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface VehicleEntry {
    id: string
    vehicleNumber: string
    type: "Car" | "Bike" | "Truck" | "Auto"
    ownerName: string
    unitId: string
    status: "Inside" | "Exited"
    entryTime: string
    exitTime?: string
}

const MOCK_VEHICLES: VehicleEntry[] = [
    { id: "1", vehicleNumber: "KA-01-AB-1234", type: "Car", ownerName: "Vikram Sharma", unitId: "A-101", status: "Inside", entryTime: "9:30 AM" },
    { id: "2", vehicleNumber: "KA-05-CD-5678", type: "Bike", ownerName: "Priya Patel", unitId: "B-205", status: "Inside", entryTime: "10:15 AM" },
    { id: "3", vehicleNumber: "KA-03-EF-9012", type: "Car", ownerName: "Rahul Kumar", unitId: "A-302", status: "Exited", entryTime: "8:00 AM", exitTime: "11:30 AM" },
    { id: "4", vehicleNumber: "KA-02-GH-3456", type: "Truck", ownerName: "Delivery - Amazon", unitId: "C-101", status: "Inside", entryTime: "11:00 AM" },
    { id: "5", vehicleNumber: "KA-04-IJ-7890", type: "Auto", ownerName: "Cab for A-201", unitId: "A-201", status: "Exited", entryTime: "9:45 AM", exitTime: "10:00 AM" },
]

export default function SecurityVehiclesPage() {
    const [loading, setLoading] = useState(true)
    const [vehicles, setVehicles] = useState<VehicleEntry[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<"all" | "Inside" | "Exited">("all")

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setVehicles(MOCK_VEHICLES)
            setLoading(false)
        }, 500)
    }, [])

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || v.status === filter
        return matchesSearch && matchesFilter
    })

    const getTypeIcon = (type: string) => {
        return Car // Simplified - using Car icon for all
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-background pb-24 lg:pb-0 p-6 space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-card px-6 py-6 rounded-b-[2rem] border-b border-border shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/gate" className="lg:hidden p-2 -ml-2 hover:bg-accent rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-green-600 tracking-tight">Vehicles</h1>
                        <p className="text-xs text-muted-foreground font-medium">Track vehicle entries & exits</p>
                    </div>
                    <div className="h-10 w-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                        <Car size={20} />
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by vehicle number or owner..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-4">
                    {(["all", "Inside", "Exited"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-colors",
                                filter === f
                                    ? "bg-green-500 text-white"
                                    : "bg-muted text-muted-foreground hover:bg-accent"
                            )}
                        >
                            {f === "all" ? "All" : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vehicles List */}
            <div className="p-6 space-y-4">
                {filteredVehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <Car size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-medium">No vehicles found</p>
                    </div>
                ) : (
                    filteredVehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-card rounded-2xl p-4 border border-border shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center",
                                        vehicle.status === "Inside" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"
                                    )}>
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground font-mono">{vehicle.vehicleNumber}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {vehicle.ownerName} • {vehicle.unitId}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Entry: {vehicle.entryTime}
                                            {vehicle.exitTime && ` • Exit: ${vehicle.exitTime}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-xs font-bold",
                                        vehicle.status === "Inside"
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-gray-500/10 text-gray-500"
                                    )}>
                                        {vehicle.status}
                                    </span>
                                </div>
                            </div>

                            {vehicle.status === "Inside" && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <button className="w-full py-2 bg-orange-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                                        <Clock size={16} />
                                        Mark Exit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
