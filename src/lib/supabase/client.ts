import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Membuat Supabase client untuk digunakan di sisi browser (Client Components).
 * Gunakan fungsi ini di semua Client Component yang membutuhkan akses Supabase.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
