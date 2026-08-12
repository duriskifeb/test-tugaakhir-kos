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

  // Cek apakah user punya kos
  const { data: boardingHouse } = await supabase
    .from("boarding_houses")
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
          {children}
        </main>
      </div>
    </div>
  );
}
