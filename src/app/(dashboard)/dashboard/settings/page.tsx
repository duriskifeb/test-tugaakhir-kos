import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil data tenant milik user
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    // Jika belum punya tenant, mungkin redirect ke onboarding, 
    // tapi karena Topbar menutupi ini, kita amankan saja.
    redirect("/dashboard");
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil Kos</h1>
        <p className="text-gray-500 mt-1">Perbarui informasi utama kos Anda yang akan ditampilkan di website pencarian.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <SettingsForm tenant={tenant} />
      </div>
    </div>
  );
}
