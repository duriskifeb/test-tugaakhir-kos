import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, BedDouble, Trash2, Edit } from "lucide-react";
import { deleteRoom } from "./actions";

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get tenant ID
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    redirect("/dashboard");
  }

  // Fetch rooms
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("boarding_house_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
  }

  // Helper untuk memformat harga
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h1>
          <p className="text-gray-500 mt-1">Kelola daftar kamar, harga, dan ketersediaan.</p>
        </div>
        <Link
          href="/dashboard/rooms/create"
          className="bg-[#3b23c6] text-white rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-[#2d1b99] transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Kamar
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Info Kamar</th>
                <th className="px-6 py-4 font-semibold">Harga (Per Bulan)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Fasilitas</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5f3ff] text-[#3b23c6] rounded-xl flex items-center justify-center shrink-0">
                          <BedDouble className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{room.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {room.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatRupiah(room.price)}
                    </td>
                    <td className="px-6 py-4">
                      {room.status === "available" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
                          Tersedia
                        </span>
                      )}
                      {room.status === "occupied" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                          Terisi
                        </span>
                      )}
                      {room.status === "maintenance" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                          Perbaikan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {room.facilities && room.facilities.length > 0 ? (
                          room.facilities.slice(0, 3).map((f: string, i: number) => (
                            <span key={i} className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                              {f}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                        {room.facilities && room.facilities.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            +{room.facilities.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <form action={deleteRoom}>
                          <input type="hidden" name="id" value={room.id} />
                          <button 
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BedDouble className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada kamar</h3>
                      <p className="text-sm text-gray-500 max-w-sm mb-6">Anda belum menambahkan kamar apa pun ke dalam katalog kos Anda.</p>
                      <Link
                        href="/dashboard/rooms/create"
                        className="bg-white border border-gray-200 text-gray-700 rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
                      >
                        Tambah Kamar Pertama
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
