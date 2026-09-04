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
    const { data: tenant } = await supabase.from("tenants").select("id").eq("owner_id", user.id).single();
    if (tenant) {
      tenantId = tenant.id;
    } else {
      const { data: staff } = await supabase.from("tenant_staffs").select("tenant_id").eq("profile_id", user.id).single();
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
