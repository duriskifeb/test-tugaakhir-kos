import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BedDouble, CheckCircle2, MapPin } from "lucide-react";
import Head from "next/head";

export const dynamic = 'force-dynamic';

// Default content if not configured
const defaultContent = {
  hero: {
    title: "Selamat Datang di Kos Kami",
    subtitle: "Pilihan terbaik untuk kenyamanan dan keamanan tempat tinggal Anda.",
    ctaText: "Lihat Kamar",
  },
  features: {
    title: "Fasilitas & Keunggulan",
    items: [
      { icon: "CheckCircle2", text: "Lokasi Strategis" },
      { icon: "CheckCircle2", text: "Keamanan 24 Jam" },
      { icon: "CheckCircle2", text: "Kebersihan Terjamin" },
    ]
  }
};

export default async function PublicTenantPage(props: {
  params: Promise<{ subdomain: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  // 1. Ambil data tenant
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("subdomain", params.subdomain)
    .single();

  if (tenantError) {
    console.error("Error fetching tenant:", tenantError);
  }

  if (!tenant) {
    notFound();
  }

  // 2. Ambil tema
  const theme = tenant.theme || { primaryColor: "#3b23c6", fontFamily: "Inter" };

  // 3. Ambil seksi halaman (page sections)
  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("order_index", { ascending: true });

  // Parsing seksi
  const heroSection = sections?.find((s) => s.section_type === "hero")?.content || defaultContent.hero;
  const featuresSection = sections?.find((s) => s.section_type === "features")?.content || defaultContent.features;

  // 4. Ambil data kamar aktif
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("boarding_house_id", tenant.id)
    .eq("status", "available")
    .order("price", { ascending: true });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div style={{ fontFamily: theme.fontFamily }} className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dynamic CSS Variables */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-color: ${theme.primaryColor};
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
      `}} />

      {/* Navbar Minimalis */}
      <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
          {tenant.name}
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="#hero" className="hover:text-primary transition-colors">Beranda</a>
          <a href="#fasilitas" className="hover:text-primary transition-colors">Fasilitas</a>
          <a href="#kamar" className="hover:text-primary transition-colors">Kamar</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="bg-primary text-white py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {heroSection.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {heroSection.subtitle}
          </p>
          <a 
            href="#kamar"
            className="inline-block bg-white text-primary font-bold px-8 py-4 rounded-full text-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            {heroSection.ctaText}
          </a>
        </div>
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="0,100 100,0 100,100" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="fasilitas" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">{featuresSection.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuresSection.items.map((item: any, idx: number) => (
              <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-primary">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="kamar" className="py-20 px-6 bg-gray-50 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pilihan Kamar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Lihat daftar kamar yang tersedia saat ini. Harga transparan dan fasilitas lengkap untuk kenyamanan Anda.</p>
          </div>
          
          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  {/* Foto Mockup / Placeholder */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                    <BedDouble className="w-16 h-16 text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600">
                      Tersedia
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6 mt-2">
                      {room.facilities?.slice(0, 4).map((f: string, i: number) => (
                        <span key={i} className="bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {f}
                        </span>
                      ))}
                      {room.facilities?.length > 4 && (
                        <span className="bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                          +{room.facilities.length - 4}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Harga per Bulan</p>
                        <p className="text-2xl font-black text-primary">{formatRupiah(room.price)}</p>
                      </div>
                      <a 
                        href={`https://wa.me/62800000000?text=Halo%20saya%20tertarik%20dengan%20${room.name}`}
                        target="_blank"
                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-primary transition-colors"
                      >
                        Pesan
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                <BedDouble className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Kamar Tersedia</h3>
                <p className="text-gray-500">Saat ini tidak ada kamar yang kosong. Silakan cek kembali nanti.</p>
             </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-bold text-xl text-primary mb-2">{tenant.name}</div>
            {tenant.address && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                {tenant.address}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Dibuat menggunakan <a href="#" className="font-semibold text-primary hover:underline">SaaS Kos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
