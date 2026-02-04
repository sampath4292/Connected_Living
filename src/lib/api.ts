import {
    CreditCard, UserPlus, AlertTriangle, Calendar, MessageSquare, Tag, Shield, Users,
    Truck, Car, Waves, Dumbbell, PartyPopper, Zap, Wrench, Package, Hammer, Droplets, Receipt, Flame, AlertCircle, PlugZap,
    Megaphone, ClipboardList, Boxes, UserCheck, Radio, Home
} from "lucide-react"

// --- Types ---

// 1. Core Entities
export interface UserItem {
    id: string
    name: string
    role: "Resident" | "Admin" | "Security" | "FacilityManager" | "Technician"
    unitId?: string // Link to Unit (if Resident)
    avatar?: string
    phone: string
    email: string
}

export interface UnitItem {
    id: string // e.g., "A-101"
    tower: string
    floor: number
    number: string
    residentId?: string // Link to current resident
    status: "Occupied" | "Vacant" | "Owner"
}

// 2. Modules
export interface ActivityItem {
    id: number
    userId: string // Who did this?
    title: string
    subtitle: string
    time: string
    iconType: "payment" | "visitor" | "complaint" | "default"
    bg: string
    iconColor: string
}

export interface NotificationItem {
    id: number
    userId?: string // Specific user or null for broadcast
    title: string
    description: string
    time: string
    type: "payment" | "event" | "notice" | "offer" | "security" | "meeting"
    read: boolean
}

export interface VisitorItem {
    id: number
    unitId: string // Which unit are they visiting?
    hostName: string // For Security to know who invited
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
    iconType: "pool" | "gym" | "clubhouse" | "conference" | "tennis"
    imageGradient: string
    rules?: string[]
}

export interface ServiceRequestItem {
    id: string
    unitId: string // Requesting unit
    category: "Electrician" | "Plumber" | "Carpenter" | "Appliance" | "Others"
    title: string
    description: string
    status: "Open" | "In Progress" | "Resolved" | "Closed"
    date: string
    urgency: "Low" | "Medium" | "High"
    image?: string
    assignedTo?: string // Staff ID
}

export interface PaymentItem {
    id: string
    unitId: string // Billed unit
    title: string
    amount: string
    dueDate: string
    status: "Pending" | "Paid" | "Overdue"
    category: "Utilities" | "Rentals"
    type: "Maintenance" | "Electricity" | "Water" | "Gas" | "Rent" | "Penalty" | "EV" | "Event" | "Other"
    paymentDate?: string
    transactionId?: string
}

export interface StaffItem {
    id: string
    name: string
    role: "Plumber" | "Electrician" | "Cleaner" | "Security" | "Manager"
    status: "Available" | "Busy" | "Off Duty"
    phone: string
}

export interface InventoryItem {
    id: string
    name: string
    category: "Electrical" | "Plumbing" | "Cleaning" | "Office"
    quantity: number
    status: "In Stock" | "Low Stock" | "Out of Stock"
}

export interface NoticeItem {
    id: string
    title: string
    content: string
    date: string
    type: "General" | "Emergency" | "Event"
    audience: "All" | "Residents Only" | "Staff Only"
}

export interface FamilyMemberItem {
    id: string
    name: string
    relation: "Spouse" | "Child" | "Parent" | "Sibling" | "Other"
    age: string
    avatar?: string
    phone?: string
    accessLevel?: "Full" | "Limited" | "None"
}

export interface VehicleItem {
    id: string
    userId: string
    type: "Car" | "Bike"
    category: "EV" | "ICE" // ICE = Internal Combustion Engine
    registrationNumber: string
    model?: string
    color?: string
}

export interface CommunityMessageItem {
    id: number
    sender: string
    role: "security" | "resident" | "admin" | "me"
    text: string
    time: string
    avatar: string
    color: string
}

export interface CommunityEventItem {
    id: number
    title: string
    time: string
    location: string
    participants: number
    imageGradient: string
    description?: string
    organizer?: string
    rsvpStatus?: "going" | "not_going" | "pending"
    price?: string
}

export type InviteParams =
    | { type: "Guest"; name: string; phone?: string; email?: string; date: string; time: string; singleEntry: boolean }
    | { type: "Delivery"; vendor: string; name?: string; phone?: string; date: string; time?: string }
    | { type: "Cab"; driverName: string; vehicleNo: string; service: string; date: string; time?: string; model?: string }


// --- Mock Data (Central Database) ---

const MOCK_USERS: UserItem[] = [
    { id: "U-001", name: "Vikram", role: "Resident", unitId: "A-101", phone: "+91 98765 43210", email: "vikram@email.com" },
    { id: "U-002", name: "Admin User", role: "Admin", phone: "+91 99999 88888", email: "admin@society.com" },
    { id: "U-003", name: "Ramesh Guard", role: "Security", phone: "+91 77777 66666", email: "gate@society.com" },
]

const MOCK_UNITS: UnitItem[] = [
    { id: "A-101", tower: "A", floor: 1, number: "101", residentId: "U-001", status: "Occupied" },
    { id: "A-102", tower: "A", floor: 1, number: "102", status: "Vacant" },
]

const MOCK_STAFF: StaffItem[] = [
    { id: "S-001", name: "Suresh Electrician", role: "Electrician", status: "Available", phone: "9876500001" },
    { id: "S-002", name: "Mahesh Plumber", role: "Plumber", status: "Busy", phone: "9876500002" },
]

const MOCK_INVENTORY: InventoryItem[] = [
    { id: "I-001", name: "LED Bulbs (9W)", category: "Electrical", quantity: 45, status: "In Stock" },
    { id: "I-002", name: "Tap Washers", category: "Plumbing", quantity: 12, status: "Low Stock" },
]

const MOCK_SERVICE_REQUESTS: ServiceRequestItem[] = [
    {
        id: "SR-1023",
        unitId: "A-101",
        category: "Plumber",
        title: "Leaking Kitchen Sink",
        description: "Water is dripping continuously from the main tap.",
        status: "In Progress",
        date: "Today, 10:30 AM",
        urgency: "High",
        assignedTo: "S-002"
    },
    {
        id: "SR-0998",
        unitId: "A-101",
        category: "Electrician",
        title: "Bedroom Switch Fault",
        description: "Main light switch sparking when turned on.",
        status: "Resolved",
        date: "Jan 28, 2024",
        urgency: "Medium",
        assignedTo: "S-001"
    },
    {
        id: "SR-0992",
        unitId: "A-101",
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
    { id: "PAY-102", unitId: "A-101", title: "Electricity Bill - Jan 2024", amount: "₹2,450", dueDate: "Feb 10, 2024", status: "Pending", category: "Utilities", type: "Electricity" },
    { id: "PAY-105", unitId: "A-101", title: "Pipe Gas Bill", amount: "₹850", dueDate: "Feb 12, 2024", status: "Pending", category: "Utilities", type: "Gas" },
    { id: "PAY-106", unitId: "A-101", title: "Water Charges", amount: "₹450", dueDate: "Feb 15, 2024", status: "Pending", category: "Utilities", type: "Water" },

    // RENTALS & CHARGES
    { id: "PAY-101", unitId: "A-101", title: "Monthly Maintenance - Feb 2024", amount: "₹5,000", dueDate: "Feb 05, 2024", status: "Pending", category: "Rentals", type: "Maintenance" },
    { id: "PAY-107", unitId: "A-101", title: "Monthly Rent", amount: "₹25,000", dueDate: "Feb 01, 2024", status: "Overdue", category: "Rentals", type: "Rent" },
    { id: "PAY-108", unitId: "A-101", title: "Late Payment Penalty", amount: "₹500", dueDate: "Immediate", status: "Pending", category: "Rentals", type: "Penalty" },
    { id: "PAY-109", unitId: "A-101", title: "EV Charging Station - Usage", amount: "₹1,200", dueDate: "Feb 08, 2024", status: "Pending", category: "Rentals", type: "EV" },

    // HISTORY
    { id: "PAY-110", unitId: "A-101", title: "New Year Event Contribution", amount: "₹2,000", dueDate: "Jan 15, 2024", status: "Paid", category: "Rentals", type: "Event", paymentDate: "Jan 10, 2024" },
    { id: "PAY-099", unitId: "A-101", title: "Quarterly Water Charges", amount: "₹1,200", dueDate: "Jan 15, 2024", status: "Paid", category: "Utilities", type: "Water", paymentDate: "Jan 14, 2024", transactionId: "TXN87654321" }
]

const MOCK_ACTIVITIES: ActivityItem[] = [
    { id: 1, userId: "A-101", title: "Maintenance Paid", subtitle: "₹5,000 paid for January", time: "2 days ago", iconType: "payment", iconColor: "text-green-600", bg: "bg-green-50" },
    { id: 2, userId: "A-101", title: "Visitor Approved", subtitle: "Rahul Sharma - Delivery", time: "3 days ago", iconType: "visitor", iconColor: "text-blue-600", bg: "bg-blue-50" },
    { id: 3, userId: "A-101", title: "Complaint Resolved", subtitle: "Plumbing issue fixed", time: "5 days ago", iconType: "complaint", iconColor: "text-orange-600", bg: "bg-orange-50" },
]

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    { id: 1, title: "Maintenance Due", description: "Your monthly maintenance is due on Feb 5", time: "2h ago", type: "payment", read: false },
    { id: 2, title: "Community Event", description: "Republic Day celebration at clubhouse", time: "5h ago", type: "event", read: false },
    { id: 3, title: "Water Supply Notice", description: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for tank cleaning", time: "1d ago", type: "notice", read: false },
    { id: 4, title: "New Message from Ramesh", description: "Notice: Water tanker has arrived at Gate 1.", time: "10:30 AM", type: "notice", read: false }, // Synced with Chat
    { id: 5, title: "Event Update", description: "Morning Yoga Workshop is starting in 30 mins!", time: "Sun, 6:30 AM", type: "event", read: true }, // Synced with Event
    { id: 6, title: "Security Alert", description: "New visitor management system activated", time: "3d ago", type: "security", read: true },
]

const MOCK_VISITORS: VisitorItem[] = [
    { id: 1, unitId: "A-101", hostName: "Vikram Singh", name: "Rahul Sharma", type: "Delivery", code: "4521", time: "Expected today, 2:00 PM", status: "Expected" },
    { id: 2, unitId: "A-101", hostName: "Vikram Singh", name: "Priya Singh", type: "Guest", code: "9087", time: "Today, 6:00 PM", status: "Inside" },
    { id: 3, unitId: "A-101", hostName: "Vikram Singh", name: "Uber Cab", type: "Cab", code: "WB-02-1234", time: "Yesterday", status: "Left" },
]

const MOCK_AMENITIES: AmenityItem[] = [
    { id: "pool", name: "Swimming Pool", description: "Olympic sized pool with temperature control.", status: "Open", timing: "6 AM - 10 PM", iconType: "pool", imageGradient: "linear-gradient(to bottom right, #3b82f6, #1d4ed8)", rules: ["Shower before entering"] },
    { id: "gym", name: "Fitness Center", description: "Fully equipped gym with cardio and weights.", status: "Open", timing: "5 AM - 11 PM", iconType: "gym", imageGradient: "linear-gradient(to bottom right, #f97316, #ea580c)", rules: ["Carry a towel"] },
    { id: "clubhouse", name: "Club House", description: "For parties, events and indoor games.", status: "Booked Today", timing: "9 AM - 11 PM", iconType: "clubhouse", imageGradient: "linear-gradient(to bottom right, #9333ea, #7e22ce)", rules: ["No loud music after 10 PM"] },
    { id: "conference", name: "Conf. Room", description: "Quiet space for meetings.", status: "Open", timing: "24/7", iconType: "conference", imageGradient: "linear-gradient(to bottom right, #4b5563, #374151)", rules: ["Keep noise to minimum"] },
    { id: "tennis", name: "Tennis Court", description: "Pro hard court with floodlights.", status: "Open", timing: "6 AM - 9 PM", iconType: "tennis", imageGradient: "linear-gradient(to bottom right, #10b981, #059669)", rules: ["Non-marking shoes"] },
]

const MOCK_NOTICES: NoticeItem[] = [
    { id: "N-001", title: "Lift Maintenance", content: "Lift A will be down for servicing on Sunday.", date: "Feb 3, 2024", type: "General", audience: "Residents Only" }
]

const MOCK_FAMILY_MEMBERS: FamilyMemberItem[] = [
    { id: "FM-001", name: "Priya Singh", relation: "Spouse", age: "32", phone: "9876543211", accessLevel: "Full" },
    { id: "FM-002", name: "Aarav Singh", relation: "Child", age: "8", accessLevel: "None" }
]

const MOCK_VEHICLES: VehicleItem[] = [
    { id: "V-001", userId: "U-001", type: "Car", category: "EV", registrationNumber: "KA 01 MG 1234", model: "Tata Nexon EV", color: "Blue" },
    { id: "V-002", userId: "U-001", type: "Bike", category: "ICE", registrationNumber: "KA 05 JJ 9988", model: "Royal Enfield", color: "Black" }
]

const MOCK_COMMUNITY_MESSAGES: CommunityMessageItem[] = [
    { id: 1, sender: "Ramesh (Security)", role: "security", text: "Notice: Water tanker has arrived at Gate 1.", time: "10:30 AM", avatar: "R", color: "bg-green-100 text-green-700" },
    { id: 2, sender: "Priya (B-402)", role: "resident", text: "Great, thanks Ramesh! Is the lift working now?", time: "10:32 AM", avatar: "P", color: "bg-pink-100 text-pink-700" },
    { id: 3, sender: "Rahul (A-101)", role: "resident", text: "Yes, I just used it. It's working fine.", time: "10:35 AM", avatar: "R", color: "bg-blue-100 text-blue-700" },
    { id: 4, sender: "Admin", role: "admin", text: "Please remember to separate dry and wet waste before disposal.", time: "11:00 AM", avatar: "A", color: "bg-gray-800 text-white" },
    { id: 5, sender: "Simran (C-505)", role: "resident", text: "Does anyone have a contact for a good carpenter?", time: "11:15 AM", avatar: "S", color: "bg-orange-100 text-orange-700" },
]

const MOCK_COMMUNITY_EVENTS: CommunityEventItem[] = [
    {
        id: 1,
        title: "Morning Yoga Workshop",
        time: "Sun, 7:00 AM",
        location: "Yoga Deck",
        participants: 12,
        imageGradient: "from-orange-400 to-pink-500",
        description: "Start your Sunday with a refreshing Hatha Yoga session led by certified instructor Meera. Suitable for all levels. Please bring your own mat.",
        organizer: "Health Club",
        price: "Free",
        rsvpStatus: "pending"
    },
    {
        id: 2,
        title: "Kids Art Competition",
        time: "Sat, 4:00 PM",
        location: "Clubhouse",
        participants: 28,
        imageGradient: "from-blue-400 to-indigo-500",
        description: "Annual art competition for kids aged 5-12. Theme: 'Future Cities'. Colors and paper will be provided. Exciting prizes for winners!",
        organizer: "Cultural Committee",
        price: "₹100",
        rsvpStatus: "pending"
    },
]


// --- API Methods ---
export const api = {
    // USER
    getUserProfile: async (): Promise<UserItem | undefined> => new Promise(resolve => setTimeout(() => resolve(MOCK_USERS[0]), 500)),
    updateUserProfile: async (data: Partial<UserItem>): Promise<UserItem> => {
        // Mock update: merge data into the first mock user
        Object.assign(MOCK_USERS[0], data)
        return new Promise(resolve => setTimeout(() => resolve(MOCK_USERS[0]), 500))
    },

    // FAMILY Methods
    getFamilyMembers: async (): Promise<FamilyMemberItem[]> => new Promise(resolve => setTimeout(() => resolve([...MOCK_FAMILY_MEMBERS]), 500)),
    addFamilyMember: async (member: Omit<FamilyMemberItem, "id">): Promise<FamilyMemberItem> => {
        const newMember = { ...member, id: `FM-${Date.now()}` }
        MOCK_FAMILY_MEMBERS.push(newMember)
        return new Promise(resolve => setTimeout(() => resolve(newMember), 500))
    },
    updateFamilyMember: async (id: string, data: Partial<FamilyMemberItem>): Promise<FamilyMemberItem | undefined> => {
        const index = MOCK_FAMILY_MEMBERS.findIndex(m => m.id === id)
        if (index !== -1) {
            Object.assign(MOCK_FAMILY_MEMBERS[index], data)
            return new Promise(resolve => setTimeout(() => resolve(MOCK_FAMILY_MEMBERS[index]), 500))
        }
        return undefined
    },
    deleteFamilyMember: async (id: string): Promise<boolean> => {
        const index = MOCK_FAMILY_MEMBERS.findIndex(m => m.id === id)
        if (index !== -1) {
            MOCK_FAMILY_MEMBERS.splice(index, 1)
            return new Promise(resolve => setTimeout(() => resolve(true), 500))
        }
        return false
    },

    // VEHICLE Methods
    getVehicles: async (): Promise<VehicleItem[]> => new Promise(resolve => setTimeout(() => resolve([...MOCK_VEHICLES]), 500)),
    addVehicle: async (vehicle: Omit<VehicleItem, "id" | "userId">): Promise<VehicleItem> => {
        const newVehicle = { ...vehicle, id: `V-${Date.now()}`, userId: "U-001" }
        MOCK_VEHICLES.push(newVehicle)
        return new Promise(resolve => setTimeout(() => resolve(newVehicle), 500))
    },
    updateVehicle: async (id: string, data: Partial<VehicleItem>): Promise<VehicleItem | undefined> => {
        const index = MOCK_VEHICLES.findIndex(v => v.id === id)
        if (index !== -1) {
            Object.assign(MOCK_VEHICLES[index], data)
            return new Promise(resolve => setTimeout(() => resolve(MOCK_VEHICLES[index]), 500))
        }
        return undefined
    },
    deleteVehicle: async (id: string): Promise<boolean> => {
        const index = MOCK_VEHICLES.findIndex(v => v.id === id)
        if (index !== -1) {
            MOCK_VEHICLES.splice(index, 1)
            return new Promise(resolve => setTimeout(() => resolve(true), 500))
        }
        return false
    },

    // AUTH & SECURITY
    sendOTP: async (target: string, type: 'email' | 'phone'): Promise<{ success: boolean, code: string }> => {
        // Mock sending OTP
        console.log(`Sending OTP to ${type} (${target}): 1234`)
        return new Promise(resolve => setTimeout(() => resolve({ success: true, code: "1234" }), 1000))
    },
    verifyOTP: async (input: string): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(input === "1234"), 500))
    },
    verifyPassword: async (input: string): Promise<boolean> => {
        // Mock current password check
        return new Promise(resolve => setTimeout(() => resolve(input === "password123"), 800))
    },
    changePassword: async (newPass: string): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(true), 1000))
    },

    // GENERAL DATA
    getActivities: async (): Promise<ActivityItem[]> => MOCK_ACTIVITIES,
    getNotifications: async (): Promise<NotificationItem[]> => MOCK_NOTIFICATIONS,
    markNotificationAsRead: async (id: number): Promise<boolean> => {
        const notif = MOCK_NOTIFICATIONS.find(n => n.id === id)
        if (notif) {
            notif.read = true
            return true
        }
        return false
    },
    markAllNotificationsAsRead: async (): Promise<boolean> => {
        MOCK_NOTIFICATIONS.forEach(n => n.read = true)
        return true
    },
    getUnreadCount: async (): Promise<number> => {
        return MOCK_NOTIFICATIONS.filter(n => !n.read).length
    },
    simulateLiveNotification: async (): Promise<NotificationItem> => {
        const newNotif: NotificationItem = {
            id: Date.now(),
            title: "New Community Message",
            description: "Admin: Please verify your vehicle details by evening.",
            time: "Just now",
            type: "notice",
            read: false
        }
        MOCK_NOTIFICATIONS.unshift(newNotif)
        return newNotif
    },

    getVisitors: async (): Promise<VisitorItem[]> => MOCK_VISITORS,
    getAmenities: async (): Promise<AmenityItem[]> => MOCK_AMENITIES,
    getAmenityById: async (id: string) => MOCK_AMENITIES.find(a => a.id === id),
    getServiceRequests: async (): Promise<ServiceRequestItem[]> => MOCK_SERVICE_REQUESTS,
    getPayments: async (): Promise<PaymentItem[]> => MOCK_PAYMENTS,

    // SECURITY Methods
    getGateEntries: async (): Promise<VisitorItem[]> => MOCK_VISITORS,
    verifyVisitorCode: async (code: string): Promise<VisitorItem | undefined> => MOCK_VISITORS.find(v => v.code === code),

    inviteVisitor: async (data: InviteParams): Promise<{ success: boolean; code?: string; message: string }> => {
        // Mock processing
        return new Promise(resolve => setTimeout(() => {
            const code = Math.floor(1000 + Math.random() * 9000).toString()

            // In a real app, this would save to DB and trigger SMS/Email or Security Notification
            const newVisitor: VisitorItem = {
                id: Date.now(),
                unitId: "A-101",
                hostName: "Vikram",
                name: "name" in data ? (data.name || data.vendor) : (data.driverName), // Fallback logic
                type: data.type,
                code: code,
                time: "time" in data && data.time ? `${data.date}, ${data.time}` : `${data.date}`,
                status: "Expected"
            }
            MOCK_VISITORS.unshift(newVisitor)

            if (data.type === 'Guest') {
                resolve({ success: true, code, message: "Invite Code Generated" })
            } else {
                resolve({ success: true, message: "Details shared with Security" })
            }
        }, 1200))
    },

    // FACILITY MANAGER Methods
    getAllServiceRequests: async (): Promise<ServiceRequestItem[]> => MOCK_SERVICE_REQUESTS,
    getStaff: async (): Promise<StaffItem[]> => MOCK_STAFF,
    getInventory: async (): Promise<InventoryItem[]> => MOCK_INVENTORY,

    // ADMIN Methods
    getOverviewStats: async () => ({
        residents: MOCK_USERS.length,
        units: MOCK_UNITS.length,
        pendingRequests: MOCK_SERVICE_REQUESTS.filter(r => r.status !== "Closed").length,
        outstandingPayments: MOCK_PAYMENTS.filter(p => p.status === "Pending" || p.status === "Overdue")
            .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0)
    }),
    getNotices: async (): Promise<NoticeItem[]> => MOCK_NOTICES,

    // COMMUNITY Methods
    getCommunityMessages: async (): Promise<CommunityMessageItem[]> => MOCK_COMMUNITY_MESSAGES,
    sendCommunityMessage: async (text: string): Promise<CommunityMessageItem> => {
        const newMsg: CommunityMessageItem = {
            id: Date.now(),
            sender: "You (A-204)",
            role: "me",
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: "Y",
            color: "bg-indigo-600 text-white"
        }
        MOCK_COMMUNITY_MESSAGES.push(newMsg)
        return newMsg
    },
    getCommunityEvents: async (): Promise<CommunityEventItem[]> => MOCK_COMMUNITY_EVENTS,
    getCommunityEventById: async (id: number): Promise<CommunityEventItem | undefined> => MOCK_COMMUNITY_EVENTS.find(e => e.id === id),
    rsvpEvent: async (id: number, status: "going" | "not_going"): Promise<boolean> => {
        // Mock API call to RSVP
        const event = MOCK_COMMUNITY_EVENTS.find(e => e.id === id)
        if (event) {
            event.rsvpStatus = status
            if (status === "going") event.participants++
            return true
        }
        return false
    }
}


// --- Helper to map string types to Icons ---
export const getIconForType = (type: string) => {
    switch (type) {
        case "payment": return CreditCard
        case "visitor": return UserPlus
        case "complaint": return AlertTriangle
        case "event": return Calendar
        case "notice": return MessageSquare
        case "offer": return Tag
        case "security": return Shield
        case "meeting": return Users
        case "Delivery": return Truck
        case "Guest": return Users
        case "Cab": return Car
        case "pool": return Waves
        case "gym": return Dumbbell
        case "clubhouse": return PartyPopper
        case "conference": return Users
        case "tennis": return Dumbbell // Placeholder
        case "Plumber": return Waves
        case "Electrician": return Zap
        case "Carpenter": return Hammer
        case "Appliance": return Package
        case "Others": return MessageSquare

        // Smart Home
        case "AC": return Waves
        case "Fan": return Zap // using Zap as placeholder for Fan
        case "Light": return Zap // using Zap as placeholder for Light
        case "TV": return Radio

        // Community
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
