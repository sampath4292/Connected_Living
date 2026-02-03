export type UserRole = "resident" | "security" | "facility" | "technician" | "admin"

export interface User {
    id: string
    name: string
    username: string // mapped from "name" in user request
    role: UserRole
    password: string // plain text for this mock
    redirectPath: string
}

export const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Resident User",
        username: "user",
        role: "resident",
        password: "User@123",
        redirectPath: "/dashboard",
    },
    {
        id: "2",
        name: "Security Guard",
        username: "security",
        role: "security",
        password: "Security@123",
        redirectPath: "/gate",
    },
    {
        id: "3",
        name: "Facility Manager",
        username: "facility",
        role: "facility",
        password: "Facility@123",
        redirectPath: "/work-orders",
    },
    {
        id: "4",
        name: "Service Technician",
        username: "service",
        role: "technician",
        password: "Service@123",
        redirectPath: "/jobs",
    },
    {
        id: "5",
        name: "Community Admin",
        username: "admin",
        role: "admin",
        password: "Admin@123",
        redirectPath: "/admin", // Updated from /admin/dashboard
    },
]

export function authenticate(username: string, password: string): User | null {
    const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
    )
    return user || null
}
