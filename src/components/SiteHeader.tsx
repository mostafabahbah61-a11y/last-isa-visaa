import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/globevisa-logo.jpg.asset.json";
import { navItems } from "@/lib/destinations";
import { useLang } from "@/lib/i18n";
import { AccountMenu } from "@/components/AccountMenu";
import { SearchOverlay } from "@/components/SearchOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-deep/90 backdrop-blur-md">
        <div className="mx-auto grid h-24 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-28 sm:px-6">
          <Link
            to="/"
            aria-label={t("brand.name")}
            className="group flex min-w-0 items-center gap-4 transition-transform duration-300 active:scale-[0.98]"
          >
            <span className="logo-3d-stage shrink-0 overflow-hidden rounded-lg bg-white p-1.5 shadow-[0_14px_36px_-16px_rgba(0,0,0,0.9)] ring-1 ring-gold/40">
              <img
                src={logo.url}
                alt={`${t("brand.name")} — ${t("brand.tagline")}`}
                width={880}
                height={700}
                className="logo-3d h-16 w-auto sm:h-20"
              />
            </span>
            <span className="hidden min-w-0 leading-tight lg:block">
              <span className="block truncate font-display text-lg tracking-wide text-white">{t("brand.name")}</span>
              <span className="block truncate text-[0.72rem] text-gold-soft/80">{t("brand.tagline")}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-1 xl:flex">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3 py-2 text-sm transition-colors duration-300 ${
                    pathname === item.to ? "text-gold" : "text-white/85 hover:text-gold"
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search.open")}
              title={t("search.open")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 hover:border-gold hover:text-gold active:scale-95"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="hidden shrink-0 rounded-full border border-white/25 px-4 py-2.5 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:border-gold hover:text-gold active:scale-95 sm:block"
            >
              {t("nav.language")}
            </button>
            <ThemeToggle className="hidden sm:flex" />
            <AccountMenu />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? t("nav.close") : t("nav.menu")}
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[6px] rounded-full border border-white/25 transition-all duration-300 hover:border-gold active:scale-95"
            >
              <span
                className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "translate-y-[7px] rotate-45 bg-gold" : ""}`}
              />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span
                className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45 bg-gold" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 transition-opacity duration-400 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-navy-deep/70 backdrop-blur-sm"
        />
        <nav
          className={`surface-navy absolute top-0 h-full w-full max-w-md overflow-y-auto border-white/10 px-6 pb-10 pt-28 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            lang === "ar"
              ? `left-0 border-r ${open ? "translate-x-0" : "-translate-x-full"}`
              : `right-0 border-l ${open ? "translate-x-0" : "translate-x-full"}`
          }`}
        >
          <p className="eyebrow">{t("nav.menu")}</p>
          <div className="gold-rule mt-3" />
          <div className="mt-6 flex items-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-white/25 px-4 py-2.5 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:border-gold hover:text-gold active:scale-95"
            >
              {t("nav.language")}
            </button>
            <ThemeToggle />
          </div>
          <ul className="mt-8 space-y-1">
            {navItems.map((item, i) => {
              const active = pathname === item.to;
              return (
                <li
                  key={item.to}
                  style={{ transitionDelay: `${open ? 120 + i * 55 : 0}ms` }}
                  className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                >
                  <Link
                    to={item.to}
                    className={`flex items-baseline gap-4 border-b border-white/10 py-4 text-xl transition-colors duration-300 ${
                      active ? "text-gold" : "text-white/90 hover:text-gold"
                    }`}
                  >
                    <span className="text-xs tracking-[0.2em] text-gold/70">{item.index}</span>
                    <span className="font-display">{t(item.key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-sm leading-relaxed text-white/60">{t("footer.note")}</p>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}