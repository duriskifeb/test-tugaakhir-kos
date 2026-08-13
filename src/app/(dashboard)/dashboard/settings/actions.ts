"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTenantProfile(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const description = formData.get("description") as string;
    const subdomain = formData.get("subdomain") as string;

    if (!id || !name || !subdomain) {
        return { error: "ID, Nama Kos, dan Subdomain wajib diisi." };
    }

    const formattedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Cek apakah subdomain sudah dipakai orang lain (selain tenant ini sendiri)
    const { data: existing } = await supabase
        .from("tenants")
        .select("id")
        .eq("subdomain", formattedSubdomain)
        .neq("id", id)
        .single();

    if (existing) {
        return { error: "Subdomain ini sudah digunakan oleh kos lain, silakan pilih yang berbeda." };
    }

    // Update tabel tenants
    const { error } = await supabase
        .from("tenants")
        .update({
            name: name,
            address: address,
            description: description,
            subdomain: formattedSubdomain,
        })
        .eq("id", id);

    if (error) {
        console.error("Gagal update profil kos:", error);
        return { error: "Gagal menyimpan perubahan. Silakan coba lagi." };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: "Profil kos berhasil diperbarui!" };
}
