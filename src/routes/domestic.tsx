import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { useDestinations } from "@/lib/site-data";

export const Route = createFileRoute("/domestic")({
  head: () => ({
    meta: [
      { title: "Domestic Tourism in Egypt — GlobeVisa Online" },
      {
        name: "description",
        content:
          "Plan trips inside Egypt with GlobeVisa Online: Sharm El-Sheikh, Hurghada, Luxor and Aswan stays, transfers and programmes.",
      },
      { property: "og:title", content: "Domestic Tourism in Egypt — GlobeVisa Online" },
      { property: "og:description", content: "Sharm El-Sheikh, Hurghada, Luxor and Aswan trips arranged end to end." },
    ],
  }),
  component: DomesticPage,
});

function DomesticPage() {
  const { t, lang } = useLang();
  const items = useDestinations("domestic", lang);
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.domestic")} title={t("dom.question")} lead={t("dom.intro")} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((d, i) => {
          const active = selected === d.id;
          return (
            <Reveal key={d.id} delay={i * 80}>
              <button
                type="button"
                onClick={() => setSelected(d.id)}
                aria-pressed={active}
                className={`lift group block h-full w-full overflow-hidden rounded-xl border bg-card text-start shadow-sm ${
                  active ? "border-gold ring-1 ring-gold" : "border-border"
                }`}
              >
                <span className="block aspect-4/3 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="block p-5">
                  <span className="block font-display text-lg text-foreground">{d.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{d.blurb}</span>
                  <span className="mt-4 inline-block text-xs tracking-[0.16em] text-gold uppercase">
                    {t("dom.explore")}
                  </span>
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-12">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <label htmlFor="dom-other" className="block text-sm font-medium text-foreground">
            {t("dom.other")}
          </label>
          <input
            id="dom-other"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={t("dom.pick")}
            className="mt-3 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="lift inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("common.goContact")}
            </Link>
            {selected || custom ? (
              <p className="text-sm text-muted-foreground">
                {t("intl.selected")}: {selected ? (items.find((x) => x.id === selected)?.name ?? selected) : custom}
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>
    </div>
  );
}