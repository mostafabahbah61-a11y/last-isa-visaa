import { Link } from "@tanstack/react-router";
import logo from "@/assets/globevisa-logo.jpg.asset.json";
import signature from "@/assets/creator-signature.png.asset.json";
import { navItems } from "@/lib/destinations";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="surface-navy mt-24 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="inline-block rounded-md bg-white p-2 ring-1 ring-gold/30">
            <img src={logo.url} alt={t("brand.name")} width={880} height={700} className="h-14 w-auto" loading="lazy" />
          </span>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">{t("info.whoD")}</p>
          <p className="mt-4 text-xs text-white/50">{t("footer.note")}</p>
        </div>
        <div>
          <p className="eyebrow">{t("footer.sections")}</p>
          <div className="gold-rule mt-3" />
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-white/80 transition-colors duration-300 hover:text-gold">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between" dir="ltr">
          <p className="text-xs text-white/50 sm:order-1">
            © {new Date().getFullYear()} {t("brand.name")} · {t("footer.rights")}
          </p>
          <div className="flex flex-col items-center sm:order-2 sm:items-end">
            <span className="text-[0.62rem] tracking-[0.28em] text-gold/80 uppercase">{t("footer.creator")}</span>
            <img
              src={signature.url}
              alt={t("footer.creator")}
              loading="lazy"
              className="mt-1 h-12 w-auto opacity-95 sm:h-14"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}