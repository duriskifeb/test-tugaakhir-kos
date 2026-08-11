import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Root Next.js Proxy (sebelumnya: Middleware).
 * Di Next.js 16, `middleware.ts` sudah deprecated → gunakan `proxy.ts`.
 *
 * Tugas:
 * 1. Me-refresh session Supabase di setiap request (agar token tidak expired)
 * 2. Melindungi route /dashboard — redirect ke /login jika belum login
 * 3. Redirect user yang sudah login dari /login ke /dashboard
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Proteksi semua route di bawah /dashboard
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect user yang sudah login dari halaman /login ke dashboard
  if (pathname === "/login" && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - _next/static (file statis)
     * - _next/image (image optimization)
     * - favicon.ico
     * - File gambar (svg, png, jpg, dll)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
