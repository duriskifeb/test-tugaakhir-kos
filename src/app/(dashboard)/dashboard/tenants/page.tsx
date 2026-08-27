import { Users, Plus } from "lucide-react";

export default async function TenantsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Penghuni (Tenants)</h1>
          <p className="text-gray-500 mt-1">
            Kelola data diri penyewa yang menghuni kamar di kos Anda.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3b23c6] text-white rounded-lg font-medium hover:bg-[#321ca8] transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Penghuni
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Penghuni</h3>
        <p className="text-gray-500 max-w-md">
          Anda belum mendaftarkan penghuni mana pun ke dalam sistem. Tambahkan penghuni pertama Anda untuk mulai mencatat tagihan.
        </p>
      </div>
    </div>
  );
}
