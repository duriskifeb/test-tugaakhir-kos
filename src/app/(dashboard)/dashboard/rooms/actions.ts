"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Json } from "@/types/database.types";

export async function createRoom(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const priceStr = formData.get("price") as string;
  const status = formData.get("status") as string;
  const facilitiesString = formData.get("facilities") as string;

  if (!name || !priceStr) {
    return { error: "Nama kamar dan harga wajib diisi." };
  }

  const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
  if (isNaN(price)) {
    return { error: "Harga tidak valid." };
  }

  let facilities = [];
  try {
    facilities = facilitiesString ? JSON.parse(facilitiesString) : [];
  } catch (e) {
    facilities = [];
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  let tenantId = null;

  if (profile?.role === "staff") {
    const { data: staffData } = await supabase
      .from("tenant_staffs")
      .select("tenant_id")
      .eq("email", user.email ?? "")
      .eq("status", "active")
      .maybeSingle();
    tenantId = staffData?.tenant_id;
  } else {
    const { data: tenantData } = await supabase
      .from("tenants")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();
    tenantId = tenantData?.id;
  }

  if (!tenantId) {
    return { error: "Kos belum terdaftar." };
  }

  const { error } = await supabase.from("rooms").insert({
    boarding_house_id: tenantId,
    name,
    price,
    status: (status || "available") as "available" | "occupied" | "maintenance",
    facilities: facilities as unknown as Json,
  });

  if (error) {
    console.error("Gagal menambah kamar:", error);
    return { error: "Terjadi kesalahan saat menyimpan data kamar." };
  }

  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms");
}

export async function deleteRoom(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) throw new Error("ID kamar tidak valid.");

  const { error } = await supabase.from("rooms").delete().eq("id", id);
  
  if (error) {
    console.error("Gagal menghapus kamar:", error);
    throw new Error("Terjadi kesalahan saat menghapus kamar.");
  }

  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms");
}
