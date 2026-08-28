"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTenant(formData: FormData) {
  const supabase = await createClient();
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const checkInDate = formData.get("checkInDate") as string;
  const roomId = formData.get("roomId") as string;

  if (!fullName || !checkInDate || !roomId) {
    throw new Error("Semua field wajib diisi.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get tenant ID from boarding house context (assuming they own one or are staff)
  let tenantId = null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (profile?.role === "staff") {
    const { data: staffData } = await supabase.from("tenant_staffs").select("tenant_id").eq("email", user.email ?? "").eq("status", "active").single();
    tenantId = staffData?.tenant_id;
  } else {
    const { data: tenantData } = await supabase.from("tenants").select("id").eq("owner_id", user.id).maybeSingle();
    tenantId = tenantData?.id;
  }

  if (!tenantId) throw new Error("Kos belum terdaftar.");

  const { error } = await supabase.from("renters").insert({
    tenant_id: tenantId,
    room_id: roomId,
    full_name: fullName,
    phone_number: phoneNumber,
    check_in_date: checkInDate,
    status: "active"
  });

  if (error) {
    console.error("Gagal menambah penghuni:", error);
    throw new Error("Terjadi kesalahan saat menambah penghuni.");
  }

  // Update room status to occupied
  await supabase.from("rooms").update({ status: "occupied" }).eq("id", roomId);

  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/tenants");
}

export async function removeTenant(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const roomId = formData.get("roomId") as string;

  if (!id) throw new Error("ID tidak valid.");

  const { error } = await supabase.from("renters").update({ status: "moved_out" }).eq("id", id);
  
  if (error) {
    throw new Error("Gagal memproses.");
  }

  if (roomId) {
    await supabase.from("rooms").update({ status: "available" }).eq("id", roomId);
  }

  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/tenants");
}
