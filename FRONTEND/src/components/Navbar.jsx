import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";
import { useActiveSection } from "../hooks/useActiveSection.js";

const ALL_NAV = [
  { id: "hero", label: "Home", key: "hero" },
  { id: "about", label: "About", key: "about" },
  { id: "skills", label: "Skills", key: "skills" },
  { id: "projects", label: "Projects", key: "projects" },
  { id: "experience", label: "Experience", key: "experience" },
  { id: "achievements", label: "Achievements", key: "blog" },
  { id: "content", label: "Content Creator", key: "content", type: "route", to: "/content-creator" },
  { id: "contact", label: "Contact", key: "contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const location = useLocation();
  const { isVisible } = useSiteSettings();

  const nav = useMemo(
    () => ALL_NAV.filter((item) => item.type === "route" || isVisible(item.key)),
    [isVisible]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = (item) => {
    const isActive = item.type === "route" 
      ? location.pathname === item.to
      : active === item.id;
      
    return `rounded-lg px-3 py-2 text-sm font-medium transition-colors md:py-1 ${
      isActive ? "text-orange-400" : "text-slate-400 hover:text-white"
    }`;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/10 bg-slate-950/80 backdrop-blur-xl"
          : "border-transparent bg-slate-950/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <NavLink
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-white"
          onClick={() => setMenuOpen(false)}
        >
          MR ANKISH
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            item.type === "route" ? (
              <NavLink key={item.id} to={item.to} className={linkClass(item)}>
                {item.label}
              </NavLink>
            ) : (
              <a key={item.id} href={location.pathname === "/" ? `#${item.id}` : `/#${item.id}`} className={linkClass(item)}>
                {item.label}
              </a>
            )
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-900/50 text-slate-200 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
              {nav.map((item) => (
                item.type === "route" ? (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    className={linkClass(item)}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.id}
                    href={location.pathname === "/" ? `#${item.id}` : `/#${item.id}`}
                    className={linkClass(item)}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
