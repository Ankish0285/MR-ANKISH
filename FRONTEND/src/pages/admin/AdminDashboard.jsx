import { motion } from "framer-motion";
import { FolderKanban, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminMessages, fetchAdminProjects } from "../../services/api.js";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ messages: 0, projects: 0 });
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [messages, projects] = await Promise.all([
          fetchAdminMessages(),
          fetchAdminProjects(),
        ]);
        if (!cancelled) {
          setCounts({ messages: messages.length, projects: projects.length });
        }
      } catch (e) {
        if (!cancelled && !e.message.includes("Unexpected token")) {
          setErr(e.message || "Failed to load stats");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: "Messages",
      value: counts.messages,
      icon: Mail,
      to: "/admin/messages",
      hint: "Contact form submissions",
    },
    {
      label: "Projects",
      value: counts.projects,
      icon: FolderKanban,
      to: "/admin/projects",
      hint: "Portfolio items",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of your portfolio data</p>
      {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={c.to}
                className="group block rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20 transition hover:border-orange-500/30 hover:bg-slate-900/80"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{c.label}</p>
                    <p className="mt-2 font-display text-4xl font-bold text-white">{c.value}</p>
                    <p className="mt-2 text-xs text-slate-600">{c.hint}</p>
                  </div>
                  <span className="rounded-xl bg-orange-500/15 p-3 text-orange-400 transition group-hover:bg-orange-500/25">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
