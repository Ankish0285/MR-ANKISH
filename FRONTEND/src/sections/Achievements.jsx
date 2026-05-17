import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchAchievementsPublic } from "../services/api.js";

const CATEGORIES = ["All", "Certificate", "Competition", "Project", "Internship"];

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchAchievementsPublic();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load achievements. Please ensure the backend is running.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((x) => filter === "All" || x.category === filter);

  function formatDate(str) {
    if (!str) return "";
    try {
      const d = new Date(str);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return str;
    }
  }

  return (
    <section id="achievements" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.h2
            className="font-display text-3xl font-bold text-white md:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Achievements
          </motion.h2>
          <motion.p
            className="mx-auto mt-3 max-w-2xl text-slate-400"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            My certificates, achievements, competitions, project highlights and memorable moments.
          </motion.p>
        </div>

        {/* Filter Chips */}
        {!loading && items.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  filter === c
                    ? "bg-orange-500 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-slate-500">Loading achievements…</p>
          </div>
        ) : null}

        {error ? (
          <p className="mt-12 text-center text-sm text-red-400">{error}</p>
        ) : null}

        {!loading && !error && filtered.length === 0 ? (
          <div className="mt-20 rounded-2xl border border-dashed border-white/10 bg-slate-900/20 py-20 text-center">
            <p className="text-slate-500">No achievements yet.</p>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id || i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl shadow-black/30 backdrop-blur-sm transition-all hover:border-orange-500/30 hover:shadow-orange-500/5"
              >
                <div
                  className="relative aspect-video w-full cursor-zoom-in overflow-hidden bg-slate-800"
                  onClick={() => item.image_url && setSelectedImg(item.image_url)}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-700">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 backdrop-blur-md ring-1 ring-white/10">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.date)}
                  </div>
                  <h3 className="font-display line-clamp-2 text-lg font-bold text-white group-hover:text-orange-400 transition">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => item.image_url && setSelectedImg(item.image_url)}
                      className="flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
                    >
                      View Details
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-5 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            <motion.button
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-8 w-8" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImg}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              alt="Preview"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
