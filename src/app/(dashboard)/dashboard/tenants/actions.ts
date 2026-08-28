"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTenant(formData: FormData) {
  const supabase = await createClient();
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const checkInDate = formData.get("checkInDate") as string;
  const roomId = formData.get("roomId") as string;

  if (!fullName || !checkInDate || !roomId) {
    return { error: "Semua field wajib diisi." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Get tenant ID from boarding house context (assuming they own one or are staff)
  let tenantId = null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (profile?.role === "staff") {
    const { data: staffData } = await supabase.from("tenant_staffs").select("tenant_id").eq("email", user.email).eq("status", "active").single();
    tenantId = staffData?.tenant_id;
  } else {
    const { data: tenantData } = await supabase.from("tenants").select("id").eq("owner_id", user.id).maybeSingle();
    tenantId = tenantData?.id;
  }

  if (!tenantId) return { error: "Kos belum terdaftar." };

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
    return { error: "Terjadi kesalahan saat menambah penghuni." };
  }

  // Update room status to occupied
  await supabase.from("rooms").update({ status: "occupied" }).eq("id", roomId);

  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard/rooms");
  return { success: "Penghuni berhasil ditambahkan!" };
}

export async function removeTenant(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const roomId = formData.get("roomId") as string;

  if (!id) return { error: "ID tidak valid." };

  const { error } = await supabase.from("renters").update({ status: "moved_out" }).eq("id", id);
  
  if (error) {
    return { error: "Gagal memproses." };
  }

  if (roomId) {
    await supabase.from("rooms").update({ status: "available" }).eq("id", roomId);
  }

  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard/rooms");
  return { success: "Penghuni berhasil dipindahkeluarkan." };
}
