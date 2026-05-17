// Normalizing casing to frontend tree
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { fetchAboutPublic, fetchHomePublic } from "../services/api.js";

export default function About() {
  const [about, setAbout] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [homeItem, aboutItem] = await Promise.all([fetchHomePublic(), fetchAboutPublic()]);
      if (homeItem?.profile_image) setImageUrl(homeItem.profile_image);
      if (aboutItem) {
        setAbout({
          description: aboutItem.description || "",
          resume_link: aboutItem.resume_link || "",
        });
      } else {
        setAbout(null);
      }
    } catch {
      setAbout(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!loading && !about) {
    return null;
  }

  const paragraphs = (about?.description || "").split(/\n\n+/).filter(Boolean);

  return (
    <section id="about" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto aspect-square w-full max-w-sm md:mx-0"
          >
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-orange-500/30 to-amber-400/10 blur-2xl" />
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/50 ring-2 ring-orange-500/20">
              <img
                src={imageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
                width={400}
                height={400}
                loading="lazy"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">About me</h2>
          <p className="mt-2 text-sm font-medium uppercase tracking-wider text-orange-400/90">
            Portfolio · CMS driven
          </p>
          {loading ? (
            <p className="mt-6 text-slate-500">Loading…</p>
          ) : (
            <div className="mt-6 space-y-4 text-slate-400 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {about?.resume_link ? (
            <motion.a
              href={about.resume_link}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download resume
            </motion.a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
