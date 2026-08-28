"use client";

import { 
  Calendar, 
  ArrowUpRight, 
  ArrowRight,
  PlusSquare,
  Home,
  UserPlus,
  CheckCircle2,
  BellRing,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { OnboardingWizard } from "@/components/modules/OnboardingWizard";

export function DashboardClient({ 
  boardingHouse,
  userName,
  role = "tenant",
  metrics
}: { 
  boardingHouse: { id: string; status: string } | null;
  userName: string;
  role?: string;
  metrics?: {
    occupancyRate: number;
    monthlyRevenue: number;
    availableRooms: number;
    totalRooms: number;
    pendingBookings: number;
    newTenants: number;
  };
}) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Jika Belum Punya Kos (Fase 2)
  if (!boardingHouse) {
    if (role === "staff") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-[#3b23c6]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Selamat Datang, staff baru!</h1>
          <p className="text-gray-500 max-w-md mb-8 text-base">
            Akun Anda belum ditugaskan untuk mengelola properti kos manapun. Silakan hubungi Pemilik Kos untuk menambahkan Anda ke dalam sistem mereka.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <Home className="w-10 h-10 text-[#3b23c6]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Selamat Datang, {userName}!</h1>
        <p className="text-gray-500 max-w-md mb-8 text-base">
          Anda selangkah lagi untuk mengelola bisnis kos Anda dengan lebih mudah. Mari mulai dengan mendaftarkan properti kos pertama Anda.
        </p>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="bg-[#3b23c6] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#321ca8] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <PlusSquare className="w-5 h-5" />
          Daftarkan Kos Pertama Anda
        </button>

        <OnboardingWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      </div>
    );
  }

  // Jika Sudah Punya Kos (Fase 4 & 5)
  const isUnverified = boardingHouse.status === 'UNVERIFIED';

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      
      {/* Banner UNVERIFIED */}
      {isUnverified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-4 items-start shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-800">Menunggu Verifikasi Admin</h3>
            <p className="text-sm text-amber-700 mt-1">
              Kos Anda telah berhasil didaftarkan namun saat ini belum ditinjau oleh Admin. Anda tetap bisa mengatur kamar dan fasilitas, namun fitur publikasi website sementara ditahan hingga proses verifikasi selesai.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {userName}</h1>
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
            <span className="text-2xl font-bold text-[#3b23c6]">{metrics?.occupancyRate || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#3b23c6] h-full rounded-full transition-all duration-1000" style={{ width: `${metrics?.occupancyRate || 0}%` }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Monthly Revenue</h3>
          <span className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(metrics?.monthlyRevenue || 0)}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Available Rooms</h3>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-900">{metrics?.availableRooms || 0}</span>
            <span className="text-xs text-gray-500 mb-1">/ {metrics?.totalRooms || 0} total</span>
          </div>
        </div>

        {/* Metric 4 (Highlighted) */}
        <div className="bg-[#f5f3ff] border border-[#d8b4fe] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-[#3b23c6] mb-1">Pending Bookings</h3>
          <span className="text-2xl font-bold text-gray-900">{metrics?.pendingBookings || 0}</span>
          <button className="flex items-center text-xs font-bold text-[#3b23c6] hover:underline mt-2">
            Review all <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Active Tenants</h3>
          <span className="text-2xl font-bold text-gray-900">{metrics?.newTenants || 0}</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Profit (Net)</h3>
          <span className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((metrics?.monthlyRevenue || 0) * 0.85)}
          </span>
          <span className="text-xs text-gray-500 mt-2">Est. 85% Margin</span>
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
            <button 
              disabled={isUnverified}
              className="w-full bg-white text-[#4f46e5] font-bold py-3 px-4 rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Home className="w-4 h-4" />
              Open Website Builder
            </button>
            {isUnverified && (
              <p className="text-[10px] text-center mt-2 opacity-80">
                Tersedia setelah akun Anda diverifikasi
              </p>
            )}
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
