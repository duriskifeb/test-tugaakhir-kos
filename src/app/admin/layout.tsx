import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/modules/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    // If not admin, redirect to normal dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar for Admin (Optional, could just be a header or profile area) */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Admin Control Panel</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
            <span className="text-sm font-medium text-gray-700">{profile?.full_name || "Admin"}</span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fafafa] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
