import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let role = profile?.role || "tenant";
  let boardingHouse = null;

  // Check if they have a staff invite (this requires RLS policy to allow reading their own email)
  const { data: staffData } = await supabase
    .from("tenant_staffs")
    .select("tenant_id, status")
    .eq("email", user.email)
    .maybeSingle();

  // Auto-correct role if they are actually staff
  if (staffData && role !== "staff") {
    role = "staff";
    // Optional: silently update their profile role to fix it for the future
    await supabase.from("profiles").update({ role: "staff" }).eq("id", user.id);
    // Also activate them if they are pending
    if (staffData.status === "pending") {
      await supabase.from("tenant_staffs").update({ status: "active" }).eq("email", user.email);
      staffData.status = "active";
    }
  }

  if (role === "staff") {
    if (staffData && staffData.status === "active") {
      const { data: tenantData } = await supabase
        .from("tenants")
        .select("id, status")
        .eq("id", staffData.tenant_id)
        .maybeSingle();
      boardingHouse = tenantData;
    }
  } else {
    const { data: tenantData } = await supabase
      .from("tenants")
      .select("id, status")
      .eq("owner_id", user.id)
      .maybeSingle();
    boardingHouse = tenantData;
  }

  return (
    <DashboardClient 
      boardingHouse={boardingHouse} 
      userName={user.user_metadata?.full_name || "User"} 
      role={role}
    />
  );
}
