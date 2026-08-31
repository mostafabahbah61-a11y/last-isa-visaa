import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "gv-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("unauthorized");
  return session;
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: Boolean(session.data.admin) };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = process.env["ADMIN_USERNAME"];
    const pass = process.env["ADMIN_PASSWORD"];
    if (!user || !pass) throw new Error("admin-credentials-missing");
    if (!matches(data.username ?? "", user) || !matches(data.password ?? "", pass)) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id?: string;
      title: string;
      title_ar?: string | null;
      description?: string | null;
      description_ar?: string | null;
      category?: string;
      price?: number | null;
      currency?: string;
      image_url?: string | null;
      published?: boolean;
      sort_order?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.title?.trim()) throw new Error("title-required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      title: data.title.trim(),
      title_ar: data.title_ar?.trim() || null,
      description: data.description?.trim() || null,
      description_ar: data.description_ar?.trim() || null,
      category: data.category?.trim() || "general",
      price: data.price ?? null,
      currency: data.currency?.trim() || "EGP",
      image_url: data.image_url?.trim() || null,
      published: data.published ?? true,
      sort_order: data.sort_order ?? 0,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const, id: data.id };
    }
    const { data: inserted, error } = await supabaseAdmin
      .from("products")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: inserted.id };
  });

export const adminTogglePublished = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; published: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("products")
      .update({ published: data.published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ---------- Site content (all texts) ---------- */

export const adminListContent = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("site_content").select("key,value_en,value_ar");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const adminSaveContent = createServerFn({ method: "POST" })
  .inputValidator((data: { entries: { key: string; value_en: string; value_ar: string }[] }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = data.entries
      .filter((e) => e.key)
      .map((e) => ({ key: e.key, value_en: e.value_en, value_ar: e.value_ar }));
    if (rows.length === 0) return { ok: true as const };
    const { error } = await supabaseAdmin.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminResetContent = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_content").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ---------- Destinations ---------- */

export const adminListDestinations = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("destinations")
    .select("*")
    .order("scope", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const adminSaveDestination = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id?: string;
      slug: string;
      scope: string;
      name: string;
      name_ar?: string | null;
      blurb?: string | null;
      blurb_ar?: string | null;
      image_url?: string | null;
      published?: boolean;
      sort_order?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.name?.trim()) throw new Error("name-required");
    const slug = (data.slug || data.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) throw new Error("slug-required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      slug,
      scope: data.scope === "international" ? "international" : "domestic",
      name: data.name.trim(),
      name_ar: data.name_ar?.trim() || null,
      blurb: data.blurb?.trim() || null,
      blurb_ar: data.blurb_ar?.trim() || null,
      image_url: data.image_url?.trim() || null,
      published: data.published ?? true,
      sort_order: data.sort_order ?? 0,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("destinations").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const, id: data.id };
    }
    const { data: inserted, error } = await supabaseAdmin
      .from("destinations")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: inserted.id };
  });

export const adminToggleDestination = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; published: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("destinations")
      .update({ published: data.published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteDestination = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("destinations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
