import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import ImageUrlField from "../../components/admin/ImageUrlField.jsx";
import {
  createAdminHome,
  deleteAdminHome,
  fetchAdminHome,
  updateAdminHome,
} from "../../services/api.js";

const empty = { name: "", title: "", bio: "", profile_image: "" };

export default function AdminHome() {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminHome();
      const it = data; // Admin API returns object directly, not wrapped in .item
      setItem(it);
      if (it && it.id) {
        setForm({
          name: it.name || "",
          title: it.title || "",
          bio: it.bio || "",
          profile_image: it.profile_image || "",
        });
      } else {
        setForm(empty);
      }
    } catch (e) {
      if (!e.message.includes("Unexpected token")) {
        setError(e.message || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (item && item.id) {
        const updated = await updateAdminHome(item.id, form);
        setItem(updated);
      } else {
        const created = await createAdminHome(form);
        setItem(created);
      }
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item || !item.id || !window.confirm("Delete home content?")) return;
    try {
      await deleteAdminHome(item.id);
      setItem(null);
      setForm(empty);
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Home (Hero)</h1>
      <p className="mt-1 text-slate-500">Name, title, bio, profile image</p>
      {loading ? <p className="mt-8 text-slate-500">Loading…</p> : null}
      {!loading ? (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="h-name">
              Name
            </label>
            <input
              id="h-name"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="h-title">
              Title (tagline)
            </label>
            <input
              id="h-title"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="h-bio">
              Bio (blank lines separate paragraphs)
            </label>
            <textarea
              id="h-bio"
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>
          <ImageUrlField
            id="h-img"
            label="Profile image URL"
            value={form.profile_image}
            onChange={(v) => setForm((f) => ({ ...f, profile_image: v }))}
            disabled={saving}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {saving ? "Saving…" : item && item.id ? "Update" : "Create"}
            </button>
            {item && item.id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-red-500/40 px-6 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            ) : null}
          </div>
        </motion.form>
      ) : null}
    </div>
  );
}
