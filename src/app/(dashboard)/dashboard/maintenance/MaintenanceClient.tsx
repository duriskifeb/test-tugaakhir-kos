"use client";

import { useState } from "react";
import { Wrench, Plus, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { createMaintenanceRequest, updateMaintenanceStatus } from "./actions";

export default function MaintenanceClient({ initialRequests, rooms, tenantId }: { initialRequests: any[], rooms: any[], tenantId: string }) {
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200"><CheckCircle className="w-3 h-3" /> Selesai</span>;
      case 'in_progress':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200"><Clock className="w-3 h-3" /> Sedang Dikerjakan</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-200"><AlertCircle className="w-3 h-3" /> Menunggu</span>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateMaintenanceStatus(id, newStatus);
    if(res.success) {
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("tenantId", tenantId);
    
    const res = await createMaintenanceRequest(formData);
    
    if (res.success) {
      setIsModalOpen(false);
      window.location.reload(); // Refresh untuk ambil data baru
    } else {
      alert("Gagal menambahkan keluhan: " + res.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Keluhan (Maintenance)</h1>
          <p className="text-gray-500 mt-1">
            Pantau dan tindak lanjuti laporan perbaikan fasilitas dari penyewa.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3b23c6] text-white rounded-lg font-medium hover:bg-[#321ca8] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Catat Keluhan
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Keluhan</h3>
          <p className="text-gray-500 max-w-md">
            Saat ini tidak ada laporan kerusakan dari penyewa. Anda dapat menambahkan tiket perbaikan secara manual jika diperlukan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Kamar / Pelapor</th>
                <th className="p-4">Detail Keluhan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{req.rooms?.name || "Fasilitas Umum"}</div>
                    <div className="text-xs text-gray-500">Oleh: {req.reported_by}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 text-sm mb-1">{req.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{req.description}</div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none hover:border-gray-300 focus:ring-2 focus:ring-[#3b23c6] transition-all cursor-pointer"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="in_progress">Dikerjakan</option>
                      <option value="resolved">Selesai</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Tambah Keluhan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Catat Keluhan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi / Kamar</label>
                <select name="roomId" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]">
                  <option value="">Fasilitas Umum</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Pelapor (Penyewa)</label>
                <input required type="text" name="reportedBy" placeholder="Misal: Budi / Anak Kamar 01" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Masalah</label>
                <input required type="text" name="title" placeholder="Misal: AC Bocor / Lampu Kamar Mandi Mati" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Detail Kerusakan</label>
                <textarea required name="description" rows={3} placeholder="Jelaskan secara singkat kerusakan yang dialami..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b23c6] resize-none"></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3b23c6] text-white rounded-xl font-medium hover:bg-[#321ca8] transition-colors disabled:opacity-70">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}