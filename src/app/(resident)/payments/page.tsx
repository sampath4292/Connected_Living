"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Receipt, Zap, Droplets, Home, Clock, Download, Flame, AlertCircle, PlugZap, PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
// Import API
import { api, PaymentItem } from "@/lib/api"

export default function PaymentsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("pending")
    const [payments, setPayments] = useState<PaymentItem[]>([])

    useEffect(() => {
        api.getPayments().then(setPayments)
    }, [])

    const filteredPayments = activeTab === "pending"
        ? payments.filter(p => ["Pending", "Overdue"].includes(p.status))
        : payments.filter(p => ["Paid"].includes(p.status))

    // Grouping logic
    const utilities = filteredPayments.filter(p => p.category === "Utilities")
    const rentals = filteredPayments.filter(p => p.category === "Rentals")

    // Helper for Payment Icons
    const getPaymentIcon = (type: string) => {
        switch (type) {
            case "Maintenance": return Home
            case "Electricity": return Zap
            case "Water": return Droplets
            case "Gas": return Flame
            case "Rent": return Home
            case "Penalty": return AlertCircle
            case "EV": return PlugZap
            case "Event": return PartyPopper
            default: return CreditCard
        }
    }

    const getTotalDue = () => {
        // Simple parse and sum (removing currency symbol for logic)
        return payments
            .filter(p => p.status === "Pending" || p.status === "Overdue")
            .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0)
    }

    const PaymentCard = ({ payment }: { payment: PaymentItem }) => {
        const Icon = getPaymentIcon(payment.type)
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-gray-50 text-gray-600 group-hover:bg-[#1a237e] group-hover:text-white"
                    )}>
                        <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{payment.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {activeTab === "pending" ? (
                                <>
                                    <Clock size={12} className={payment.status === "Overdue" ? "text-red-500" : "text-orange-500"} />
                                    <span className={cn("text-xs font-medium", payment.status === "Overdue" ? "text-red-600" : "text-orange-600")}>
                                        Due {payment.dueDate}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs text-gray-500">Paid on {payment.paymentDate}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg text-[#1a237e]">{payment.amount}</div>
                        {activeTab === "pending" ? (
                            <button className="mt-2 text-xs font-bold bg-[#1a237e] text-white px-4 py-1.5 rounded-lg hover:bg-blue-900 transition-colors">
                                Pay
                            </button>
                        ) : (
                            <button className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#1a237e] ml-auto transition-colors">
                                <Download size={12} />
                                Receipt
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 lg:border-none p-4 lg:p-6 lg:bg-transparent">
                <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-50 rounded-full lg:hidden">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-[#1a237e] lg:text-3xl">Payments</h1>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full space-y-6">

                {/* Total Due Card (Visible on ALL screens now) */}
                {activeTab === "pending" && getTotalDue() > 0 && (
                    <div className="bg-[#1a237e] text-white p-6 rounded-3xl shadow-lg shadow-indigo-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-blue-200 text-sm font-medium mb-1">Total Outstanding</p>
                                <h2 className="text-4xl font-bold">₹{getTotalDue().toLocaleString()}</h2>
                            </div>
                            <button className="w-full md:w-auto px-8 bg-white text-[#1a237e] font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                                Pay All
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100/80 rounded-xl">
                    <button
                        onClick={() => setActiveTab("pending")}
                        suppressHydrationWarning
                        className={cn(
                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === "pending" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Start Pending
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        suppressHydrationWarning
                        className={cn(
                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === "history" ? "bg-white text-[#1a237e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Payment History
                    </button>
                </div>

                {/* List */}
                <div className="space-y-8">
                    {utilities.length === 0 && rentals.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Receipt size={32} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No payments found</p>
                        </div>
                    )}

                    {utilities.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold text-[#1a237e] flex items-center gap-2">
                                <Zap size={20} className="text-indigo-500" />
                                Utilities
                            </h2>
                            <div className="space-y-3">
                                {utilities.map(p => <PaymentCard key={p.id} payment={p} />)}
                            </div>
                        </section>
                    )}

                    {rentals.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold text-[#1a237e] flex items-center gap-2">
                                <Home size={20} className="text-indigo-500" />
                                Rentals & Charges
                            </h2>
                            <div className="space-y-3">
                                {rentals.map(p => <PaymentCard key={p.id} payment={p} />)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
