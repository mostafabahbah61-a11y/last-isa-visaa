import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AccountGuard } from "@/components/AccountGuard";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "My Account — GlobeVisa Online" },
      { name: "description", content: "Manage your GlobeVisa Online profile, saved travel details and password." },
      { property: "og:title", content: "My Account — GlobeVisa Online" },
      { property: "og:description", content: "Your GlobeVisa Online customer profile and settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AccountGuard>
      <AccountPage />
    </AccountGuard>
  ),
});

const field =
  "mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30";

function AccountPage() {
  const { t } = useLang();
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", country: "", passport_number: "", notes: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      country: profile.country ?? "",
      passport_number: profile.passport_number ?? "",
      notes: profile.notes ?? "",
    });
  }, [profile]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setMsg(null);
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? null, ...form });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMsg(t("acc.saved.ok"));
    await refreshProfile();
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.length < 8) return setPwMsg(t("auth.short"));
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setPwMsg(err ? err.message : t("auth.updated"));
    if (!err) setPw("");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("acc.menu")} title={t("acc.title")} lead={t("acc.lead")} />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/account/bookings"
          className="rounded-full border border-gold/60 px-5 py-2.5 text-sm text-gold transition-colors duration-300 hover:bg-gold/10"
        >
          {t("acc.bookings")}
        </Link>
      </div>

      <Reveal className="mt-8">
        <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl text-foreground">{t("acc.personal")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fn" className="text-sm font-medium text-foreground">
                {t("auth.fullName")}
              </label>
              <input
                id="fn"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="ph" className="text-sm font-medium text-foreground">
                {t("auth.phone")}
              </label>
              <input
                id="ph"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="co" className="text-sm font-medium text-foreground">
                {t("acc.country")}
              </label>
              <input
                id="co"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="pp" className="text-sm font-medium text-foreground">
                {t("acc.passport")}
              </label>
              <input
                id="pp"
                value={form.passport_number}
                onChange={(e) => setForm({ ...form, passport_number: e.target.value })}
                className={field}
              />
            </div>
          </div>

          <h3 className="mt-8 text-lg text-foreground">{t("acc.saved")}</h3>
          <label htmlFor="nt" className="mt-4 block text-sm font-medium text-foreground">
            {t("acc.notes")}
          </label>
          <textarea
            id="nt"
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={field}
          />

          <p className="mt-5 text-sm text-muted-foreground">{user?.email}</p>
          {msg ? (
            <p className="mt-4 rounded-md border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-foreground">{msg}</p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="lift mt-7 rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? t("common.saving") : t("common.save")}
          </button>
        </form>
      </Reveal>

      <Reveal className="mt-8">
        <form onSubmit={changePassword} className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl text-foreground">{t("acc.security")}</h2>
          <label htmlFor="np" className="mt-5 block text-sm font-medium text-foreground">
            {t("auth.newPassword")}
          </label>
          <input id="np" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={field} />
          {pwMsg ? <p className="mt-4 text-sm text-muted-foreground">{pwMsg}</p> : null}
          <button
            type="submit"
            className="lift mt-6 rounded-md border border-gold px-7 py-3 text-sm font-medium text-gold"
          >
            {t("acc.changePassword")}
          </button>
        </form>
      </Reveal>
    </div>
  );
}