import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Eye,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelLeft,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import Youtube from "../../components/icons/Youtube.jsx";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../services/api.js";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/home", label: "Home", icon: Home },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/content-creator", label: "Content Creator", icon: Youtube },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/contact-page", label: "Contact page", icon: Share2 },
  { to: "/admin/settings", label: "Visibility", icon: Eye },
];

function linkClass({ isActive }) {
  return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-orange-500/15 text-orange-400"
      : "text-slate-400 hover:bg-white/5 hover:text-white"
  }`;
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  function logout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-[width,transform] duration-300 md:translate-x-0 ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full border-0 md:w-20 md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <span className="font-display truncate text-lg font-bold text-white">MR ANKISH</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      <div
        className={`transition-[margin] duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl md:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white md:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-slate-400">Admin panel</span>
          <div className="w-10" />
        </header>

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 md:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
