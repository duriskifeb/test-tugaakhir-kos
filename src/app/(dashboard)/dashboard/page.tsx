import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah user punya kos
  const { data: boardingHouse } = await supabase
    .from("tenants")
    .select("id, status")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <DashboardClient 
      boardingHouse={boardingHouse} 
      userName={user.user_metadata?.full_name || "Owner"} 
    />
  );
}
