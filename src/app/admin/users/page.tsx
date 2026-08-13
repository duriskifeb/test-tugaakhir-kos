import { createClient } from "@/lib/supabase/server";
import { Ban, ShieldAlert, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch all owners (Pemilik Kos)
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "owner")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  // Server action to toggle suspend
  async function toggleSuspend(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const isSuspended = formData.get("is_suspended") === "true";
    
    // Toggle state
    await supabase
      .from("profiles")
      .update({ is_suspended: !isSuspended })
      .eq("id", id);
      
    revalidatePath("/admin/users");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-1">Kelola akun Pemilik Kos, tangguhkan (suspend) jika ada pelanggaran.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Telepon</th>
                <th className="px-6 py-4 font-semibold">Status Akun</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.is_suspended ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{user.full_name || "Unknown"}</td>
                    <td className="px-6 py-4">{user.email || "-"}</td>
                    <td className="px-6 py-4">{user.phone || "-"}</td>
                    <td className="px-6 py-4">
                      {user.is_suspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <Ban className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={toggleSuspend}>
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="is_suspended" value={user.is_suspended ? "true" : "false"} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 justify-center px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            user.is_suspended
                              ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {user.is_suspended ? "Pulihkan Akun" : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" /> Suspend
                            </>
                          )}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada akun Pemilik Kos terdaftar.
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
