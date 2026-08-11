import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Membuat Supabase client untuk digunakan di sisi server.
 * Gunakan di Server Components, Server Actions, dan Route Handlers.
 * Secara otomatis menangani cookie untuk session management (SSR).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` dipanggil dari Server Component.
            // Dapat diabaikan jika middleware sudah me-refresh session.
          }
        },
      },
    }
  );
}
