import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createAdminSkill,
  deleteAdminSkill,
  fetchAdminSkills,
  updateAdminSkill,
} from "../../services/api.js";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const emptyForm = { name: "", level: "Intermediate" };

export default function AdminSkills() {
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
      const data = await fetchAdminSkills();
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
    setForm({ name: row.name || "", level: row.level || "Intermediate" });
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
        const updated = await updateAdminSkill(editing, form);
        setRows((r) => r.map((x) => (x.id === editing ? updated : x)));
        cancelEdit();
      } else {
        const created = await createAdminSkill(form);
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
    if (!window.confirm("Delete this skill?")) return;
    try {
      await deleteAdminSkill(id);
      setRows((r) => r.filter((x) => x.id !== id));
      if (editing === id) cancelEdit();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Skills</h1>
      <p className="mt-1 text-slate-500">Skill name and level</p>
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:grid-cols-3"
      >
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-400/90">
            {editing ? "Edit skill" : "Add skill"}
          </h2>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="sk-name">
            Name
          </label>
          <input
            id="sk-name"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="sk-level">
            Level
          </label>
          <select
            id="sk-level"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
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
        {error ? <p className="md:col-span-3 text-sm text-red-400">{error}</p> : null}
      </motion.form>
      {loading ? <p className="mt-10 text-slate-500">Loading…</p> : null}
      {!loading ? (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
          <table className="w-full min-w-120 text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/50 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Level</th>
                <th className="w-28 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                    No skills yet.
                  </td>
                </tr>
              ) : null}
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-200">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.level}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="mr-1 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-orange-400"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Delete"
                    >
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
