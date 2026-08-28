"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPayment(formData: FormData) {
  const supabase = await createClient();
  const renterId = formData.get("renterId") as string;
  const amountStr = formData.get("amount") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!renterId || !amountStr || !dueDate) {
    return { error: "Semua field wajib diisi." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Nominal tagihan tidak valid." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Get tenant ID
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

  const { error } = await supabase.from("payments").insert({
    tenant_id: tenantId,
    renter_id: renterId,
    amount: amount,
    due_date: dueDate,
    status: "unpaid"
  });

  if (error) {
    console.error("Gagal menambah tagihan:", error);
    return { error: "Terjadi kesalahan saat membuat tagihan." };
  }

  revalidatePath("/dashboard/payments");
  return { success: "Tagihan berhasil dibuat!" };
}

export async function markAsPaid(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return { error: "ID tidak valid." };

  const { error } = await supabase.from("payments").update({ 
    status: "paid",
    paid_at: new Date().toISOString()
  }).eq("id", id);
  
  if (error) {
    return { error: "Gagal mengupdate status tagihan." };
  }

  revalidatePath("/dashboard/payments");
  return { success: "Tagihan ditandai Lunas." };
}

export async function deletePayment(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return { error: "ID tidak valid." };

  const { error } = await supabase.from("payments").delete().eq("id", id);
  
  if (error) {
    return { error: "Gagal menghapus tagihan." };
  }

  revalidatePath("/dashboard/payments");
  return { success: "Tagihan berhasil dihapus." };
}
