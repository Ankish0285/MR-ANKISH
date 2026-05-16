import { motion } from "framer-motion";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm transition-colors";

const variants = {
  primary: `${base} bg-linear-to-r from-[#ff7a18] to-[#ffb347] font-semibold text-slate-950 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40`,
  outline: `${base} border border-slate-600/80 bg-slate-900/40 text-slate-100 hover:border-orange-400/50 hover:bg-slate-800/60`,
};

const spring = { type: "spring", stiffness: 400, damping: 22 };

export function ButtonLink({ variant = "primary", className = "", href, children, ...rest }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className={`${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export function Button({ variant = "primary", className = "", children, ...rest }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className={`${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
