"use client";

import { useState } from "react";
import { saveWebsiteSettings } from "./actions";
import { Loader2, Save, LayoutTemplate, Type, Palette, MonitorSmartphone, CheckCircle2 } from "lucide-react";

export function BuilderForm({ 
  tenant, 
  heroData, 
  featuresData 
}: { 
  tenant: any;
  heroData: any;
  featuresData: any;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Real-time state untuk preview iframe
  const [refreshKey, setRefreshKey] = useState(0);

  const theme = tenant.theme || { primaryColor: "#3b23c6", fontFamily: "Inter" };
  const features = featuresData?.items || [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await saveWebsiteSettings(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success });
        // Paksa refresh iframe dengan mengubah key
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
      
      {/* Kiri: Editor Form */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#3b23c6]" />
            Website Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sesuaikan tampilan landing page kos Anda.</p>
        </div>

        <form id="builder-form" onSubmit={handleSubmit} className="p-6 space-y-8 flex-1">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}

          {/* 1. Pengaturan Tema */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
              <Palette className="w-4 h-4" />
              Tema Visual
            </h2>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Warna Utama (Primary Color)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="primaryColor" 
                  defaultValue={theme.primaryColor}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm text-gray-500">Pilih warna dominan brand Anda</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Jenis Huruf (Font)</label>
              <select name="fontFamily" defaultValue={theme.fontFamily} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]">
                <option value="Inter">Inter (Modern & Bersih)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Elegan)</option>
                <option value="Merriweather">Merriweather (Klasik Serif)</option>
              </select>
            </div>
          </div>

          {/* 2. Hero Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
              <Type className="w-4 h-4" />
              Teks Pembuka (Hero)
            </h2>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Besar (Headline)</label>
              <input type="text" name="heroTitle" defaultValue={heroData?.title || ""} placeholder="Kos Eksklusif Ternyaman" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" required />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sub-judul (Penjelasan)</label>
              <textarea name="heroSubtitle" defaultValue={heroData?.subtitle || ""} placeholder="Berada di pusat kota dengan fasilitas lengkap..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6] resize-none" required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Teks Tombol Aksi</label>
              <input type="text" name="heroCtaText" defaultValue={heroData?.ctaText || "Lihat Kamar"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" required />
            </div>
          </div>

          {/* 3. Fasilitas Unggulan */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-gray-900 tracking-wider uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
              <CheckCircle2 className="w-4 h-4" />
              Keunggulan Kos (3 Poin)
            </h2>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Keunggulan 1</label>
              <input type="text" name="feature1Text" defaultValue={features[0]?.text || ""} placeholder="Lokasi Strategis" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Keunggulan 2</label>
              <input type="text" name="feature2Text" defaultValue={features[1]?.text || ""} placeholder="Keamanan 24 Jam" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Keunggulan 3</label>
              <input type="text" name="feature3Text" defaultValue={features[2]?.text || ""} placeholder="Kamar Mandi Dalam" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
          <button
            form="builder-form"
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b23c6] text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-[#2d1b99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Terapkan & Simpan
          </button>
        </div>
      </div>

      {/* Kanan: Live Preview */}
      <div className="hidden lg:flex w-2/3 bg-gray-100 p-8 flex-col items-center justify-center overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium">
          <MonitorSmartphone className="w-4 h-4" />
          Live Preview 
          <a href={`/kos/${tenant.subdomain}`} target="_blank" className="text-[#3b23c6] hover:underline ml-2">
            (Buka di tab baru ↗)
          </a>
        </div>
        
        {/* Frame Browser Mockup */}
        <div className="w-full max-w-4xl h-full bg-white rounded-t-xl rounded-b-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200/60">
          <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto bg-white px-6 py-1 rounded-full text-[10px] text-gray-400 font-mono shadow-inner border border-gray-200">
              saaskos.com/kos/{tenant.subdomain}
            </div>
          </div>
          
          <div className="flex-1 bg-gray-50 relative w-full h-full">
             <iframe
               key={refreshKey}
               src={`/kos/${tenant.subdomain}`}
               className="absolute top-0 left-0 w-full h-full border-0 bg-white"
               title="Live Preview"
             />
          </div>
        </div>
      </div>
      
    </div>
  );
}
