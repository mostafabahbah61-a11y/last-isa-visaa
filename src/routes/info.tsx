import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import logo from "@/assets/globevisa-logo.jpg.asset.json";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/info")({
  head: () => ({
    meta: [
      { title: "About GlobeVisa Online — Visa & Travel Services" },
      {
        name: "description",
        content:
          "GlobeVisa Online is an Egyptian travel and visa services company handling domestic trips, international travel and flight bookings online.",
      },
      { property: "og:title", content: "About GlobeVisa Online" },
      { property: "og:description", content: "Who we are, what we provide and how we work." },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.info")} title={t("info.who")} lead={t("info.whoD")} />

      <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <Reveal>
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <img src={logo.url} alt={t("brand.name")} width={880} height={700} className="mx-auto h-auto w-full max-w-xs" />
          </div>
          <div className="mt-6 rounded-xl border border-border bg-card p-7">
            <h2 className="text-lg text-foreground">{t("info.owner")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("info.ownerD")}</p>
            <p className="mt-4 inline-block rounded-md border border-dashed border-gold/60 px-3 py-1 text-xs text-muted-foreground">
              {t("info.placeholder")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="text-2xl text-foreground">{t("info.what")}</h2>
          <div className="gold-rule mt-3" />
          <ul className="mt-6 space-y-4">
            {["info.w1", "info.w2", "info.w3", "info.w4"].map((k) => (
              <li key={k} className="flex gap-3 rounded-lg border border-border bg-card p-5">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                <span className="text-sm leading-relaxed text-foreground">{t(k)}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl text-foreground">{t("info.approach")}</h2>
          <div className="gold-rule mt-3" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t("info.approachD")}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t("footer.note")}</p>
        </Reveal>
      </div>
    </div>
  );
}