import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccountGuard } from "@/components/AccountGuard";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — GlobeVisa Online" },
      { name: "description", content: "Review every travel, visa and flight request you sent to GlobeVisa Online." },
      { property: "og:title", content: "My Bookings — GlobeVisa Online" },
      { property: "og:description", content: "Your GlobeVisa Online booking history and statuses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AccountGuard>
      <BookingsPage />
    </AccountGuard>
  ),
});

type Row = {
  id: string;
  reference: string;
  kind: string;
  title: string;
  status: string;
  created_at: string;
};

function BookingsPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("bookings")
      .select("id,reference,kind,title,status,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, [user]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("acc.menu")} title={t("acc.bookings")} lead={t("acc.bookingsLead")} />

      {rows === null ? (
        <p className="mt-10 text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : rows.length === 0 ? (
        <Reveal className="mt-10">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-display text-xl text-foreground">{t("acc.empty")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("acc.emptyHint")}</p>
            <Link
              to="/flights"
              className="lift mt-6 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("nav.flights")}
            </Link>
          </div>
        </Reveal>
      ) : (
        <ul className="mt-10 space-y-4">
          {rows.map((row, i) => (
            <Reveal key={row.id} delay={i * 60}>
              <li className="lift grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card p-6">
                <div className="min-w-0">
                  <p className="eyebrow">{t(`acc.kind.${row.kind}`)}</p>
                  <p className="mt-2 truncate font-display text-lg text-foreground">{row.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("acc.reference")}: {row.reference} · {new Date(row.created_at).toLocaleDateString(lang)}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <span className="rounded-full border border-gold/50 px-3 py-1 text-xs text-gold">
                    {t(`acc.status.${row.status}`)}
                  </span>
                  <Link
                    to="/account/bookings/$id"
                    params={{ id: row.id }}
                    className="mt-3 block text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {t("acc.view")}
                  </Link>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}