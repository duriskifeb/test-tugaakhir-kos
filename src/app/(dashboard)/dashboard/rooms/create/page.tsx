"use client";

import { useState } from "react";
import { createRoom } from "../actions";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Facilities state
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState("");

  const handleAddFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility("");
    }
  };

  const handleRemoveFacility = (fac: string) => {
    setFacilities(facilities.filter(f => f !== fac));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("facilities", JSON.stringify(facilities));

    try {
      const result = await createRoom(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rooms" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kamar Baru</h1>
          <p className="text-gray-500 mt-1">Masukkan detail tipe kamar yang akan disewakan.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama / Tipe Kamar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Contoh: Kamar VIP A, Standard Room"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Harga per Bulan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="1500000"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status Ketersediaan <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="available">Tersedia (Bisa Disewa)</option>
                <option value="occupied">Terisi (Sudah Disewa)</option>
                <option value="maintenance">Perbaikan (Maintenance)</option>
              </select>
            </div>

            {/* Fasilitas */}
            <div className="group md:col-span-2 border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Fasilitas Kamar
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFacility();
                    }
                  }}
                  placeholder="Contoh: AC, WiFi, Kasur Springbed..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddFacility}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                >
                  Tambah
                </button>
              </div>
              
              {facilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-[#ede9fe] text-[#3b23c6] px-3 py-1.5 rounded-lg text-sm font-medium">
                      {fac}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFacility(fac)}
                        className="text-[#3b23c6] hover:text-red-600 ml-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3b23c6] text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-[#2d1b99] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Simpan Kamar Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
