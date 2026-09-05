import PaymentsClient from "./PaymentsClient";
import { getPaymentsData } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  const data = await getPaymentsData();

  // Get tenantId for the client component
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let tenantId = "";
  if (user) {
    const { data: allTenants } = await supabase.from("tenants").select("id").eq("owner_id", user.id);
    
    if (allTenants && allTenants.length > 0) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const savedTenantId = cookieStore.get('active_tenant_id')?.value;
      
      if (savedTenantId && allTenants.some(t => t.id === savedTenantId)) {
        tenantId = savedTenantId;
      } else {
        tenantId = allTenants[0].id;
      }
    } else {
      // Logic for staff (they only have 1 active assigned tenant usually)
      const { data: staff } = await supabase.from("tenant_staffs").select("tenant_id").eq("email", user.email ?? "").eq("status", "active").maybeSingle();
      if (staff) tenantId = staff.tenant_id;
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <PaymentsClient 
        initialPayments={data.payments} 
        renters={data.renters} 
        tenantId={tenantId}
      />
    </div>
  );
}
