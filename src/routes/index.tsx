import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/01-hero-cairo-airplane.jpg.asset.json";
import logo from "@/assets/globevisa-logo.jpg.asset.json";
import { Reveal } from "@/components/Reveal";
import { ProductsSection } from "@/components/ProductsSection";

import { domestic, international, navItems } from "@/lib/destinations";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlobeVisa Online — Egyptian Visa & Travel Services" },
      {
        name: "description",
        content:
          "Egyptian visa and travel services online: domestic trips, international tourism and business travel, visa files and flight bookings.",
      },
      { property: "og:title", content: "GlobeVisa Online — Egyptian Visa & Travel Services" },
      {
        property: "og:description",
        content: "Domestic and international travel, visa files and flight bookings — handled online.",
      },
    ],
  }),
  component: Index,
});

const serviceDescriptions: Record<string, string> = {
  "/domestic": "home.domesticDesc",
  "/international": "home.internationalDesc",
  "/flights": "home.flightsDesc",
  "/why-online": "home.whyDesc",
  "/info": "home.infoDesc",
  "/contact": "home.contactDesc",
};

function Index() {
  const { t } = useLang();

  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={hero.url}
          alt="A jet over the Cairo skyline with the Nile, Cairo Tower and the Giza pyramids"
          fetchPriority="high"
          className="slow-zoom absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy-deep/85 via-navy-deep/55 to-navy-deep/92" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6">
          <div className="rise flex justify-center pb-10 sm:pb-14" style={{ animationDelay: "60ms" }}>
            <span className="logo-3d-stage inline-block rounded-2xl bg-white p-4 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] ring-1 ring-gold/50 sm:p-6">
              <img
                src={logo.url}
                alt={`${t("brand.name")} — ${t("brand.tagline")}`}
                width={880}
                height={700}
                fetchPriority="high"
                className="logo-3d h-40 w-auto sm:h-64 lg:h-80"
              />
            </span>
          </div>
          <p className="eyebrow rise" style={{ animationDelay: "120ms" }}>
            {t("hero.eyebrow")}
          </p>
          <h1
            className="rise mt-5 max-w-3xl text-4xl leading-[1.1] text-white sm:text-6xl"
            style={{ animationDelay: "220ms" }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="rise mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
            style={{ animationDelay: "340ms" }}
          >
            {t("hero.subtitle")}
          </p>
          <div className="rise mt-9 flex flex-wrap gap-4" style={{ animationDelay: "460ms" }}>
            <Link
              to="/contact"
              className="lift inline-flex items-center rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep"
            >
              {t("hero.cta1")}
            </Link>
            <Link
              to="/international"
              className="lift inline-flex items-center rounded-md border border-white/40 px-7 py-3.5 text-sm font-medium text-white hover:border-gold hover:text-gold"
            >
              {t("hero.cta2")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("home.services")}</p>
          <div className="gold-rule mt-3" />
          <h2 className="mt-5 text-3xl text-foreground sm:text-4xl">{t("home.servicesSub")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item, i) => (
            <Reveal key={item.to} delay={i * 70}>
              <Link
                to={item.to}
                className="lift group flex h-full flex-col rounded-xl border border-border bg-card p-7 hover:border-gold"
              >
                <span className="text-xs tracking-[0.2em] text-gold">{item.index}</span>
                <span className="mt-3 font-display text-xl text-foreground">{t(item.key)}</span>
                <span className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(serviceDescriptions[item.to]!)}
                </span>
                <span className="mt-6 text-xs tracking-[0.16em] text-primary uppercase transition-colors group-hover:text-gold">
                  {t("home.open")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <ProductsSection />



      <section className="surface-navy py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="eyebrow">{t("nav.domestic")}</p>
            <div className="gold-rule mt-3" />
            <h2 className="mt-5 text-3xl text-white sm:text-4xl">{t("dom.question")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {domestic.map((d, i) => (
              <Reveal key={d.id} delay={i * 70}>
                <Link to="/domestic" className="lift group block overflow-hidden rounded-xl border border-white/15">
                  <span className="block aspect-4/3 overflow-hidden">
                    <img
                      src={d.image}
                      alt={t(d.key)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="block bg-white/5 p-4">
                    <span className="block font-display text-white">{t(d.key)}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <p className="eyebrow">{t("nav.international")}</p>
            <div className="gold-rule mt-3" />
            <h2 className="mt-5 text-3xl text-white sm:text-4xl">{t("intl.question")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {international.map((d, i) => (
              <Reveal key={d.id} delay={i * 70}>
                <Link
                  to="/international"
                  className="lift group relative block overflow-hidden rounded-xl border border-white/15"
                >
                  <span className="block aspect-4/5 overflow-hidden">
                    <img
                      src={d.image}
                      alt={t(d.key)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-deep/95 to-transparent p-4">
                    <span className="block font-display text-white">{t(d.key)}</span>
                    <span className="block text-xs text-gold-soft">{t(`${d.key}.d`)}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl text-foreground sm:text-4xl">{t("why.title")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("why.lead")}</p>
          <Link
            to="/why-online"
            className="lift mt-8 inline-flex items-center rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
          >
            {t("nav.why")}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
