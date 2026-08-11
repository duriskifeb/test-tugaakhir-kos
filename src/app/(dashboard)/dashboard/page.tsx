"use client";

import { 
  Calendar, 
  ArrowUpRight, 
  ArrowRight,
  PlusSquare,
  Home,
  UserPlus,
  CheckCircle2,
  BellRing
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Alex</h1>
          <p className="text-gray-500 mt-1">Here is what&apos;s happening across your properties today.</p>
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">Last 7 Days</button>
          <button className="px-4 py-1.5 text-sm font-bold text-white bg-[#3b23c6] rounded-md shadow-sm">Last 30 Days</button>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <button className="p-1.5 text-gray-500 hover:text-gray-900">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Occupancy Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[#3b23c6]">92%</span>
            <span className="flex items-center text-xs font-semibold text-green-600 mb-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2.4%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#3b23c6] w-[92%] h-full rounded-full" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Monthly Revenue</h3>
          <span className="text-2xl font-bold text-gray-900">$12,400</span>
          <span className="flex items-center text-xs font-medium text-green-600 mt-2">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +$1.2k vs last month
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Available Rooms</h3>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-900">8</span>
            <span className="text-xs text-gray-500 mb-1">/ 120 total</span>
          </div>
          <span className="text-xs text-gray-500 mt-2">Avg. time to fill: 4 days</span>
        </div>

        {/* Metric 4 (Highlighted) */}
        <div className="bg-[#f5f3ff] border border-[#d8b4fe] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-[#3b23c6] mb-1">Pending Bookings</h3>
          <span className="text-2xl font-bold text-gray-900">15</span>
          <button className="flex items-center text-xs font-bold text-[#3b23c6] hover:underline mt-2">
            Review all <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">New Tenants</h3>
          <span className="text-2xl font-bold text-gray-900">12</span>
          <div className="flex items-center mt-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white z-10" />
            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white -ml-2 z-20" />
            <div className="w-6 h-6 rounded-full bg-[#3b23c6] border-2 border-white -ml-2 z-30 flex items-center justify-center text-[8px] font-bold text-white">
              +9
            </div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Profit (Net)</h3>
          <span className="text-2xl font-bold text-gray-900">$8,200</span>
          <span className="text-xs text-gray-500 mt-2">66.1% Margin</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Trend Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Revenue Trend</h2>
                <p className="text-sm text-gray-500 mt-1">Performance over the last 6 months</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3b23c6]" />
                  <span className="text-xs font-bold text-[#3b23c6]">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Expenses</span>
                </div>
              </div>
            </div>
            
            {/* Chart Skeleton (SVG Curve) */}
            <div className="h-64 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-full h-px bg-gray-100" />
                ))}
              </div>
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 0,80 Q 25,70 50,50 T 100,30" fill="none" stroke="#3b23c6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-[10px] font-semibold text-gray-500 uppercase">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>

          {/* Updates & Occupancy Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Recent Updates */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900">Recent Updates</h2>
                <button className="text-xs font-bold text-[#3b23c6] hover:underline">View all</button>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#bbf7d0] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment received from Room 402</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago • $450.00</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New booking request: Unit A-12</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago • John Doe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupancy by Property */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-6">Occupancy by Property</h2>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                    <span>The Grand Dormitory</span>
                    <span>98%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3b23c6] w-[98%] h-full rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                    <span>Silicon Valley House</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3b23c6] w-[85%] h-full rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                    <span>Green Park Suites</span>
                    <span>91%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3b23c6] w-[91%] h-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-8">
          
          {/* Promo Card */}
          <div className="bg-[#4f46e5] rounded-2xl p-6 shadow-lg text-white">
            <h2 className="text-xl font-bold mb-2">Launch your site</h2>
            <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
              Create a stunning booking website for your boarding houses in minutes. No coding required.
            </p>
            <button className="w-full bg-white text-[#4f46e5] font-bold py-3 px-4 rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Open Website Builder
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#3b23c6] hover:bg-[#f5f3ff] transition-all group">
                <Home className="w-5 h-5 text-[#3b23c6]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add Boarding House</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#3b23c6] hover:bg-[#f5f3ff] transition-all group">
                <PlusSquare className="w-5 h-5 text-[#3b23c6]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add New Room</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#3b23c6] hover:bg-[#f5f3ff] transition-all group">
                <UserPlus className="w-5 h-5 text-[#3b23c6]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Register Tenant</span>
              </button>
            </div>
          </div>

          {/* Live Portfolio Map Placeholder */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-48 relative overflow-hidden flex flex-col">
            <h2 className="text-xs font-bold text-gray-900 bg-white px-2 py-1 absolute top-4 left-4 z-10 rounded shadow-sm">Live Portfolio Map</h2>
            <div className="absolute inset-0 bg-[#e2e8f0] opacity-50 flex items-center justify-center">
              <div className="w-full h-full bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#3b23c6] rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(59,35,198,0.2)]" />
            <div className="absolute top-1/3 left-1/4 transform w-3 h-3 bg-[#3b23c6] rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(59,35,198,0.2)]" />
          </div>
        </div>
      </div>

    </div>
  );
}
