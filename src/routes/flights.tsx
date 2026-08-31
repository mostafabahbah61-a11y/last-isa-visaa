import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flight Booking — GlobeVisa Online" },
      {
        name: "description",
        content:
          "Tell us your departure city, destination and dates. GlobeVisa Online compares options and issues your ticket.",
      },
      { property: "og:title", content: "Flight Booking — GlobeVisa Online" },
      { property: "og:description", content: "From where to where — fares and timings before anything is issued." },
    ],
  }),
  component: FlightsPage,
});

function FlightsPage() {
  const { t, dir } = useLang();
  const [form, setForm] = useState({ from: "", to: "", date: "", ret: "", pax: "1" });
  const [done, setDone] = useState(false);

  const field =
    "mt-2 w-full rounded-md border border-input bg-card px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/30";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.from || !form.to) return;
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading eyebrow={t("nav.flights")} title={t("fl.title")} lead={t("fl.intro")} />

      <Reveal className="mt-10">
        <div className="surface-navy flex items-center gap-4 rounded-xl px-6 py-5">
          <span className="font-display text-lg text-white">{form.from || t("fl.fromPh")}</span>
          <span className="relative flex-1 border-t border-dashed border-gold/60">
            <span
              className="absolute -top-2.5 text-gold"
              style={{ [dir === "rtl" ? "left" : "right"]: 0, transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
              aria-hidden
            >
              ✈
            </span>
          </span>
          <span className="font-display text-lg text-white">{form.to || t("fl.toPh")}</span>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="from" className="text-sm font-medium text-foreground">
                {t("fl.from")}
              </label>
              <input
                id="from"
                required
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                placeholder={t("fl.fromPh")}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="to" className="text-sm font-medium text-foreground">
                {t("fl.to")}
              </label>
              <input
                id="to"
                required
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                placeholder={t("fl.toPh")}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="date" className="text-sm font-medium text-foreground">
                {t("fl.date")}
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="ret" className="text-sm font-medium text-foreground">
                {t("fl.return")}
              </label>
              <input
                id="ret"
                type="date"
                value={form.ret}
                onChange={(e) => setForm({ ...form, ret: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="pax" className="text-sm font-medium text-foreground">
                {t("fl.pax")}
              </label>
              <input
                id="pax"
                type="number"
                min={1}
                max={20}
                value={form.pax}
                onChange={(e) => setForm({ ...form, pax: e.target.value })}
                className={field}
              />
            </div>
          </div>

          <button
            type="submit"
            className="lift mt-8 inline-flex items-center rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
          >
            {t("fl.submit")}
          </button>

          {done ? (
            <div className="mt-6 rounded-md border border-gold/50 bg-gold/10 p-5 animate-fade-in">
              <p className="text-sm font-medium text-foreground">
                {t("fl.summary")}: {form.from} → {form.to}
                {form.date ? ` · ${form.date}` : ""} · {form.pax}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t("fl.sent")}</p>
              <Link
                to="/contact"
                className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {t("common.goContact")}
              </Link>
            </div>
          ) : null}
        </form>
      </Reveal>
    </div>
  );
}