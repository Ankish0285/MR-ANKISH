import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createAdminExperience,
  deleteAdminExperience,
  fetchAdminExperience,
  updateAdminExperience,
} from "../../services/api.js";

const emptyForm = {
  company_name: "",
  role: "",
  start_date: "",
  end_date: "",
  is_present: false,
  duration: "",
  description: "",
};

export default function AdminExperience() {
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
      const data = await fetchAdminExperience();
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
      company_name: row.company_name || "",
      role: row.role || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      is_present: !!row.is_present,
      duration: row.duration || "",
      description: row.description || "",
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
        const updated = await updateAdminExperience(editing, form);
        setRows((r) => r.map((x) => (x.id === editing ? updated : x)));
        cancelEdit();
      } else {
        const created = await createAdminExperience(form);
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
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteAdminExperience(id);
      setRows((r) => r.filter((x) => x.id !== id));
      if (editing === id) cancelEdit();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Experience</h1>
      <p className="mt-1 text-slate-500">Company, role, duration, description</p>
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-400/90">
          {editing ? "Edit entry" : "Add entry"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Company</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.company_name}
              onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Role</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Start Date</label>
              <input
                type="month"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">End Date</label>
              <input
                type="month"
                disabled={form.is_present}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 disabled:opacity-50"
                value={form.is_present ? "" : form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 py-2">
            <input
              id="is-present"
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-orange-500"
              checked={form.is_present}
              onChange={(e) => setForm((f) => ({ ...f, is_present: e.target.checked }))}
            />
            <label htmlFor="is-present" className="text-xs font-medium text-slate-400 cursor-pointer">
              Currently working here (Present)
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Legacy Duration (Optional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="e.g. 2 years"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update" : "Add"}
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
          <table className="w-full min-w-160 text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/50 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Duration</th>
                <th className="w-28 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    No entries yet.
                  </td>
                </tr>
              ) : null}
              {rows.map((x) => (
                <tr key={x.id} className="border-b border-white/5 hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-200">{x.company_name}</td>
                  <td className="px-4 py-3 text-slate-300">{x.role}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {x.is_present
                      ? `${x.start_date || ""} - Present`
                      : x.start_date && x.end_date
                      ? `${x.start_date} - ${x.end_date}`
                      : x.duration || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => startEdit(x)} className="mr-1 rounded-lg p-2 text-slate-500 hover:text-orange-400">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(x.id)} className="rounded-lg p-2 text-slate-500 hover:text-red-400">
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
