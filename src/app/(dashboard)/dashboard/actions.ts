"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setupBoardingHouse(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const description = formData.get("description") as string;
    const subdomainInput = formData.get("subdomain") as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const formattedSubdomain = subdomainInput ? subdomainInput.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-');

    // Cek apakah subdomain sudah terpakai
    const { data: existing } = await supabase.from("tenants").select("id").eq("subdomain", formattedSubdomain).single();
    if (existing) {
        throw new Error("Subdomain ini sudah digunakan, silakan pilih yang lain.");
    }

    // Insert ke tabel tenants dengan status UNVERIFIED
    const { error } = await supabase.from("tenants").insert({
        owner_id: user.id,
        name: name,
        address: address,
        description: description,
        subdomain: formattedSubdomain,
        status: "UNVERIFIED",
    });

    if (error) {
        console.error("Gagal membuat kos:", error);
        throw new Error(error.message || "Gagal menyimpan data kos.");
    }

    // Refresh halaman agar mendapatkan data terbaru
    revalidatePath("/dashboard");
    revalidatePath("/dashboard", "layout");
}
