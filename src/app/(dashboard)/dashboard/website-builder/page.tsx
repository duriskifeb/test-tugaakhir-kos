import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BuilderForm } from "./BuilderForm";

export default async function WebsiteBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Ambil data tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    redirect("/dashboard");
  }

  // 2. Ambil data page sections
  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("tenant_id", tenant.id);

  const heroData = sections?.find((s) => s.section_type === "hero")?.content;
  const featuresData = sections?.find((s) => s.section_type === "features")?.content;

  return (
    // Container dibuat p-0 agar panel builder bisa mengambil full lebar dan tinggi sisa
    <div className="w-full h-full bg-white">
      <BuilderForm tenant={tenant} heroData={heroData} featuresData={featuresData} />
    </div>
  );
}
