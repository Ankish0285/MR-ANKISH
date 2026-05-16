import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLogin, getAdminToken } from "../../services/api.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  useEffect(() => {
    if (getAdminToken()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.12),_transparent_50%)]"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <h1 className="font-display text-center text-2xl font-bold text-white">Admin login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Portfolio dashboard</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-4 text-slate-100 outline-none ring-0 transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-4 text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full rounded-xl bg-linear-to-r from-[#ff7a18] to-[#ffb347] py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
        <a
          href="/"
          className="mt-6 block text-center text-sm text-slate-500 transition hover:text-orange-400"
        >
          Back to site
        </a>
      </motion.div>
    </div>
  );
}
