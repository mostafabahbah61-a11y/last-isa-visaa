import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Customer Login & Sign Up — GlobeVisa Online" },
      {
        name: "description",
        content:
          "Sign in to your GlobeVisa Online account to track visa, travel and flight requests, or create a new customer account.",
      },
      { property: "og:title", content: "Customer Login & Sign Up — GlobeVisa Online" },
      { property: "og:description", content: "Access your GlobeVisa Online customer account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "reset";

const field =
  "mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30";

function AuthPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/account" });
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "reset") {
        await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setNotice(t("auth.resetSent"));
      } else if (mode === "signup") {
        if (form.password.length < 8) {
          setError(t("auth.short"));
          return;
        }
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: form.name, phone: form.phone },
          },
        });
        if (err) throw err;
        setNotice(t("auth.signupOk"));
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setError(result.error.message ?? "Sign-in failed");
      return;
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <PageHeading
        eyebrow={t("auth.title")}
        title={mode === "signup" ? t("auth.signup") : mode === "reset" ? t("auth.reset") : t("auth.login")}
        lead={mode === "signup" ? t("auth.signupLead") : mode === "reset" ? t("auth.resetLead") : t("auth.loginLead")}
      />

      <Reveal className="mt-10">
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {mode === "signup" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  {t("auth.fullName")}
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  {t("auth.phone")}
                </label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={field}
                />
              </div>
            </div>
          ) : null}

          <div className={mode === "signup" ? "mt-5" : ""}>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
          </div>

          {mode !== "reset" ? (
            <div className="mt-5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={field}
              />
            </div>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="mt-5 rounded-md border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-foreground">
              {notice}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="lift mt-7 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy
              ? t("common.loading")
              : mode === "signup"
                ? t("auth.signup")
                : mode === "reset"
                  ? t("auth.resetSend")
                  : t("auth.login")}
          </button>

          {mode !== "reset" ? (
            <>
              <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("auth.or")}
                <span className="h-px flex-1 bg-border" />
              </div>
              <button
                type="button"
                onClick={google}
                className="w-full rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-gold"
              >
                {t("auth.google")}
              </button>
            </>
          ) : null}

          <div className="mt-7 space-y-2 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                <p>
                  {t("auth.noAccount")}{" "}
                  <button type="button" onClick={() => setMode("signup")} className="font-semibold text-gold">
                    {t("auth.signup")}
                  </button>
                </p>
                <p>
                  <button type="button" onClick={() => setMode("reset")} className="font-semibold text-gold">
                    {t("auth.forgot")}
                  </button>
                </p>
              </>
            ) : (
              <p>
                {t("auth.haveAccount")}{" "}
                <button type="button" onClick={() => setMode("login")} className="font-semibold text-gold">
                  {t("auth.backToLogin")}
                </button>
              </p>
            )}
            <p>
              <Link to="/" className="underline-offset-4 hover:underline">
                {t("common.back")}
              </Link>
            </p>
          </div>
        </form>
      </Reveal>
    </div>
  );
}