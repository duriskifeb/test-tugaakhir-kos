"use client";

import { useState } from "react";
import { setupBoardingHouse } from "@/app/(dashboard)/dashboard/actions";
import { Loader2, Home, MapPin, AlignLeft, Globe } from "lucide-react";

export function OnboardingWizard({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await setupBoardingHouse(formData);
      onClose(); // Close modal on success (and page will revalidate)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#3b23c6] p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Daftarkan Kos Anda</h2>
          <p className="text-indigo-100 text-sm mt-1">Lengkapi informasi dasar untuk memulai manajemen kos Anda.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <Home className="w-4 h-4 text-gray-500" />
              Nama Kos
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Misal: Kos Melati Asri"
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3b23c6]/20 focus:border-[#3b23c6] outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              Subdomain (Opsional)
            </label>
            <div className="flex">
              <input
                type="text"
                name="subdomain"
                placeholder="kos-melati-asri"
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-l-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3b23c6]/20 focus:border-[#3b23c6] outline-none transition-all placeholder:text-gray-400"
              />
              <div className="bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl px-4 py-3 text-sm text-gray-500 font-medium">
                .pintuberkah.com
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Biarkan kosong untuk dibuat otomatis dari nama kos.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Alamat Lengkap
            </label>
            <textarea
              name="address"
              required
              rows={2}
              placeholder="Jl. Mawar No. 123, Jakarta Selatan"
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3b23c6]/20 focus:border-[#3b23c6] outline-none transition-all placeholder:text-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-gray-500" />
              Deskripsi & Fasilitas Singkat
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Kos putra/putri, free wifi, kamar mandi dalam..."
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3b23c6]/20 focus:border-[#3b23c6] outline-none transition-all placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#3b23c6] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#321ca8] transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan & Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
