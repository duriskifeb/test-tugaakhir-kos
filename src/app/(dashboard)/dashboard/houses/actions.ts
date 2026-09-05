"use server";

import { createClient } from "@/lib/supabase/server";

export async function createCabangBaru(name: string, subdomain: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Pastikan user adalah owner (opsional, RLS juga sudah menjaga)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "owner") {
      return { success: false, error: "Hanya Pemilik Kos yang dapat menambah cabang." };
    }

    const { data, error } = await supabase
      .from("tenants")
      .insert({
        owner_id: user.id,
        name: name,
        subdomain: subdomain,
        status: "UNVERIFIED"
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") { // unique violation
        return { success: false, error: "Subdomain tersebut sudah digunakan oleh kos lain." };
      }
      throw error;
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan" };
  }
}
