"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveWebsiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Ambil tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!tenant) {
    return { error: "Kos belum terdaftar." };
  }

  // 2. Ekstrak data tema
  const primaryColor = formData.get("primaryColor") as string;
  const fontFamily = formData.get("fontFamily") as string;
  const theme = { primaryColor, fontFamily };

  // Update theme di tenants
  await supabase.from("tenants").update({ theme }).eq("id", tenant.id);

  // 3. Ekstrak data hero section
  const layoutOrderStr = formData.get("layoutOrder") as string;
  const layoutOrder = layoutOrderStr ? layoutOrderStr.split(",") : ["hero", "features", "gallery"];

  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const heroCtaText = formData.get("heroCtaText") as string;

  const heroContent = {
    title: heroTitle,
    subtitle: heroSubtitle,
    ctaText: heroCtaText,
  };

  const heroOrderIndex = layoutOrder.indexOf("hero") + 1;

  // Upsert hero section
  const { data: existingHero } = await supabase
    .from("page_sections")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("section_type", "hero")
    .maybeSingle();

  if (existingHero) {
    await supabase.from("page_sections").update({ content: heroContent, order_index: heroOrderIndex }).eq("id", existingHero.id);
  } else {
    await supabase.from("page_sections").insert({
      tenant_id: tenant.id,
      section_type: "hero",
      content: heroContent,
      order_index: heroOrderIndex,
    });
  }

  // 4. Ekstrak data features
  const feature1Text = formData.get("feature1Text") as string;
  const feature2Text = formData.get("feature2Text") as string;
  const feature3Text = formData.get("feature3Text") as string;

  const featuresContent = {
    title: formData.get("featuresTitle") as string || "Fasilitas & Keunggulan",
    items: [
      { icon: "CheckCircle2", text: feature1Text },
      { icon: "CheckCircle2", text: feature2Text },
      { icon: "CheckCircle2", text: feature3Text },
    ].filter(f => f.text) // Hapus yang kosong
  };

  const featuresOrderIndex = layoutOrder.indexOf("features") + 1;

  const { data: existingFeatures } = await supabase
    .from("page_sections")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("section_type", "features")
    .maybeSingle();

  if (existingFeatures) {
    await supabase.from("page_sections").update({ content: featuresContent, order_index: featuresOrderIndex }).eq("id", existingFeatures.id);
  } else {
    await supabase.from("page_sections").insert({
      tenant_id: tenant.id,
      section_type: "features",
      content: featuresContent,
      order_index: featuresOrderIndex,
    });
  }

  revalidatePath("/dashboard/website-builder");
  return { success: "Perubahan website berhasil disimpan!" };
}
