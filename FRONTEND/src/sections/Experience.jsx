// Normalizing casing to frontend tree
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchExperiencePublic } from "../services/api.js";

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchExperiencePublic();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load experience. Please ensure the backend is running.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function formatDate(str) {
    if (!str) return "";
    try {
      const [y, m] = str.split("-");
      const date = new Date(y, m - 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return str;
    }
  }

  return (
    <section id="experience" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="font-display text-center text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h2>
        <div className="relative mt-16 pl-8 md:pl-12">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-6" />

          {loading ? (
            <p className="py-10 text-center text-slate-500">Loading…</p>
          ) : null}

          {error ? (
            <p className="py-10 text-center text-sm text-red-400">{error}</p>
          ) : null}

          <div className="space-y-12">
            {items.map((job, i) => (
              <motion.div
                key={job.id || i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pb-12 last:pb-0"
              >
                <div className="absolute -left-9.75 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-950 md:-left-11.25 md:h-10 md:w-10">
                  <Briefcase className="h-4 w-4 text-orange-400 md:h-5 md:w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-400/90">
                  {job.is_present
                    ? `${formatDate(job.start_date)} - Present`
                    : job.start_date && job.end_date
                    ? `${formatDate(job.start_date)} - ${formatDate(job.end_date)}`
                    : ""}
                  {job.duration && (
                    <span className="ml-2 text-slate-500 lowercase italic">
                      ({job.duration})
                    </span>
                  )}
                  {!job.is_present && !job.start_date && !job.duration && "—"}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">
                  {job.role}
                </h3>
                <p className="text-slate-400">{job.company_name}</p>
                {job.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {job.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
