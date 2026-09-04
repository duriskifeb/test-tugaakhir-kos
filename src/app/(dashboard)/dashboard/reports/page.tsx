import { createClient } from "@/lib/supabase/server";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Dapatkan tenantId
  let tenantId = "";
  const { data: tenant } = await supabase.from("tenants").select("id").eq("owner_id", user.id).single();
  
  if (tenant) {
    tenantId = tenant.id;
  } else {
    const { data: staff } = await supabase.from("tenant_staffs").select("tenant_id").eq("profile_id", user.id).single();
    if (staff) tenantId = staff.tenant_id;
  }

  // Fetch all necessary data for reports
  const [
    { data: payments }, 
    { count: roomsCount }, 
    { count: rentersCount }
  ] = await Promise.all([
    supabase.from("payments").select("*").eq("tenant_id", tenantId),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("renters").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("status", "active")
  ]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <ReportsClient 
        paymentsData={payments || []}
        roomsCount={roomsCount || 0}
        rentersCount={rentersCount || 0}
      />
    </div>
  );
}
