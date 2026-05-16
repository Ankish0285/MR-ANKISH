import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ImageUrlField from "../../components/admin/ImageUrlField.jsx";
import {
  createAdminProject,
  deleteAdminProject,
  fetchAdminProjects,
  updateAdminProject,
} from "../../services/api.js";

const emptyForm = {
  title: "",
  description: "",
  tech_stack: "",
  github_link: "",
  live_link: "",
  image_url: "",
  visible: true,
};

export default function AdminProjects() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchAdminProjects();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      if (!e.message.includes("Unexpected token")) {
        setError(e.message || "Failed to load projects");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openEdit(p) {
    setError("");
    setEditing(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      tech_stack: p.tech_stack || "",
      github_link: p.github_url || "",
      live_link: p.demo_url || p.url || "",
      image_url: p.image_url || "",
      visible: p.visible !== false,
    });
  }

  function closeEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await createAdminProject({
        title: form.title,
        description: form.description,
        tech_stack: form.tech_stack,
        github_link: form.github_link || undefined,
        live_link: form.live_link || undefined,
        image_url: form.image_url || undefined,
        visible: form.visible,
      });
      setRows((r) => [created, ...r]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Could not create project");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminProject(editing, {
        title: form.title,
        description: form.description,
        tech_stack: form.tech_stack,
        github_link: form.github_link,
        live_link: form.live_link,
        image_url: form.image_url,
        visible: form.visible,
      });
      setRows((r) => r.map((x) => (x.id === editing ? updated : x)));
      closeEdit();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteAdminProject(id);
      setRows((r) => r.filter((x) => x.id !== id));
      if (editing === id) closeEdit();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  function field(id, label, props = {}) {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
          {label}
        </label>
        <input
          id={id}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
          value={form[id]}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
          {...props}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Projects</h1>
      <p className="mt-1 text-slate-500">Add, edit, hide, or delete portfolio projects</p>

      {!editing ? (
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleAdd}
        className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-400/90">New project</h2>
        </div>
        {field("title", "Title *", { required: true })}
        {field("tech_stack", "Tech stack (comma-separated)", { placeholder: "React, Flask, MongoDB" })}
        <div className="md:col-span-2">
          <label htmlFor="proj-desc" className="mb-1.5 block text-xs font-medium text-slate-400">
            Description
          </label>
          <textarea
            id="proj-desc"
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        {field("github_link", "GitHub link", { type: "url", placeholder: "https://github.com/..." })}
        {field("live_link", "Live demo link", { type: "url", placeholder: "https://..." })}
        <div className="md:col-span-2">
          <ImageUrlField
            id="proj-img"
            label="Image URL"
            value={form.image_url}
            onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
            disabled={saving}
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="new-visible"
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-slate-900"
            checked={form.visible}
            onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
          />
          <label htmlFor="new-visible" className="text-sm text-slate-400">
            Visible on public site
          </label>
        </div>
        <div className="md:col-span-2 flex flex-wrap items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add project"}
          </motion.button>
          {error && !editing ? <span className="text-sm text-red-400">{error}</span> : null}
        </div>
      </motion.form>
      ) : null}

      {loading && <p className="mt-10 text-slate-500">Loading projects...</p>}
      {!loading && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Tech</th>
                  <th className="px-4 py-3 font-medium">Public</th>
                  <th className="px-4 py-3 font-medium">Links</th>
                  <th className="w-28 px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No projects. Add one above.
                    </td>
                  </tr>
                )}
                {rows.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-4">
                      <div className="max-w-50 truncate font-medium text-slate-200" title={p.title}>
                        {p.title}
                      </div>
                    </td>
                    <td className="max-w-50 truncate px-4 py-4 text-slate-500">{p.tech_stack || "—"}</td>
                    <td className="px-4 py-4 text-slate-400">{p.visible === false ? "Hidden" : "Yes"}</td>
                    <td className="px-4 py-4 text-xs text-orange-400/90">
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="mr-3 hover:underline">
                          GitHub
                        </a>
                      )}
                      {(p.demo_url || p.url) && (
                        <a href={p.demo_url || p.url} target="_blank" rel="noreferrer" className="hover:underline">
                          Live
                        </a>
                      )}
                      {!p.github_url && !p.demo_url && !p.url && "—"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="mr-1 rounded-lg p-2 text-slate-500 hover:text-orange-400"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onSubmit={handleUpdate}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">Edit project</h2>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {field("title", "Title *", { required: true })}
                {field("tech_stack", "Tech stack")}
                <div>
                  <label htmlFor="edit-desc" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Description
                  </label>
                  <textarea
                    id="edit-desc"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                {field("github_link", "GitHub link", { type: "url" })}
                {field("live_link", "Live demo", { type: "url" })}
                <ImageUrlField
                  id="edit-img"
                  label="Image URL"
                  value={form.image_url}
                  onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
                  disabled={saving}
                />
                <div className="flex items-center gap-2">
                  <input
                    id="edit-visible"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-slate-900"
                    checked={form.visible}
                    onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                  />
                  <label htmlFor="edit-visible" className="text-sm text-slate-400">
                    Visible on public site
                  </label>
                </div>
              </div>
              {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button type="button" onClick={closeEdit} className="text-sm text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
