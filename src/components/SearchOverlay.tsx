import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { searchEntries, searchSite } from "@/lib/search";

const POPULAR = ["p-flights", "d-sharm", "p-international", "i-dubai"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, dir } = useLang();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => searchSite(query, lang), [query, lang]);
  const popular = useMemo(
    () => POPULAR.map((id) => searchEntries.find((e) => e.id === id)).filter(Boolean),
    [],
  );
  const list = query.trim() ? results : (popular as typeof searchEntries);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-navy-deep/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("search.open")}
        dir={dir}
        className={`absolute inset-x-0 top-0 mx-auto w-full max-w-3xl px-4 pt-24 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 ${
          open ? "translate-y-0" : "-translate-y-6"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              aria-label={t("search.open")}
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t("search.close")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <p className="px-5 pt-4 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
              {query.trim() ? t("search.results") : t("search.popular")}
            </p>

            {query.trim() && results.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="font-display text-lg text-foreground">{t("search.none")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("search.noneHint")}</p>
              </div>
            ) : (
              <ul className="p-3">
                {list.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      to={entry.to}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-secondary"
                    >
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt=""
                          loading="lazy"
                          className="h-12 w-16 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-secondary text-gold">
                          <Search className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-base text-foreground">
                          {t(entry.titleKey)}
                        </span>
                        {entry.descKey ? (
                          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                            {t(entry.descKey)}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                        {t(entry.categoryKey)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-white/60">{t("search.hint")}</p>
      </div>
    </div>
  );
}