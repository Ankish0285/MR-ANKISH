import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ImageUrlField from "../../components/admin/ImageUrlField.jsx";
import {
  createAdminAchievement,
  deleteAdminAchievement,
  fetchAdminAchievements,
  updateAdminAchievement,
} from "../../services/api.js";

const CATEGORIES = ["Certificate", "Competition", "Project", "Internship", "Other"];
const emptyForm = { title: "", content: "", date: "", image_url: "", category: "Certificate" };

export default function AdminAchievements() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchAdminAchievements();
      setRows(Array.isArray(data) ? data : []);
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

  function startEdit(row) {
    setEditing(row.id);
    setForm({
      title: row.title || "",
      content: row.description || row.content || "",
      date: row.date ? row.date.split("T")[0] : "",
      image_url: row.image_url || "",
      category: row.category || "Certificate",
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const updated = await updateAdminAchievement(editing, form);
        setRows((r) => r.map((x) => (x.id === editing ? updated : x)));
        cancelEdit();
      } else {
        const created = await createAdminAchievement(form);
        setRows((r) => [created, ...r]);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteAdminAchievement(id);
      setRows((r) => r.filter((x) => x.id !== id));
      if (editing === id) cancelEdit();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Achievements</h1>
      <p className="mt-1 text-slate-500">Manage certificates, awards, and milestones</p>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-400/90">
          {editing ? "Edit achievement" : "New achievement"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Title *</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          />
        </div>
        <ImageUrlField
          id="ach-img"
          label="Achievement Image / Certificate"
          value={form.image_url}
          onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
          disabled={saving}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update" : "Add Achievement"}
          </button>
          {editing ? (
            <button type="button" onClick={cancelEdit} className="text-sm text-slate-400 hover:text-white">
              Cancel
            </button>
          ) : null}
        </div>
      </motion.form>

      {loading ? <p className="mt-10 text-slate-500">Loading…</p> : null}
      {!loading ? (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
          <table className="w-full min-w-120 text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/50 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="w-28 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id} className="border-b border-white/5 hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-medium text-slate-200">{x.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/20">
                      {x.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(x.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(x)} className="mr-1 p-2 text-slate-500 hover:text-orange-400">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(x.id)} className="p-2 text-slate-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
