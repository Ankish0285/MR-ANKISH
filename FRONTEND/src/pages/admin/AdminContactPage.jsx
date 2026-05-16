import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchAdminContactSettings, saveAdminContactSettings } from "../../services/api.js";

const empty = {
  public_email: "",
  blurb: "",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
  instagram_url: "",
  youtube_url: "",
  facebook_url: "",
  extra_socials: [], // [{ label: "", url: "" }]
};

export default function AdminContactPage() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    setError("");
    setOk("");
    setLoading(true);
    try {
      const data = await fetchAdminContactSettings();
      if (data) {
        setForm({
            public_email: data.public_email || "",
            blurb: data.blurb || "",
            github_url: data.github_url || "",
            linkedin_url: data.linkedin_url || "",
            twitter_url: data.twitter_url || "",
            instagram_url: data.instagram_url || "",
            youtube_url: data.youtube_url || "",
             facebook_url: data.facebook_url || "",
             extra_socials: Array.isArray(data.extra_socials) ? data.extra_socials : [],
           });
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
    setOk("");
    try {
      await saveAdminContactSettings(form);
      setOk("Saved. Public Contact section will use these links.");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function field(id, label, type = "text", placeholder = "") {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
          {label}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
          value={form[id]}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Contact page</h1>
      <p className="mt-1 text-slate-500">
        Public email + social buttons (left side of Contact). Empty fields hide that icon on the site.
      </p>
      {loading ? <p className="mt-8 text-slate-500">Loading…</p> : null}
      {!loading ? (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-8 max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6"
        >
          {field("public_email", "Public email (for mail icon)", "email", "you@example.com")}
          <div>
            <label htmlFor="cp-blurb" className="mb-1.5 block text-xs font-medium text-slate-400">
              Short text (above social icons)
            </label>
            <textarea
              id="cp-blurb"
              rows={3}
              placeholder="Have a project in mind? Reach out…"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              value={form.blurb}
              onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
            />
          </div>
          {field("github_url", "GitHub URL", "url", "https://github.com/username")}
          {field("linkedin_url", "LinkedIn URL", "url", "https://linkedin.com/in/...")}
          {field("twitter_url", "X (Twitter) URL", "url", "https://x.com/...")}
          {field("instagram_url", "Instagram URL", "url", "https://instagram.com/...")}
          {field("youtube_url", "YouTube URL", "url", "https://youtube.com/@...")}
          {field("facebook_url", "Facebook URL", "url", "https://facebook.com/...")}

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-orange-400">Extra Social Links</h3>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    extra_socials: [...f.extra_socials, { label: "", url: "" }],
                  }))
                }
                className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                <Plus className="h-4 w-4" /> Add More
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {form.extra_socials.map((social, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex gap-3 items-end"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-[10px] font-medium text-slate-500 uppercase">
                        Label (e.g. Threads)
                      </label>
                      <input
                        type="text"
                        placeholder="Label"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500/50"
                        value={social.label}
                        onChange={(e) => {
                          const newList = [...form.extra_socials];
                          newList[idx].label = e.target.value;
                          setForm((f) => ({ ...f, extra_socials: newList }));
                        }}
                      />
                    </div>
                    <div className="flex-2">
                      <label className="mb-1 block text-[10px] font-medium text-slate-500 uppercase">
                        URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500/50"
                        value={social.url}
                        onChange={(e) => {
                          const newList = [...form.extra_socials];
                          newList[idx].url = e.target.value;
                          setForm((f) => ({ ...f, extra_socials: newList }));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newList = form.extra_socials.filter((_, i) => i !== idx);
                        setForm((f) => ({ ...f, extra_socials: newList }));
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {form.extra_socials.length === 0 && (
                <p className="text-xs text-slate-500 italic">No extra social links added yet.</p>
              )}
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {ok ? <p className="text-sm text-emerald-400">{ok}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </motion.form>
      ) : null}
    </div>
  );
}
