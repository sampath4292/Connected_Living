"use client"

import { useState } from "react"
// @ts-ignore
import { QrReader } from 'react-qr-reader'
import { ScanLine, CheckCircle, XCircle, Search, User, Loader2, QrCode, Camera as CameraIcon, RotateCcw } from "lucide-react"
import { api, VisitorItem } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function SecurityScannerPage() {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [scannedVisitor, setScannedVisitor] = useState<VisitorItem | null>(null)
    const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment")
    const [isCameraActive, setIsCameraActive] = useState(true)

    // Handle QR Scan
    const handleQrScan = async (result: any) => {
        if (result) {
            const scanCode = result?.text
            if (scanCode && scanCode !== code) {
                // Determine if we should process this code
                // Prevent flooding scans
                setCode(scanCode)
                await processCode(scanCode)
            }
        }
    }

    // Handle Manual Submit
    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim()) return
        await processCode(code)
    }

    const processCode = async (inputCode: string) => {
        setIsLoading(true)
        setScanStatus("idle")
        setScannedVisitor(null)
        setErrorMessage("")

        try {
            const visitor = await api.verifyVisitorCode(inputCode)

            if (visitor) {
                setScannedVisitor(visitor)

                if (visitor.status === "Expected") {
                    await api.checkInVisitor(visitor.id)
                    setScanStatus("success")
                    toast.success(`${visitor.name} marked as INSIDE`)
                    setScannedVisitor({ ...visitor, status: "Inside", time: "Just now" })
                } else if (visitor.status === "Inside") {
                    // @ts-ignore
                    if (api.checkOutVisitor) {
                        // @ts-ignore
                        await api.checkOutVisitor(visitor.id)
                        setScanStatus("success")
                        toast.success(`${visitor.name} marked as LEFT`)
                        setScannedVisitor({ ...visitor, status: "Left", time: "Just now" })
                    } else {
                        setScanStatus("error")
                        setErrorMessage("Check-out not supported.")
                    }
                } else if (visitor.status === "Left") {
                    setScanStatus("error")
                    setErrorMessage(`Visitor already exited.`)
                } else if (visitor.status === "Denied") {
                    setScanStatus("error")
                    setErrorMessage(`Visitor Access Denied.`)
                } else {
                    // Generic error/info
                    setScanStatus("error")
                    setErrorMessage(`Status: ${visitor.status}`)
                }
            } else {
                setScanStatus("error")
                setErrorMessage("Invalid Code. Visitor not found.")
            }
        } catch (error) {
            console.error("Scan Error", error)
            setScanStatus("error")
            setErrorMessage("System error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetScan = () => {
        setCode("")
        setScanStatus("idle")
        setScannedVisitor(null)
        setErrorMessage("")
    }

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-background/80 backdrop-blur-xl p-4 lg:p-6 border-b border-border sticky top-0 z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground lg:text-3xl tracking-tight">QR Scanner</h1>
                    <p className="text-muted-foreground text-sm mt-1">Scan visitor or vehicle passes</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className="gap-2"
                >
                    {isCameraActive ? "Stop Camera" : "Start Camera"}
                </Button>
            </div>

            <div className="p-6 max-w-xl mx-auto space-y-8">
                {/* Scanner View */}
                <div className="relative aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-muted flex flex-col items-center justify-center">

                    {isCameraActive ? (
                        <div className="w-full h-full relative">
                            <QrReader
                                constraints={{ facingMode: cameraFacing }}
                                onResult={handleQrScan}
                                className="w-full h-full object-cover"
                                containerStyle={{ width: '100%', height: '100%' }}
                                videoStyle={{ objectFit: 'cover' }}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-green-500 rounded-3xl relative opacity-80">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_linear_infinite]"></div>
                                </div>
                            </div>

                            {/* Flip Camera Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraFacing(prev => prev === "environment" ? "user" : "environment");
                                }}
                                className="absolute bottom-4 right-4 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 backdrop-blur-md z-20"
                            >
                                <CameraIcon size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                            <QrCode size={64} className="opacity-20 mb-4" />
                            <p>Camera Paused</p>
                        </div>
                    )}
                </div>

                {/* Manual Input Fallback */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Or enter code manually</label>
                            <div className="relative">
                                <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Visitor Pass Code (e.g. 4521)"
                                    className="w-full bg-muted/50 border border-input rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono tracking-wider"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !code}
                            className={cn(
                                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                isLoading || !code ? "bg-muted text-muted-foreground" : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/20"
                            )}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                </div>

                {/* Scan Result */}
                {scanStatus !== "idle" && (
                    <div className={cn(
                        "rounded-2xl p-6 border shadow-lg animate-in slide-in-from-bottom-4 duration-500",
                        scanStatus === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                    )}>
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                scanStatus === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            )}>
                                {scanStatus === "success" ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            </div>
                            <div className="flex-1">
                                <h3 className={cn(
                                    "font-bold text-lg mb-1",
                                    scanStatus === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                                )}>
                                    {scanStatus === "success" ? "Processed Successfully" : "Action Failed"}
                                </h3>

                                {scannedVisitor && (
                                    <div className="text-sm space-y-2 mt-2">
                                        <div className="flex justify-between border-b border-green-500/20 pb-2">
                                            <span className="text-muted-foreground">Visitor</span>
                                            <span className="font-semibold text-foreground">{scannedVisitor.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-green-500/20 pb-2">
                                            <span className="text-muted-foreground">Type</span>
                                            <span className="font-semibold text-foreground">{scannedVisitor.type}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-green-500/20 pb-2">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={cn(
                                                "font-bold uppercase",
                                                scannedVisitor.status === "Inside" ? "text-green-600" :
                                                    scannedVisitor.status === "Left" ? "text-gray-600" : "text-blue-600"
                                            )}>{scannedVisitor.status}</span>
                                        </div>
                                        <div className="flex justify-between pt-1">
                                            <span className="text-muted-foreground">Time</span>
                                            <span className="font-bold text-foreground">{scannedVisitor.time}</span>
                                        </div>
                                    </div>
                                )}

                                {scanStatus === "error" && (
                                    <p className="text-muted-foreground text-sm mt-1">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={resetScan}
                            className="w-full mt-6 bg-background border border-border py-2.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={16} /> Scan Next Visitor
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    )
}
