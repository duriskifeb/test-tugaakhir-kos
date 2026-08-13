"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStaff(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string).toLowerCase();

  if (!name || !email) {
    return { error: "Nama dan email wajib diisi." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Get tenant ID
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    return { error: "Kos belum terdaftar." };
  }

  const { error } = await supabase.from("tenant_staffs").insert({
    tenant_id: tenant.id,
    name,
    email,
    status: "pending"
  });

  if (error) {
    console.error("Gagal menambah staf:", error);
    if (error.code === '23505') { // Unique violation
      return { error: "Email ini sudah diundang sebagai staf." };
    }
    return { error: "Terjadi kesalahan saat mengundang staf." };
  }

  revalidatePath("/dashboard/staff");
  return { success: "Undangan staf berhasil dibuat!" };
}

export async function removeStaff(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return { error: "ID staf tidak valid." };

  const { error } = await supabase.from("tenant_staffs").delete().eq("id", id);
  
  if (error) {
    console.error("Gagal menghapus staf:", error);
    return { error: "Terjadi kesalahan saat menghapus staf." };
  }

  revalidatePath("/dashboard/staff");
}
