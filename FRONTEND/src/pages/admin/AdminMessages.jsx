import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { deleteAdminMessage, fetchAdminMessages } from "../../services/api.js";

export default function AdminMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchAdminMessages();
      setRows(data);
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

  async function remove(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteAdminMessage(id);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Messages</h1>
      <p className="mt-1 text-slate-500">Contact form entries from MongoDB</p>
      {loading ? <p className="mt-8 text-slate-500">Loading...</p> : null}
      {error ? <p className="mt-8 text-red-400">{error}</p> : null}
      {!loading && !error ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="w-24 px-4 py-3 font-medium"> </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No messages yet.
                    </td>
                  </tr>
                ) : null}
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 transition hover:bg-white/3"
                  >
                    <td className="px-4 py-4 font-medium text-slate-200">{r.name}</td>
                    <td className="px-4 py-4 text-slate-400">{r.email}</td>
                    <td className="max-w-xs truncate px-4 py-4 text-slate-400" title={r.message}>
                      {r.message}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
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
      ) : null}
    </div>
  );
}
