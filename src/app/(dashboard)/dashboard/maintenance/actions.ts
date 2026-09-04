"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Mengambil data awal
export async function getMaintenanceData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { requests: [], rooms: [] };

  // Ambil tenant_id
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    // Coba cari dari staff
    const { data: staff } = await supabase
      .from("tenant_staffs")
      .select("tenant_id")
      .eq("profile_id", user.id)
      .single();
    
    if (!staff) return { requests: [], rooms: [] };
    tenant.id = staff.tenant_id;
  }

  // Ambil data keluhan
  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select(`
      *,
      rooms ( name )
    `)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  // Ambil data kamar untuk form
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("boarding_house_id", tenant.id);

  return { requests: requests || [], rooms: rooms || [] };
}

// Menambah keluhan
export async function createMaintenanceRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const tenantId = formData.get("tenantId") as string;
  const roomId = formData.get("roomId") as string;
  const reportedBy = formData.get("reportedBy") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("maintenance_requests").insert({
    tenant_id: tenantId,
    room_id: roomId || null,
    reported_by: reportedBy,
    title,
    description,
    status: "pending"
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/maintenance");
  return { success: true };
}

// Update status keluhan
export async function updateMaintenanceStatus(id: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("maintenance_requests")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/maintenance");
  return { success: true };
}
