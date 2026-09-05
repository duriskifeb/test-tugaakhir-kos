"use client";

import { useEffect, useRef, useState } from "react";
import { X, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Room {
  id: string;
  name: string;
  price: number;
}

interface BookingModalProps {
  tenantId: string;
  room: Room;
  buttonClass: string;
}

export function BookingModal({ tenantId, room, buttonClass }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref untuk menghentikan form menular ke elemen di luar
  const formRef = useRef<HTMLDivElement>(null);

  // Mencegah iframe/parent body scrolling saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Cegah event bubbling (kongslet/redup)
    
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const renter_name = formData.get("name") as string;
    const renter_phone = formData.get("phone") as string;
    const planned_check_in = formData.get("date") as string;
    const additional_notes = formData.get("notes") as string;

    const supabase = createClient();
    
    const { error: dbError } = await supabase.from("bookings").insert({
      boarding_house_id: tenantId,
      room_id: room.id,
      renter_name,
      renter_phone,
      planned_check_in,
      additional_notes,
      status: "pending"
    });

    if (dbError) {
      console.error(dbError);
      setError("Gagal mengirim pengajuan. Silakan coba lagi.");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault(); // Mencegah form action atau link behavior bawaan
          setIsOpen(true);
        }}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-bold transition-all ${buttonClass}`}
      >
        Ajukan Sewa
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onPointerDown={(e) => e.stopPropagation()} // Putuskan hubungan klik dengan luaran
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div 
            ref={formRef}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Formulir Pengajuan Sewa</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Pengajuan Terkirim!</h4>
                  <p className="text-gray-500 text-sm">
                    Terima kasih. Pengajuan penyewaan untuk kamar <strong>{room.name}</strong> telah masuk ke sistem. Pengelola kos akan segera menghubungi Anda.
                  </p>
                  <button 
                    type="button"
                    onClick={() => {
                       setIsOpen(false);
                       setSuccess(false); // Reset form jika dibuka lagi
                    }}
                    className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl mb-4 text-sm text-indigo-800 font-medium flex justify-between items-center">
                    <span>Kamar: {room.name}</span>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="Masukkan nama Anda"
                      onClick={(e) => e.stopPropagation()} // Pastikan klik tetap fokus di input
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      placeholder="0812xxxx..."
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rencana Tanggal Check-in</label>
                    <input 
                      type="date" 
                      name="date" 
                      required 
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                    <textarea 
                      name="notes" 
                      rows={2}
                      placeholder="Misal: Saya bawa motor..."
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-2 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}