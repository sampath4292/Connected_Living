import {
    CreditCard, UserPlus, AlertTriangle, Calendar, MessageSquare, Tag, Shield, Users,
    Truck, Car, Waves, Dumbbell, PartyPopper, Zap, Wrench, Package, Hammer, Droplets, Receipt, Flame, AlertCircle, PlugZap
} from "lucide-react"

// --- Types ---

export interface ActivityItem {
    id: number
    title: string
    subtitle: string
    time: string
    iconType: "payment" | "visitor" | "complaint" | "default" // String identifier
    bg: string
    iconColor: string
}

export interface NotificationItem {
    id: number
    title: string
    description: string
    time: string
    type: "payment" | "event" | "notice" | "offer" | "security" | "meeting"
    read: boolean
}

export interface VisitorItem {
    id: number
    name: string
    type: "Delivery" | "Guest" | "Cab"
    code: string
    time: string
    status: "Expected" | "Inside" | "Left" | "Denied"
}

export interface AmenityItem {
    id: string
    name: string
    description: string
    status: "Open" | "Booked Today" | "Closed" | "Maintenance"
    timing: string
    iconType: "pool" | "gym" | "clubhouse" | "conference"
    imageGradient: string
    rules?: string[]
}

export interface ServiceRequestItem {
    id: string
    category: "Electrician" | "Plumber" | "Carpenter" | "Appliance" | "Others"
    title: string
    description: string
    status: "Open" | "In Progress" | "Resolved" | "Closed"
    date: string
    urgency: "Low" | "Medium" | "High"
    image?: string // For "Others" photo upload simulation
}

export interface PaymentItem {
    id: string
    title: string
    amount: string
    dueDate: string
    status: "Pending" | "Paid" | "Overdue"
    category: "Utilities" | "Rentals" // Added Category
    type: "Maintenance" | "Electricity" | "Water" | "Gas" | "Rent" | "Penalty" | "EV" | "Event" | "Other"
    paymentDate?: string // For history
    transactionId?: string
}

// --- Mock Data (Simulating DB) ---

const MOCK_SERVICE_REQUESTS: ServiceRequestItem[] = [
    {
        id: "SR-1023",
        category: "Plumber",
        title: "Leaking Kitchen Sink",
        description: "Water is dripping continuously from the main tap.",
        status: "In Progress",
        date: "Today, 10:30 AM",
        urgency: "High"
    },
    {
        id: "SR-0998",
        category: "Electrician",
        title: "Bedroom Switch Fault",
        description: "Main light switch sparking when turned on.",
        status: "Resolved",
        date: "Jan 28, 2024",
        urgency: "Medium"
    },
    {
        id: "SR-0992",
        category: "Others",
        title: "Wall Crack Analysis",
        description: "Noticed a hairline crack in the living room wall.",
        status: "Closed",
        date: "Jan 15, 2024",
        urgency: "Low"
    }
]

const MOCK_PAYMENTS: PaymentItem[] = [
    // UTILITIES
    {
        id: "PAY-102",
        title: "Electricity Bill - Jan 2024",
        amount: "₹2,450",
        dueDate: "Feb 10, 2024",
        status: "Pending",
        category: "Utilities",
        type: "Electricity"
    },
    {
        id: "PAY-105",
        title: "Pipe Gas Bill",
        amount: "₹850",
        dueDate: "Feb 12, 2024",
        status: "Pending",
        category: "Utilities",
        type: "Gas"
    },
    {
        id: "PAY-106",
        title: "Water Charges",
        amount: "₹450",
        dueDate: "Feb 15, 2024",
        status: "Pending",
        category: "Utilities",
        type: "Water"
    },

    // RENTALS & CHARGES
    {
        id: "PAY-101",
        title: "Monthly Maintenance - Feb 2024",
        amount: "₹5,000",
        dueDate: "Feb 05, 2024",
        status: "Pending",
        category: "Rentals",
        type: "Maintenance"
    },
    {
        id: "PAY-107",
        title: "Monthly Rent",
        amount: "₹25,000",
        dueDate: "Feb 01, 2024",
        status: "Overdue",
        category: "Rentals",
        type: "Rent"
    },
    {
        id: "PAY-108",
        title: "Late Payment Penalty",
        amount: "₹500",
        dueDate: "Immediate",
        status: "Pending",
        category: "Rentals",
        type: "Penalty"
    },
    {
        id: "PAY-109",
        title: "EV Charging Station - Usage",
        amount: "₹1,200",
        dueDate: "Feb 08, 2024",
        status: "Pending",
        category: "Rentals",
        type: "EV"
    },

    // HISTORY ITEMS
    {
        id: "PAY-110",
        title: "New Year Event Contribution",
        amount: "₹2,000",
        dueDate: "Jan 15, 2024",
        status: "Paid",
        category: "Rentals",
        type: "Event",
        paymentDate: "Jan 10, 2024"
    },
    {
        id: "PAY-099",
        title: "Quarterly Water Charges",
        amount: "₹1,200",
        dueDate: "Jan 15, 2024",
        status: "Paid",
        category: "Utilities",
        type: "Water",
        paymentDate: "Jan 14, 2024",
        transactionId: "TXN87654321"
    }
]

const MOCK_ACTIVITIES: ActivityItem[] = [
    {
        id: 1,
        title: "Maintenance Paid",
        subtitle: "₹5,000 paid for January",
        time: "2 days ago",
        iconType: "payment",
        iconColor: "text-green-600",
        bg: "bg-green-50"
    },
    {
        id: 2,
        title: "Visitor Approved",
        subtitle: "Rahul Sharma - Delivery",
        time: "3 days ago",
        iconType: "visitor",
        iconColor: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: 3,
        title: "Complaint Resolved",
        subtitle: "Plumbing issue fixed",
        time: "5 days ago",
        iconType: "complaint",
        iconColor: "text-orange-600",
        bg: "bg-orange-50"
    },
]

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 1,
        title: "Maintenance Due",
        description: "Your monthly maintenance is due on Feb 5",
        time: "2h ago",
        type: "payment",
        read: false,
    },
    {
        id: 2,
        title: "Community Event",
        description: "Republic Day celebration at clubhouse",
        time: "5h ago",
        type: "event",
        read: false,
    },
    {
        id: 3,
        title: "Water Supply Notice",
        description: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for tank cleaning",
        time: "1d ago",
        type: "notice",
        read: false,
    },
    {
        id: 4,
        title: "Special Offer",
        description: "Get 20% off on annual maintenance payment",
        time: "2d ago",
        type: "offer",
        read: true,
    },
    {
        id: 5,
        title: "Security Alert",
        description: "New visitor management system activated",
        time: "3d ago",
        type: "security",
        read: true,
    },
    {
        id: 6,
        title: "AGM Reminder",
        description: "Annual General Meeting scheduled for Feb 15",
        time: "5d ago",
        type: "meeting",
        read: true,
    },
]

const MOCK_VISITORS: VisitorItem[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        type: "Delivery",
        code: "4521",
        time: "Expected today, 2:00 PM",
        status: "Expected",
    },
    {
        id: 2,
        name: "Priya Singh",
        type: "Guest",
        code: "9087",
        time: "Today, 6:00 PM",
        status: "Inside",
    },
    {
        id: 3,
        name: "Uber Cab",
        type: "Cab",
        code: "WB-02-1234",
        time: "Yesterday",
        status: "Left",
    },
]

const MOCK_AMENITIES: AmenityItem[] = [
    {
        id: "pool",
        name: "Swimming Pool",
        description: "Olympic sized pool with temperature control. Features include dedicated lanes and kids area.",
        status: "Open",
        timing: "6 AM - 10 PM",
        iconType: "pool",
        imageGradient: "linear-gradient(to bottom right, #3b82f6, #1d4ed8)",
        rules: ["Shower before entering", "Proper swimwear required", "No food or drink in pool area"],
    },
    {
        id: "gym",
        name: "Fitness Center",
        description: "Fully equipped gym with cardio and weights. Personal trainers available on request.",
        status: "Open",
        timing: "5 AM - 11 PM",
        iconType: "gym",
        imageGradient: "linear-gradient(to bottom right, #f97316, #ea580c)",
        rules: ["Carry a towel", "Clean equipment after use", "Sports shoes mandatory"],
    },
    {
        id: "clubhouse",
        name: "Club House",
        description: "For parties, events and indoor games. Includes banquet hall and pantry.",
        status: "Booked Today",
        timing: "9 AM - 11 PM",
        iconType: "clubhouse",
        imageGradient: "linear-gradient(to bottom right, #9333ea, #7e22ce)",
        rules: ["No loud music after 10 PM", "Clean up after event", "Max capacity 50 pax"],
    },
    {
        id: "conference",
        name: "Conf. Room",
        description: "Quiet space for meetings and work. High-speed internet available.",
        status: "Open",
        timing: "24/7",
        iconType: "conference",
        imageGradient: "linear-gradient(to bottom right, #4b5563, #374151)",
        rules: ["Keep noise to minimum", "No food allowed inside"],
    },
]

// --- API Methods ---

// In a real app, these would be async fetch calls to your backend
export const api = {
    getActivities: async (): Promise<ActivityItem[]> => {
        // await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
        return MOCK_ACTIVITIES
    },

    getNotifications: async (): Promise<NotificationItem[]> => {
        return MOCK_NOTIFICATIONS
    },

    getVisitors: async (): Promise<VisitorItem[]> => {
        return MOCK_VISITORS
    },

    getAmenities: async (): Promise<AmenityItem[]> => {
        return MOCK_AMENITIES
    },

    getAmenityById: async (id: string): Promise<AmenityItem | undefined> => {
        return MOCK_AMENITIES.find(a => a.id === id)
    },

    getServiceRequests: async (): Promise<ServiceRequestItem[]> => {
        return MOCK_SERVICE_REQUESTS
    },

    getPayments: async (): Promise<PaymentItem[]> => {
        return MOCK_PAYMENTS
    }
}

// --- Helper to map string types to Icons (Frontend Only) ---
// This keeps the data pure JSON (string) while the UI handles the visual component

export const getIconForType = (type: string) => {
    switch (type) {
        // Activities
        case "payment": return CreditCard
        case "visitor": return UserPlus
        case "complaint": return AlertTriangle

        // Notifications
        case "event": return Calendar
        case "notice": return MessageSquare
        case "offer": return Tag
        case "security": return Shield
        case "meeting": return Users

        // Visitors
        case "Delivery": return Truck
        case "Guest": return Users // reusing Users for Guest generic
        case "Cab": return Car

        // Amenities
        case "pool": return Waves
        case "gym": return Dumbbell
        case "clubhouse": return PartyPopper
        case "conference": return Users

        // Service Requests
        case "Plumber": return Waves
        case "Electrician": return Zap
        case "Carpenter": return Hammer
        case "Appliance": return Package
        case "Others": return MessageSquare

        // Payments
        case "Maintenance": return Home
        case "Electricity": return Zap
        case "Water": return Droplets
        case "Gas": return Flame
        case "Rent": return Home
        case "Penalty": return AlertCircle
        case "EV": return PlugZap
        case "Event": return PartyPopper

        default: return AlertTriangle
    }
}
