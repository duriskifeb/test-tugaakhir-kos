import { createClient } from "@/lib/supabase/server";
import { CreditCard, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { addPayment, markAsPaid, deletePayment } from "./actions";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Dapatkan tenant_id
  let tenantId = null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (profile?.role === "staff") {
    const { data: staffData } = await supabase.from("tenant_staffs").select("tenant_id").eq("email", user.email).eq("status", "active").single();
    tenantId = staffData?.tenant_id;
  } else {
    const { data: tenantData } = await supabase.from("tenants").select("id").eq("owner_id", user.id).maybeSingle();
    tenantId = tenantData?.id;
  }

  if (!tenantId) return <div>Data Kos Tidak Ditemukan.</div>;

  // Fetch Payments
  const { data: payments } = await supabase
    .from("payments")
    .select(`*, renters(full_name, rooms(name))`)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  // Fetch Active Renters for dropdown
  const { data: activeRenters } = await supabase
    .from("renters")
    .select("id, full_name, rooms(name)")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .order("full_name", { ascending: true });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tagihan & Pembayaran</h1>
          <p className="text-gray-500 mt-1">
            Pantau tagihan bulanan penyewa dan catat pembayaran yang masuk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Buat Tagihan */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#3b23c6]" />
              Buat Tagihan Baru
            </h2>
            <form action={addPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Penghuni</label>
                <select name="renterId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none">
                  <option value="">-- Pilih Penghuni Aktif --</option>
                  {activeRenters?.map(renter => (
                    <option key={renter.id} value={renter.id}>
                      {renter.full_name} ({renter.rooms?.name || "-"})
                    </option>
                  ))}
                </select>
                {(!activeRenters || activeRenters.length === 0) && (
                  <p className="text-xs text-red-500 mt-1">Belum ada penghuni aktif.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Tagihan (Rp)</label>
                <input type="number" name="amount" required min="1000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none" placeholder="1500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
                <input type="date" name="dueDate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b23c6] focus:border-transparent outline-none" />
              </div>
              <SubmitButton label="Terbitkan Tagihan" pendingLabel="Menyimpan..." />
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Tagihan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-bold text-gray-900">Riwayat Tagihan</h2>
            </div>
            
            {(!payments || payments.length === 0) ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Tagihan</h3>
                <p className="text-gray-500 max-w-md">
                  Anda belum menerbitkan tagihan apa pun. Buat tagihan pertama Anda di form sebelah kiri.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {payments.map(payment => (
                  <li key={payment.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        {payment.renters?.full_name || "Unknown Renter"}
                        {payment.status === "paid" ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">LUNAS</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">BELUM BAYAR</span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                        <span>Jatuh Tempo: {new Date(payment.due_date).toLocaleDateString("id-ID")}</span>
                        {payment.paid_at && (
                          <span className="text-green-600">Dibayar: {new Date(payment.paid_at).toLocaleDateString("id-ID")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {payment.status === "unpaid" && (
                        <form action={markAsPaid}>
                          <input type="hidden" name="id" value={payment.id} />
                          <button 
                            title="Tandai Lunas"
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border border-green-200"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Lunas</span>
                          </button>
                        </form>
                      )}
                      <form action={deletePayment}>
                        <input type="hidden" name="id" value={payment.id} />
                        <button 
                          title="Hapus Tagihan"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
