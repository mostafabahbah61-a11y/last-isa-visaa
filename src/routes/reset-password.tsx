import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — GlobeVisa Online" },
      { name: "description", content: "Choose a new password for your GlobeVisa Online customer account." },
      { property: "og:title", content: "Set a New Password — GlobeVisa Online" },
      { property: "og:description", content: "Secure password reset for GlobeVisa Online customers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const field =
  "mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30";

function ResetPasswordPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (pw.length < 8) return setError(t("auth.short"));
    if (pw !== confirm) return setError(t("auth.mismatch"));
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (err) return setError(err.message);
    setMsg(t("auth.updated"));
    window.setTimeout(() => void navigate({ to: "/account" }), 1200);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("auth.title")} title={t("auth.setNew")} />
      <Reveal className="mt-10">
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <label htmlFor="pw" className="text-sm font-medium text-foreground">
            {t("auth.newPassword")}
          </label>
          <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={field} required />
          <label htmlFor="pw2" className="mt-5 block text-sm font-medium text-foreground">
            {t("auth.confirmPassword")}
          </label>
          <input
            id="pw2"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={field}
            required
          />
          {error ? (
            <p className="mt-5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {msg ? (
            <p className="mt-5 rounded-md border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-foreground">{msg}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="lift mt-7 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? t("common.saving") : t("common.save")}
          </button>
        </form>
      </Reveal>
    </div>
  );
}