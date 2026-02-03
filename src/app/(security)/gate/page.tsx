import { Shield, Truck, Users } from "lucide-react"

export default function GateDashboard() {
    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Security Gate</h1>
                    <p className="text-gray-500">Main Gate Entry Operations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group">
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-100">
                        <Users size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Verify Guest</h3>
                    <p className="text-sm text-gray-500 mt-1">Check visitor code</p>
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group">
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-100">
                        <Truck size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Delivery Entry</h3>
                    <p className="text-sm text-gray-500 mt-1">Log courier/food</p>
                </button>
            </div>
        </div>
    )
}
