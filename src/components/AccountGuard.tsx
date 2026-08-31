import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export function AccountGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLang();

  if (loading) {
    return <p className="mx-auto max-w-5xl px-4 py-24 text-sm text-muted-foreground sm:px-6">{t("common.loading")}</p>;
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-foreground">{t("acc.signInRequired")}</p>
        <Link
          to="/auth"
          className="lift mt-6 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          {t("auth.loginSignup")}
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}