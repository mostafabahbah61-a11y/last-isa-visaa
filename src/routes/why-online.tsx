import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/why-online")({
  head: () => ({
    meta: [
      { title: "Why We Work Online — GlobeVisa Online" },
      {
        name: "description",
        content:
          "Documents checked before submission, written requirements, one conversation per file: how the online process works and why it is easier.",
      },
      { property: "og:title", content: "Why We Work Online — GlobeVisa Online" },
      { property: "og:description", content: "The reasoning behind our fully online visa and travel process." },
    ],
  }),
  component: WhyOnlinePage,
});

const points = ["why.p1", "why.p2", "why.p3", "why.p4", "why.p5", "why.p6"];
const steps = ["why.s1", "why.s2", "why.s3", "why.s4"];

function WhyOnlinePage() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.why")} title={t("why.title")} lead={t("why.lead")} />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {points.map((p, i) => (
          <Reveal key={p} delay={i * 70}>
            <article className="lift h-full rounded-xl border border-border bg-card p-7">
              <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 text-xl text-foreground">{t(`${p}.t`)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`${p}.d`)}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="surface-navy rounded-xl p-8 sm:p-12">
          <p className="eyebrow">{t("why.steps")}</p>
          <div className="gold-rule mt-3" />
          <ol className="mt-8 grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="border-t border-gold/40 pt-4">
                <span className="block text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{t(s)}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/contact"
            className="lift mt-10 inline-flex items-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}