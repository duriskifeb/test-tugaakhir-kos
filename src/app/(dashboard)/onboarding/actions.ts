"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createTenant(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;

    // Dapatkan ID user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Insert ke tabel tenants
    const { error } = await supabase.from("tenants").insert({
        owner_id: user.id,
        name: name,
        subdomain: subdomain.toLowerCase().replace(/\s+/g, '-'), // Membuat format subdomain (contoh: kos-melati)
    });

    if (error) {
        console.error("Gagal membuat kos:", error.message);
        return;
    }

    // Jika sukses, arahkan ke dasbor utama
    redirect("/dashboard");
}
