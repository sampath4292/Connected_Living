"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, BrainCircuit, Send, Sparkles, StopCircle, CornerDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BrainAIPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [messages, setMessages] = useState<{ role: "ai" | "user", text: string }[]>([
        { role: "ai", text: "Hello! I'm Brain, your personal assistant. I can help you book amenities, raise tickets, or answer questions about your community. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isThinking])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input
        setMessages(prev => [...prev, { role: "user", text: userMsg }])
        setInput("")
        setIsThinking(true)

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", text: "I understand you're asking about \"" + userMsg + "\". Once I'm fully connected to the backend, I'll be able to help with that!" }])
            setIsThinking(false)
        }, 1500)
    }

    const toggleRecording = () => {
        setIsRecording(!isRecording)
        if (!isRecording) {
            // Simulate receiving voice input after recording
            setTimeout(() => {
                if (Math.random() > 0.5) { // Just a random check to simulate stopping
                    // In real app, this would be manual stop or silence detection
                }
            }, 3000)
        }
    }

    return (
        <div className="fixed inset-0 bottom-20 z-0 lg:static lg:z-auto lg:h-[calc(100vh-2rem)] flex flex-col bg-white overflow-hidden">
            {/* Ambient Background with Brain Watermark */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <BrainCircuit size={600} className="text-[#1a237e]" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 flex items-center justify-center border-b border-gray-50 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <BrainCircuit size={18} />
                    </div>
                    <span className="font-bold text-gray-800 text-lg tracking-tight">Brain AI</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative z-10 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex max-w-[85%] animate-in slide-in-from-bottom-2 duration-300",
                            msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                msg.role === "user"
                                    ? "bg-[#1a237e] text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                            )}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <Sparkles size={16} className="text-violet-500 animate-pulse" />
                            <span className="text-xs font-medium text-gray-500">Brain is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input & Record Area */}
            <div className="relative z-20 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 pb-8 lg:pb-4">
                <div className="flex items-end gap-3 max-w-3xl mx-auto">

                    {/* Input Field */}
                    <div className="flex-1 bg-gray-50 rounded-[1.5rem] border border-gray-100 focus-within:border-violet-300 focus-within:shadow-md transition-all p-1.5 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={cn(
                                "p-2 rounded-full transition-all",
                                input.trim() ? "bg-[#1a237e] text-white hover:bg-indigo-800 shadow-md transform hover:scale-105" : "text-gray-300 cursor-not-allowed"
                            )}
                        >
                            <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
                        </button>
                    </div>

                    {/* Audio Record Button */}
                    <button
                        onClick={toggleRecording}
                        className={cn(
                            "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-4 border-white",
                            isRecording
                                ? "bg-red-500 text-white animate-pulse scale-110 shadow-red-200"
                                : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white hover:shadow-indigo-200 transform hover:scale-105"
                        )}
                    >
                        {isRecording ? <StopCircle size={28} /> : <Mic size={26} />}
                    </button>
                </div>
                {isRecording && (
                    <p className="text-center text-xs text-red-500 font-medium mt-2 animate-pulse">Recording... Tap to stop</p>
                )}
            </div>
        </div>
    )
}
