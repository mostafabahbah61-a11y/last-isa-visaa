import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccountGuard } from "@/components/AccountGuard";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account/bookings/$id")({
  head: () => ({
    meta: [
      { title: "Booking Details — GlobeVisa Online" },
      { name: "description", content: "Full details and status of your GlobeVisa Online travel request." },
      { property: "og:title", content: "Booking Details — GlobeVisa Online" },
      { property: "og:description", content: "Details of your GlobeVisa Online travel request." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AccountGuard>
      <BookingDetail />
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
  details: Record<string, unknown> | null;
};

function BookingDetail() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [row, setRow] = useState<Row | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("bookings")
      .select("id,reference,kind,title,status,created_at,details")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setRow((data as Row) ?? null));
  }, [id, user]);

  if (row === undefined) {
    return <p className="mx-auto max-w-3xl px-4 py-24 text-sm text-muted-foreground sm:px-6">{t("common.loading")}</p>;
  }
  if (row === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-foreground">{t("acc.notFound")}</p>
        <Link to="/account/bookings" className="mt-6 inline-block text-sm font-semibold text-gold">
          {t("acc.backToBookings")}
        </Link>
      </div>
    );
  }

  const entries = Object.entries(row.details ?? {}).filter(([, v]) => v !== "" && v !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t(`acc.kind.${row.kind}`)} title={row.title} />
      <Reveal className="mt-10">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">{t("acc.reference")}</dt>
              <dd className="mt-1 text-sm text-foreground">{row.reference}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t("acc.status")}</dt>
              <dd className="mt-1 text-sm text-foreground">{t(`acc.status.${row.status}`)}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t("acc.created")}</dt>
              <dd className="mt-1 text-sm text-foreground">{new Date(row.created_at).toLocaleString(lang)}</dd>
            </div>
          </dl>

          {entries.length ? (
            <>
              <h2 className="mt-8 text-lg text-foreground">{t("acc.details")}</h2>
              <dl className="mt-4 divide-y divide-border">
                {entries.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
                    <dt className="min-w-0 truncate text-sm text-muted-foreground capitalize">{k.replace(/_/g, " ")}</dt>
                    <dd className="shrink-0 text-sm text-foreground">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/account/bookings"
              className="rounded-md border border-border px-5 py-2.5 text-sm text-foreground transition-colors duration-300 hover:border-gold"
            >
              {t("acc.backToBookings")}
            </Link>
            <button
              type="button"
              onClick={async () => {
                await supabase.from("bookings").delete().eq("id", row.id);
                void navigate({ to: "/account/bookings" });
              }}
              className="rounded-md border border-destructive/50 px-5 py-2.5 text-sm text-destructive transition-colors duration-300 hover:bg-destructive/10"
            >
              {t("acc.delete")}
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}