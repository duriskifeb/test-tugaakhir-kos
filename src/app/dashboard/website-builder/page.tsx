"use client";

import { useState } from "react";
import { Monitor, Smartphone, Palette, Globe, LayoutTemplate, Phone, Save, ExternalLink } from "lucide-react";

export default function WebsiteBuilderPage() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-[#fafafa]">
      
      {/* KIRI: Panel Konfigurasi (Editor) */}
      <div className="w-full md:w-1/3 min-w-[320px] bg-white border-r border-gray-200 flex flex-col h-full z-10 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
            <p className="text-xs text-gray-500 mt-1">Customize your booking site</p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section: Identitas */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#3b23c6]" /> 
              Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name</label>
                <input type="text" defaultValue="The Grand Dormitory" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#3b23c6] focus:ring-1 focus:ring-[#3b23c6] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline / Description</label>
                <textarea rows={3} defaultValue="Premium student living in the heart of the city." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#3b23c6] focus:ring-1 focus:ring-[#3b23c6] outline-none resize-none" />
              </div>
            </div>
          </section>

          {/* Section: Subdomain */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#3b23c6]" /> 
              Domain
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Subdomain</label>
              <div className="flex">
                <input type="text" defaultValue="grand-dormitory" className="flex-1 px-3 py-2 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm focus:border-[#3b23c6] focus:ring-1 focus:ring-[#3b23c6] outline-none text-right" />
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-200 bg-gray-100 text-gray-500 sm:text-sm font-medium">
                  .dormispace.com
                </span>
              </div>
            </div>
          </section>

          {/* Section: Tema */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#3b23c6]" /> 
              Theme Colors
            </h2>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3b23c6] border-2 border-gray-200 shadow-sm cursor-pointer" />
                  <span className="text-sm font-medium text-gray-700">#3B23C6</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10b981] border-2 border-gray-200 shadow-sm cursor-pointer" />
                  <span className="text-sm font-medium text-gray-700">#10B981</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Kontak */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#3b23c6]" /> 
              Contact Info
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number (For Booking CTA)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-100 text-gray-500 sm:text-sm font-medium">
                  +62
                </span>
                <input type="tel" defaultValue="81234567890" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-r-lg text-sm focus:border-[#3b23c6] focus:ring-1 focus:ring-[#3b23c6] outline-none" />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* KANAN: Live Preview Panel */}
      <div className="flex-1 bg-gray-100 h-full flex flex-col">
        
        {/* Preview Toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-md transition-colors ${device === "desktop" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-md transition-colors ${device === "mobile" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-[#3b23c6] hover:underline">
            Visit live site <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
          
          {/* Mockup Frame */}
          <div className={`bg-white rounded-t-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out origin-top ${
            device === "desktop" ? "w-full max-w-5xl h-[800px]" : "w-[375px] h-[812px]"
          }`}>
            
            {/* Fake Browser Top (hanya untuk desktop) */}
            {device === "desktop" && (
              <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 bg-white px-3 py-1 rounded text-xs text-gray-500 font-mono w-64 text-center border border-gray-200 shadow-sm truncate">
                  grand-dormitory.dormispace.com
                </div>
              </div>
            )}

            {/* Konten Web Preview (Dummy) */}
            <div className="w-full h-full overflow-y-auto bg-white flex flex-col">
              
              {/* Navbar Preview */}
              <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                <span className="font-bold text-lg text-[#3b23c6]">The Grand Dormitory</span>
                <button className="bg-[#3b23c6] text-white px-4 py-2 rounded-lg text-sm font-semibold">Book Now</button>
              </nav>

              {/* Hero Preview */}
              <div className="bg-[#3b23c6]/5 px-6 py-16 md:py-24 text-center border-b border-gray-100 shrink-0">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Premium student living <br/>in the heart of the city.
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto mb-8">
                  Comfortable, secure, and fully furnished boarding houses tailored for your best living experience.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#3b23c6] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#3b23c6]/30">
                    Lihat Kamar
                  </button>
                  <button className="bg-white text-[#3b23c6] border border-[#3b23c6]/20 px-6 py-3 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Hubungi WA
                  </button>
                </div>
              </div>

              {/* Room Cards Preview */}
              <div className="p-6 md:p-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Tersedia Saat Ini</h3>
                <div className={`grid gap-6 ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                        [Foto Kamar]
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">Kamar Tipe {i === 1 ? 'VIP' : 'Standard'}</h4>
                          <span className="text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded text-[10px] font-bold">Kosong</span>
                        </div>
                        <p className="text-xl font-bold text-[#3b23c6] mb-4">Rp 2.5jt<span className="text-sm font-normal text-gray-500">/bln</span></p>
                        <button className="w-full border-2 border-gray-200 text-gray-700 py-2 rounded-lg font-bold text-sm">Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
