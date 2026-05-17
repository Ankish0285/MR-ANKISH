import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminUploadImage,
  createAdminAbout,
  deleteAdminAbout,
  fetchAdminAbout,
  updateAdminAbout,
} from "../../services/api.js";

const empty = { description: "", resume_link: "" };

export default function AdminAbout() {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminAbout();
      const it = data; // Admin API returns object directly, not wrapped in .item
      setItem(it);
      if (it && it.id) {
        setForm({
          description: it.description || "",
          resume_link: it.resume_link || "",
        });
      } else {
        setForm(empty);
      }
    } catch (e) {
      if (e.message !== "Network error — from FRONTEND run npm run dev (API + site), or start Flask in BACKEND." && 
          !e.message.includes("Unexpected token")) {
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
      if (item?.id) {
        const updated = await updateAdminAbout(item.id, form);
        setItem(updated);
      } else {
        const created = await createAdminAbout(form);
        setItem(created);
      }
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item?.id || !window.confirm("Delete about content?")) return;
    try {
      await deleteAdminAbout(item.id);
      setItem(null);
      setForm(empty);
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const data = await adminUploadImage(file);
      if (data?.url) {
        setForm((f) => ({ ...f, resume_link: data.url }));
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">About</h1>
      <p className="mt-1 text-slate-500">Description and resume link</p>
      {loading ? <p className="mt-8 text-slate-500">Loading…</p> : null}
      {!loading && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="a-desc">
              Description
            </label>
            <textarea
              id="a-desc"
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="a-res">
              Resume link (PDF URL)
            </label>
            <div className="flex gap-2">
              <input
                id="a-res"
                type="url"
                className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                value={form.resume_link}
                onChange={(e) => setForm((f) => ({ ...f, resume_link: e.target.value }))}
                placeholder="https://..."
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {saving ? "Saving…" : item?.id ? "Update" : "Create"}
            </button>
            {item?.id ? (
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
      )}
    </div>
  );
}
