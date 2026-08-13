"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createTenant(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;

    if (!name || !subdomain) {
        return { error: "Semua kolom wajib diisi." };
    }

    // Dapatkan ID user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const formattedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Cek apakah subdomain sudah terpakai
    const { data: existing } = await supabase.from("tenants").select("id").eq("subdomain", formattedSubdomain).single();
    if (existing) {
        return { error: "Subdomain ini sudah digunakan, silakan pilih yang lain." };
    }

    // Insert ke tabel tenants
    const { error } = await supabase.from("tenants").insert({
        owner_id: user.id,
        name: name,
        subdomain: formattedSubdomain,
    });

    if (error) {
        console.error("Gagal membuat kos:", error.message);
        return { error: "Terjadi kesalahan saat menyimpan data. Coba lagi." };
    }

    // Jika sukses, arahkan ke dasbor utama
    redirect("/dashboard");
}
