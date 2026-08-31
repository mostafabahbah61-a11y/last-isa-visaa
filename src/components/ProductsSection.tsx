import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

type Product = {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  category: string;
  price: number | null;
  currency: string;
  image_url: string | null;
};

export function ProductsSection() {
  const { t, lang } = useLang();
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,title_ar,description,description_ar,category,price,currency,image_url")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const products = data ?? [];
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal>
        <p className="eyebrow">{t("products.eyebrow")}</p>
        <div className="gold-rule mt-3" />
        <h2 className="mt-5 font-display text-3xl text-foreground sm:text-4xl">{t("products.title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("products.lead")}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => {
          const title = (lang === "ar" && p.title_ar) || p.title;
          const desc = (lang === "ar" && p.description_ar) || p.description;
          return (
            <Reveal key={p.id} delay={i * 70}>
              <article className="lift flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
                {p.image_url ? (
                  <img src={p.image_url} alt={title} loading="lazy" className="h-48 w-full object-cover" />
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">{p.category}</span>
                  <h3 className="mt-2 font-display text-xl text-foreground">{title}</h3>
                  {desc ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p> : null}
                  <div className="mt-auto flex items-center justify-between pt-6">
                    {p.price != null ? (
                      <span className="font-display text-lg text-foreground">
                        {p.price} {p.currency}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link to="/contact" className="text-sm font-medium text-gold hover:underline">
                      {t("products.enquire")}
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
