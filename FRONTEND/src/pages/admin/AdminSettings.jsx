import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { fetchAdminSiteSettings, saveAdminSiteSettings } from "../../services/api.js";

const KEYS = [
  { key: "hero", label: "Home (Hero)" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "blog", label: "Achievements" },
  { key: "content", label: "Content Creator" },
  { key: "contact", label: "Contact" },
];

export default function AdminSettings() {
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    setError("");
    setOk("");
    setLoading(true);
    try {
      const data = await fetchAdminSiteSettings();
      setVisibility(data.visibility || {});
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

  function toggle(key) {
    setVisibility((v) => ({ ...v, [key]: v[key] === false ? true : false }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");
    try {
      await saveAdminSiteSettings(visibility);
      setOk("Saved.");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Section visibility</h1>
      <p className="mt-1 text-slate-500">Show or hide parts of the public portfolio</p>
      {loading ? <p className="mt-8 text-slate-500">Loading…</p> : null}
      {!loading && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="mt-8 max-w-lg space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6"
        >
          {KEYS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-200">{label}</span>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  visibility[key] === false ? "bg-slate-700" : "bg-orange-500/80"
                }`}
                aria-pressed={visibility[key] !== false}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                    visibility[key] === false ? "left-0.5" : "left-[calc(100%-1.625rem)]"
                  }`}
                />
              </button>
            </label>
          ))}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {ok ? <p className="text-sm text-emerald-400">{ok}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save visibility"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
