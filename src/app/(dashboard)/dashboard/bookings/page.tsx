import { CalendarCheck } from "lucide-react";

export default async function BookingsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pemesanan (Bookings)</h1>
        <p className="text-gray-500 mt-1">
          Pantau pengajuan pemesanan kamar dari calon penyewa yang datang melalui website Anda.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <CalendarCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Segera Hadir: Sistem Pemesanan Online</h3>
        <p className="text-gray-500 max-w-md">
          Fitur untuk menerima pemesanan kamar secara otomatis dari website publik sedang dalam pengembangan.
        </p>
      </div>
    </div>
  );
}
