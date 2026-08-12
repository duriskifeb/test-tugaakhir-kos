"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: "owner",
            },
        },
    });

    if (error) {
        console.error("Gagal mendaftar:", error.message);
        // Idealnya kita lempar error ini ke UI, tapi untuk sekarang kita log saja
        return;
    }

    // Jika sukses daftar, langsung lempar ke halaman onboarding
    redirect("/onboarding");
}
