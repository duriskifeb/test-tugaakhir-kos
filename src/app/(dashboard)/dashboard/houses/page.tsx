import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HousesClient } from "./HousesClient";

export default async function HousesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah ini Owner
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    redirect("/dashboard");
  }

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return <HousesClient tenants={tenants || []} />;
}
