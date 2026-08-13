import { Sidebar } from "@/components/modules/Sidebar";
import { Topbar } from "@/components/modules/Topbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek profile role, jika admin lempar ke admin dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

  // Cek apakah user punya kos
  const { data: boardingHouse } = await supabase
    .from("tenants")
    .select("id, status")
    .eq("owner_id", user.id)
    .maybeSingle(); // maybeSingle instead of single so it doesn't throw if not found

  const hasBoardingHouse = !!boardingHouse;

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      <Sidebar hasBoardingHouse={hasBoardingHouse} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fafafa]">
          {boardingHouse?.status === 'UNVERIFIED' ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 mb-6 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Akun Sedang Diverifikasi</h2>
              <p className="text-gray-500 max-w-md">
                Pendaftaran kos Anda sedang dalam antrean verifikasi oleh Admin.
                Anda akan mendapatkan akses penuh ke semua fitur (termasuk Website Builder) setelah akun diverifikasi.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
