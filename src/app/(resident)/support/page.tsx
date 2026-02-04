"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp, Mail, HelpCircle, Phone, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock FAQ Data
const FAQS = [
    {
        question: "How do I update my profile details?",
        answer: "Go to the Profile page and tap the 'Edit' icon at the top right. You can verify your identity via OTP or Password to make sensitive changes like Email or Phone number."
    },
    {
        question: "How can I pay my maintenance bill?",
        answer: "Navigate to the 'Payment History' section from the Profile menu. You can view pending bills and pay them using your preferred payment method."
    },
    {
        question: "How do I add a family member?",
        answer: "Go to Settings > Family Members. Tap the 'Add Member' button, fill in the details, and save. You can also upload a profile picture for them."
    },
    {
        question: "Can I pre-approve visitors?",
        answer: "Yes, this feature is coming soon! You will be able to generate entry codes for your guests directly from the app."
    },
    {
        question: "What should I do in an emergency?",
        answer: "In case of an emergency, please contact the main gate security immediately via the intercom or the emergency contact number listed in the community dashboard."
    }
]

export default function SupportPage() {
    const router = useRouter()
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-[#1a237e] hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-[#1a237e]">Help & Support</h1>
            </div>

            <div className="p-6 space-y-6">

                {/* Contact Admin Card */}
                <div className="bg-[#1a237e] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Mail size={24} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Need personal assistance?</h2>
                        <p className="text-indigo-100 mb-6 text-sm">Contact the admin directly for specific queries or urgent issues.</p>

                        <a href="mailto:admin@connectedliving.com" className="inline-flex items-center gap-2 bg-white text-[#1a237e] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm">
                            <Mail size={16} />
                            Email Admin
                        </a>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 bg-indigo-500/30 rounded-full blur-2xl"></div>
                </div>

                {/* FAQs Section */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <HelpCircle size={20} className="text-indigo-600" />
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-200">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-800 text-sm md:text-base">{faq.question}</span>
                                    <div className={cn(
                                        "p-2 rounded-full bg-gray-50 text-gray-400 transition-transform duration-200",
                                        openIndex === index && "bg-indigo-50 text-indigo-600 rotate-180"
                                    )}>
                                        <ChevronDown size={16} />
                                    </div>
                                </button>
                                <div className={cn(
                                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                                    openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                )}>
                                    <div className="p-4 pt-0 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Support Options (Placeholder for robustness) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                            <Phone size={20} />
                        </div>
                        <p className="font-bold text-gray-900 text-sm">Emergency</p>
                        <p className="text-xs text-gray-400">Call Security</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <MessageSquare size={20} />
                        </div>
                        <p className="font-bold text-gray-900 text-sm">Community</p>
                        <p className="text-xs text-gray-400">Ask Residents</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
