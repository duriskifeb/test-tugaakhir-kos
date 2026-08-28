import { Home, Plus } from "lucide-react";

export default async function HousesPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Cabang Kos</h1>
          <p className="text-gray-500 mt-1">
            Kelola berbagai properti kos Anda beserta alamat dan fasilitasnya.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3b23c6] text-white rounded-lg font-medium hover:bg-[#321ca8] transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Cabang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Segera Hadir: Multi-Cabang</h3>
        <p className="text-gray-500 max-w-md">
          Fitur untuk menambah dan mengelola lebih dari satu cabang kos sedang dalam tahap pengembangan.
        </p>
      </div>
    </div>
  );
}
