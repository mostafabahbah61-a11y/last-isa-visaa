import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Ticket, User, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export function AccountMenu() {
  const { t, dir } = useLang();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex shrink-0 items-center gap-2 rounded-full border border-gold/70 bg-gold/10 px-3 py-2 text-xs font-medium text-gold transition-all duration-300 hover:bg-gold hover:text-navy-deep active:scale-95 sm:px-4 sm:text-sm"
      >
        <UserCircle2 className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{t("auth.loginSignup")}</span>
        <span className="sm:hidden">{t("auth.login")}</span>
      </Link>
    );
  }

  const name = profile?.full_name || user.email || "";
  const initial = name.trim().charAt(0).toUpperCase() || "G";

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("acc.menu")}
        className="flex items-center gap-2 rounded-full border border-white/25 py-1.5 pe-3 ps-1.5 text-white transition-all duration-300 hover:border-gold hover:text-gold active:scale-95"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm text-navy-deep">
          {initial}
        </span>
        <span className="hidden max-w-[9rem] truncate text-sm sm:inline">{name}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full mt-3 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)] ${
            dir === "rtl" ? "left-0" : "right-0"
          }`}
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate font-display text-sm text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Link
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors duration-300 hover:bg-secondary"
          >
            <User className="h-4 w-4 text-gold" aria-hidden />
            {t("acc.profile")}
          </Link>
          <Link
            to="/account/bookings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors duration-300 hover:bg-secondary"
          >
            <Ticket className="h-4 w-4 text-gold" aria-hidden />
            {t("acc.bookings")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              void navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-start text-sm text-foreground transition-colors duration-300 hover:bg-secondary"
          >
            <LogOut className="h-4 w-4 text-gold" aria-hidden />
            {t("auth.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}