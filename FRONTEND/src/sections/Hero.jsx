// Normalizing casing to frontend tree
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "../components/ui/Button.jsx";
import { fetchHomePublic } from "../services/api.js";

export default function Hero() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const item = await fetchHomePublic();
      setHome(item);
    } catch {
      setHome(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!loading && !home) {
    return null;
  }

  const bioParts = (home?.bio || "").split(/\n\n+/).filter(Boolean);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-20"
    >
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-amber-400/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/10 bg-linear-to-b from-orange-500/5 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        {home?.profile_image && (
          <div className="mb-8 h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-900/80 shadow-xl ring-2 ring-orange-500/20 sm:h-32 sm:w-32">
            <img
              src={home.profile_image}
              alt={home.name || "Profile"}
              className="h-full w-full object-cover"
              width={128}
              height={128}
              loading="lazy"
            />
          </div>
        )}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            {/* Visually hidden H1 for Google SEO Ranking */}
            <div className="sr-only">
              <h1>Mr Ankish</h1>
              <h2>Voice of Ankish 7</h2>
              <h3>Ankish Kumar India</h3>
              <p>
                Official portfolio of Mr Ankish (Ankish Kumar India), a dedicated AI Developer and Web Developer. 
                Creator of Voice of Ankish 7 and the Bharat Ek Kahani project. Exploring the intersection of 
                modern web technologies and creative storytelling.
              </p>
            </div>

            <motion.p
              className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-orange-400/90"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {home?.title}
            </motion.p>
            <motion.h2
              className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              Hi, I&apos;m{" "}
              <span className="bg-linear-to-r from-[#ff7a18] to-[#ffb347] bg-clip-text text-transparent">
                {home?.name || "ANKISH KUMAR"}
              </span>
            </motion.h2>
            <div className="mx-auto mt-5 max-w-xl space-y-3 text-lg text-slate-300 sm:text-xl">
              {bioParts.slice(0, 2).map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.14 + i * 0.06 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
            {bioParts.length > 2 ? (
              <motion.p
                className="mx-auto mt-4 max-w-xl text-slate-400"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28 }}
              >
                {bioParts.slice(2).join(" ")}
              </motion.p>
            ) : null}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36 }}
            >
              <ButtonLink href="#projects" variant="primary">
                View Projects
              </ButtonLink>
              <ButtonLink href="#contact" variant="outline">
                Contact Me
              </ButtonLink>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
