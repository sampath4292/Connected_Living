import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-[#1a237e] mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Overview of community performance and requests.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium text-sm">Total Residents</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,245</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium text-sm">Pending Payments</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">₹4.2L</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium text-sm">Open Complaints</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">18</p>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
                    View Resident View
                </Link>
            </div>
        </div>
    )
}
