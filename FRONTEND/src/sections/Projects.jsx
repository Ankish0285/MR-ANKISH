// Normalizing casing to frontend tree
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw } from "lucide-react";
import { IconGithub } from "../components/SocialIcons.jsx";
import { useCallback, useEffect, useState } from "react";
import { fetchProjects } from "../services/api.js";

function ProjectCard({ project, index }) {
  const tech = (project.tech_stack || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const demo = project.demo_url || project.url;
  const github = project.github_url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl shadow-black/30 backdrop-blur-sm"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-slate-800">
        <a href={demo || github || "#"} target="_blank" rel="noreferrer" className="block h-full w-full">
          <img
            src={
              project.image_url ||
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
            }
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />
        </a>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-white">
          <a href={demo || github || "#"} target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">
            {project.title}
          </a>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 flex-1 text-sm text-slate-400 leading-relaxed">
          {project.description || "No description yet."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {demo ? (
            <motion.a
              href={demo}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-4 py-2 text-sm font-semibold text-slate-950"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </motion.a>
          ) : null}
          {github ? (
            <motion.a
              href={github}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm text-slate-200"
            >
              <IconGithub className="h-4 w-4" />
              GitHub
            </motion.a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError(e.message || "Failed to load projects. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="projects" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-display text-center text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Projects
        </motion.h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Selected work from the API and database.
        </p>
        {loading && <p className="mt-12 text-center text-slate-500">Loading projects…</p>}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-orange-500/25 bg-slate-900/60 p-6 text-center shadow-lg"
          >
            <p className="text-sm text-red-300/95">{error}</p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => load()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </motion.button>
          </motion.div>
        )}
        {!loading && !error && projects.length === 0 && (
          <p className="mt-12 text-center text-slate-500">No projects yet.</p>
        )}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
