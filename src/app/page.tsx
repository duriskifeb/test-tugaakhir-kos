import { redirect } from "next/navigation";

/**
 * Root page — redirect otomatis ke /login.
 * Middleware juga akan menangani redirect, tapi ini sebagai fallback.
 */
export default function RootPage() {
  redirect("/login");
}
