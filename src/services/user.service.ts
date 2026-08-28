import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import type { Profile, ServiceResult } from "@/types";

/**
 * Mengambil data user yang sedang login dari Supabase Auth.
 * Gunakan di Server Components atau Server Actions.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Mengambil profil lengkap user dari tabel `profiles`.
 * @param userId - UUID user dari Supabase Auth
 */
export async function getUserProfile(userId: string): Promise<ServiceResult<Profile>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
    .returns<Profile>();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Profil tidak ditemukan." };
  return { data, error: null };
}

/**
 * Mengupdate profil user.
 * @param userId - UUID user
 * @param updates - Field yang ingin diupdate
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "phone" | "email">>
): Promise<ServiceResult<Profile>> {
  const supabase = await createClient();

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  } satisfies Partial<Database["public"]["Tables"]["profiles"]["Update"]>;

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select()
    .single()
    .returns<Profile>();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Profil tidak ditemukan." };
  return { data, error: null };
}
