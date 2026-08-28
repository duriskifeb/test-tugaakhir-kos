import { BarChart3 } from "lucide-react";

export default async function ReportsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik (Reports)</h1>
        <p className="text-gray-500 mt-1">
          Lihat grafik pendapatan, tingkat hunian, dan performa bisnis kos Anda.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Segera Hadir: Laporan Mendalam</h3>
        <p className="text-gray-500 max-w-md">
          Fitur analitik dan grafik laporan lengkap sedang dalam tahap pengembangan.
        </p>
      </div>
    </div>
  );
}
