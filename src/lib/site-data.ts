import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { domestic, international, type Destination } from "@/lib/destinations";
import { dict, type Lang } from "@/lib/i18n";

export type DestinationItem = { id: string; name: string; blurb: string; image: string };

function fallback(list: Destination[], lang: Lang): DestinationItem[] {
  return list.map((d) => ({
    id: d.id,
    name: dict[d.key]?.[lang] ?? d.id,
    blurb: dict[`${d.key}.d`]?.[lang] ?? "",
    image: d.image,
  }));
}

export function useDestinations(scope: "domestic" | "international", lang: Lang): DestinationItem[] {
  const { data } = useQuery({
    queryKey: ["destinations", scope],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("slug,name,name_ar,blurb,blurb_ar,image_url,sort_order")
        .eq("scope", scope)
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!data) return fallback(scope === "domestic" ? domestic : international, lang);
  if (data.length === 0) return [];

  return data.map((d) => ({
    id: d.slug,
    name: (lang === "ar" && d.name_ar) || d.name,
    blurb: ((lang === "ar" && d.blurb_ar) || d.blurb) ?? "",
    image: d.image_url ?? "",
  }));
}
