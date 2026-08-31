import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import {
  adminDeleteProduct,
  adminListProducts,
  adminLogin,
  adminLogout,
  adminSaveProduct,
  adminStatus,
  adminTogglePublished,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Product = {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  category: string;
  price: number | null;
  currency: string;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

const emptyForm = {
  id: "",
  title: "",
  title_ar: "",
  description: "",
  description_ar: "",
  category: "package",
  price: "",
  currency: "EGP",
  image_url: "",
  published: true,
  sort_order: 0,
};

const input =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold";
const label = "block text-xs font-medium uppercase tracking-wide text-muted-foreground";

function AdminPage() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const list = useServerFn(adminListProducts);
  const save = useServerFn(adminSaveProduct);
  const remove = useServerFn(adminDeleteProduct);
  const togglePublished = useServerFn(adminTogglePublished);

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ ...emptyForm });

  const refresh = async () => {
    try {
      const rows = (await list()) as Product[];
      setProducts(rows);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    void (async () => {
      const s = await status();
      setAuthed(s.admin);
      if (s.admin) await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await login({ data: creds });
      if (!res.ok) setError("Invalid username or password.");
      else {
        setAuthed(true);
        setCreds({ username: "", password: "" });
        await refresh();
      }
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await save({
        data: {
          ...(form.id ? { id: form.id } : {}),
          title: form.title,
          title_ar: form.title_ar,
          description: form.description,
          description_ar: form.description_ar,
          category: form.category,
          price: form.price === "" ? null : Number(form.price),
          currency: form.currency,
          image_url: form.image_url,
          published: form.published,
          sort_order: Number(form.sort_order) || 0,
        },
      });
      setMessage(form.id ? "Product updated." : "Product added.");
      setForm({ ...emptyForm });
      await refresh();
    } catch {
      setError("Could not save the product.");
    } finally {
      setBusy(false);
    }
  };

  if (authed === null) {
    return <p className="mx-auto max-w-5xl px-4 py-24 text-sm text-muted-foreground sm:px-6">Loading…</p>;
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
        <h1 className="font-display text-3xl text-foreground">Admin dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Private area. Sign in to manage the website.</p>
        <form onSubmit={onLogin} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className={label} htmlFor="u">
              Username
            </label>
            <input
              id="u"
              className={`${input} mt-1.5`}
              autoComplete="username"
              value={creds.username}
              onChange={(e) => setCreds((c) => ({ ...c, username: e.target.value }))}
            />
          </div>
          <div>
            <label className={label} htmlFor="p">
              Password
            </label>
            <input
              id="p"
              type="password"
              className={`${input} mt-1.5`}
              autoComplete="current-password"
              value={creds.password}
              onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="lift w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6" dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add and manage products / offers shown on the website.</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            setAuthed(false);
          }}
          className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-gold"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={onSave} className="mt-10 grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
        <p className="sm:col-span-2 font-display text-xl text-foreground">
          {form.id ? "Edit product" : "Add a product"}
        </p>
        <div>
          <label className={label}>Title (EN)</label>
          <input
            className={`${input} mt-1.5`}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={label}>العنوان (AR)</label>
          <input
            className={`${input} mt-1.5`}
            value={form.title_ar}
            onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))}
          />
        </div>
        <div>
          <label className={label}>Description (EN)</label>
          <textarea
            rows={3}
            className={`${input} mt-1.5`}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div>
          <label className={label}>الوصف (AR)</label>
          <textarea
            rows={3}
            className={`${input} mt-1.5`}
            value={form.description_ar}
            onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
          />
        </div>
        <div>
          <label className={label}>Category</label>
          <select
            className={`${input} mt-1.5`}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="package">Package</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
            <option value="flight">Flight</option>
            <option value="visa">Visa</option>
            <option value="general">General</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Price</label>
            <input
              type="number"
              step="0.01"
              className={`${input} mt-1.5`}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </div>
          <div>
            <label className={label}>Currency</label>
            <input
              className={`${input} mt-1.5`}
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Image URL</label>
          <input
            className={`${input} mt-1.5`}
            placeholder="https://…"
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            Order
            <input
              type="number"
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
            />
          </label>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="lift rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : form.id ? "Save changes" : "Add product"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm({ ...emptyForm })}
              className="rounded-md border border-border px-5 py-3 text-sm text-foreground"
            >
              Cancel
            </button>
          ) : null}
          {message ? <span className="text-sm text-gold">{message}</span> : null}
          {error ? <span className="text-sm text-destructive">{error}</span> : null}
        </div>
      </form>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-foreground">Manage products &amp; offers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} total · {products.filter((p) => p.published).length} published ·{" "}
            {products.filter((p) => !p.published).length} hidden
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-gold"
        >
          Refresh
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            {p.image_url ? (
              <img src={p.image_url} alt="" className="h-14 w-20 rounded-md object-cover" loading="lazy" />
            ) : (
              <div className="grid h-14 w-20 place-items-center rounded-md border border-dashed border-border text-[0.6rem] uppercase tracking-wide text-muted-foreground">
                no image
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base text-foreground">
                {p.title}
                {p.title_ar ? <span className="text-muted-foreground"> — {p.title_ar}</span> : null}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {p.category}
                {p.price != null ? ` · ${p.price} ${p.currency}` : ""} · order {p.sort_order}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] ${
                p.published
                  ? "bg-gold/15 text-gold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {p.published ? "Published" : "Hidden"}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await togglePublished({ data: { id: p.id, published: !p.published } });
                  await refresh();
                  setMessage(p.published ? "Product hidden." : "Product published.");
                } catch {
                  setError("Could not change visibility.");
                } finally {
                  setBusy(false);
                }
              }}
              className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-gold disabled:opacity-60"
            >
              {p.published ? "Hide" : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  id: p.id,
                  title: p.title,
                  title_ar: p.title_ar ?? "",
                  description: p.description ?? "",
                  description_ar: p.description_ar ?? "",
                  category: p.category,
                  price: p.price != null ? String(p.price) : "",
                  currency: p.currency,
                  image_url: p.image_url ?? "",
                  published: p.published,
                  sort_order: p.sort_order,
                });
                setMessage("");
                setError("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-gold"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                setBusy(true);
                try {
                  await remove({ data: { id: p.id } });
                  if (form.id === p.id) setForm({ ...emptyForm });
                  await refresh();
                  setMessage("Product deleted.");
                } catch {
                  setError("Could not delete the product.");
                } finally {
                  setBusy(false);
                }
              }}
              className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No products yet — add your first one using the form above.
          </p>
        ) : null}
      </div>
    </div>
  );
}
