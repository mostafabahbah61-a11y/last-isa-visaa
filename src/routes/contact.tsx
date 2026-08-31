import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GlobeVisa Online — Phone & WhatsApp" },
      {
        name: "description",
        content:
          "Contact GlobeVisa Online by phone or WhatsApp with your destination and purpose of travel to receive the requirement list.",
      },
      { property: "og:title", content: "Contact GlobeVisa Online" },
      { property: "og:description", content: "Phone and WhatsApp, direct — visa and travel requests." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [state, setState] = useState<"idle" | "error" | "ok">("idle");

  const field =
    "mt-2 w-full rounded-md border border-input bg-card px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contact || !form.message) {
      setState("error");
      return;
    }
    setState("ok");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.contact")} title={t("ct.title")} lead={t("ct.lead")} />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Reveal>
          <div className="space-y-5">
            <div className="lift rounded-xl border border-border bg-card p-7">
              <p className="eyebrow">{t("ct.phone")}</p>
              <p className="mt-3 font-display text-xl text-foreground">+20 — — — — — — —</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("ct.pending")}</p>
              <span
                aria-disabled="true"
                className="mt-5 inline-flex cursor-not-allowed items-center rounded-md bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground opacity-70"
              >
                {t("ct.call")}
              </span>
            </div>
            <div className="lift rounded-xl border border-gold/50 bg-card p-7">
              <p className="eyebrow">{t("ct.whatsapp")}</p>
              <p className="mt-3 font-display text-xl text-foreground">+20 — — — — — — —</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("ct.pending")}</p>
              <span
                aria-disabled="true"
                className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep opacity-90 transition-transform duration-300 hover:scale-[1.02]"
              >
                {t("ct.chat")}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={submit} className="rounded-xl border border-border bg-card p-7">
            <h2 className="text-xl text-foreground">{t("ct.form")}</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  {t("ct.name")}
                </label>
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="c" className="text-sm font-medium text-foreground">
                  {t("ct.contactField")}
                </label>
                <input id="c" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={field} />
              </div>
              <div>
                <label htmlFor="m" className="text-sm font-medium text-foreground">
                  {t("ct.message")}
                </label>
                <textarea
                  id="m"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={field}
                />
              </div>
            </div>
            <button
              type="submit"
              className="lift mt-7 inline-flex items-center rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("ct.send")}
            </button>
            {state === "error" ? (
              <p className="mt-4 text-sm text-destructive animate-fade-in">{t("ct.required")}</p>
            ) : null}
            {state === "ok" ? (
              <p className="mt-4 rounded-md border border-gold/50 bg-gold/10 p-4 text-sm text-foreground animate-fade-in">
                {t("ct.ok")}
              </p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </div>
  );
}