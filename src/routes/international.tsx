import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { useDestinations } from "@/lib/site-data";

export const Route = createFileRoute("/international")({
  head: () => ({
    meta: [
      { title: "International Tourism & Visas — GlobeVisa Online" },
      {
        name: "description",
        content:
          "Choose your destination country and travel type — tourism or business — and we prepare the visa file and travel plan.",
      },
      { property: "og:title", content: "International Tourism & Visas — GlobeVisa Online" },
      { property: "og:description", content: "Dubai, Istanbul, Paris, London and beyond: tourism or business travel." },
    ],
  }),
  component: InternationalPage,
});

function InternationalPage() {
  const { t, lang } = useLang();
  const items = useDestinations("international", lang);
  const [country, setCountry] = useState<string | null>(null);
  const [other, setOther] = useState("");
  const [purpose, setPurpose] = useState<"tourism" | "business" | null>(null);

  const chosenCountry = country ? (items.find((x) => x.id === country)?.name ?? country) : other;
  const ready = Boolean(chosenCountry && purpose);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.international")} title={t("intl.question")} lead={t("intl.intro")} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((d, i) => {
          const active = country === d.id;
          return (
            <Reveal key={d.id} delay={i * 80}>
              <button
                type="button"
                onClick={() => {
                  setCountry(d.id);
                  setOther("");
                }}
                aria-pressed={active}
                className={`lift group relative block h-full w-full overflow-hidden rounded-xl border text-start ${
                  active ? "border-gold ring-1 ring-gold" : "border-border"
                }`}
              >
                <span className="block aspect-3/4 overflow-hidden sm:aspect-4/5">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-deep/95 via-navy-deep/60 to-transparent p-5">
                  <span className="block font-display text-lg text-white">{d.name}</span>
                  <span className="mt-1 block text-xs text-gold-soft">{d.blurb}</span>
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-10">
        <label htmlFor="intl-other" className="block text-sm font-medium text-foreground">
          {t("intl.otherCountry")}
        </label>
        <input
          id="intl-other"
          value={other}
          onChange={(e) => {
            setOther(e.target.value);
            setCountry(null);
          }}
          className="mt-3 w-full max-w-md rounded-md border border-input bg-card px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-2xl text-foreground">{t("intl.purpose")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {(
            [
              { id: "tourism" as const, title: "intl.tourism", desc: "intl.tourismD" },
              { id: "business" as const, title: "intl.business", desc: "intl.businessD" },
            ]
          ).map((opt) => {
            const active = purpose === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPurpose(opt.id)}
                aria-pressed={active}
                className={`lift rounded-xl border bg-card p-7 text-start ${
                  active ? "border-gold ring-1 ring-gold" : "border-border"
                }`}
              >
                <span className="font-display text-xl text-foreground">{t(opt.title)}</span>
                <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">{t(opt.desc)}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <div className="surface-navy rounded-xl p-7 sm:p-9">
          <p className="eyebrow">{t("intl.selected")}</p>
          <p className="mt-4 text-lg text-white">
            {t("intl.country")}: <span className="text-gold">{chosenCountry || "—"}</span>
            <span className="mx-3 text-white/30">/</span>
            {t("intl.purpose")}: <span className="text-gold">{purpose ? t(`intl.${purpose}`) : "—"}</span>
          </p>
          <p className="mt-3 text-sm text-white/70">{ready ? t("intl.ready") : t("intl.pickBoth")}</p>
          <Link
            to="/contact"
            className="lift mt-6 inline-flex items-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep"
          >
            {t("intl.send")}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}