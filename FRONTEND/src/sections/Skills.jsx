import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchSkillsPublic } from "../services/api.js";

const LEVEL_PCT = {
  Beginner: 34,
  Intermediate: 67,
  Advanced: 100,
};

function levelToPct(level) {
  return LEVEL_PCT[level] ?? 50;
}

function Bar({ name, levelPct, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{levelPct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-[#ff7a18] to-[#ffb347]"
          initial={{ width: 0 }}
          whileInView={{ width: `${levelPct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: delay + 0.05 }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchSkillsPublic();
      setSkills(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load skills. Please ensure the backend is running.");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="skills" className="scroll-mt-24 bg-slate-900/30 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-display text-center text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Tools and stacks you manage from the admin panel.
        </p>
        {loading ? <p className="mt-12 text-center text-slate-500">Loading skills…</p> : null}
        {error ? <p className="mt-8 text-center text-sm text-red-400">{error}</p> : null}
        {!loading && !error && skills.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">No skills yet. Add them in the admin panel.</p>
        ) : null}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-slate-950/50 p-8 shadow-xl shadow-black/20 backdrop-blur-sm"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
              <Code2 className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">Your stack</h3>
          </div>
          <div className="space-y-5">
            {skills.map((s, i) => (
              <Bar
                key={s.id || s.name}
                name={s.name}
                levelPct={levelToPct(s.level)}
                delay={i * 0.04}
              />
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
