// Normalizing casing to frontend tree
import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  IconGithub,
  IconInstagram,
  IconLinkedin,
  IconXSocial,
  IconYoutube,
  IconFacebook,
} from "../components/SocialIcons.jsx";
import { Button } from "../components/ui/Button.jsx";
import { SOCIAL } from "../constants.js";
import { fetchContactSettingsPublic, sendContact } from "../services/api.js";

const DEFAULT_BLURB =
  "Have a project or role in mind? Send a message — I will get back to you.";

function useContactDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await fetchContactSettingsPublic();
      setData(raw);
    } catch (e) {
      console.error("Failed to load contact settings", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const s = data || {};
  const configured = Boolean(s.configured);
  let emailHref = (s.email_href && String(s.email_href).trim()) || "";
  if (!emailHref && s.public_email && String(s.public_email).trim()) {
    const pe = String(s.public_email).trim();
    if (pe.includes("@") && !pe.toLowerCase().startsWith("mailto:")) emailHref = `mailto:${pe}`;
    else emailHref = pe;
  }
  if (!emailHref && !configured) emailHref = SOCIAL.email;

  const blurb = (s.blurb && String(s.blurb).trim()) || DEFAULT_BLURB;

  const gh = (s.github_url && String(s.github_url).trim()) || (!configured ? SOCIAL.github : "");
  const li = (s.linkedin_url && String(s.linkedin_url).trim()) || (!configured ? SOCIAL.linkedin : "");

  const links = [
    { key: "github", url: gh, Icon: IconGithub, label: "GitHub" },
    { key: "linkedin", url: li, Icon: IconLinkedin, label: "LinkedIn" },
    { key: "twitter", url: s.twitter_url && String(s.twitter_url).trim(), Icon: IconXSocial, label: "X" },
    { key: "instagram", url: s.instagram_url && String(s.instagram_url).trim(), Icon: IconInstagram, label: "Instagram" },
    { key: "youtube", url: s.youtube_url && String(s.youtube_url).trim(), Icon: IconYoutube, label: "YouTube" },
    { key: "facebook", url: s.facebook_url && String(s.facebook_url).trim(), Icon: IconFacebook, label: "Facebook" },
    { key: "email", url: emailHref, Icon: Mail, label: "Email" },
  ];

  if (Array.isArray(s.extra_socials)) {
    s.extra_socials.forEach((extra, idx) => {
      if (extra.url && extra.url.trim()) {
        links.push({
          key: `extra-${idx}`,
          url: extra.url.trim(),
          Icon: ExternalLink,
          label: extra.label || "Link",
        });
      }
    });
  }

  const visibleLinks = links.filter((x) => x.url);

  return { blurb, visibleLinks, loading };
}

export default function Contact() {
  const { blurb, visibleLinks, loading: settingsLoading } = useContactDisplay();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await sendContact({ name, email, message });
      setStatus({ type: "ok", text: res.message || "Message sent. Thank you." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({ type: "err", text: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-slate-900/30 px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Contact</h2>
          <p className="mt-3 text-slate-400 leading-relaxed">
            {settingsLoading ? "Loading…" : blurb}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {visibleLinks.map(({ key, url, Icon, label }) => (
              <motion.a
                key={key}
                href={url}
                target={key === "email" ? undefined : "_blank"}
                rel={key === "email" ? undefined : "noreferrer"}
                whileHover={{ scale: 1.06 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:border-orange-500/40 hover:text-orange-400"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-xl shadow-black/30 backdrop-blur-sm md:p-8"
        >
          <label className="block text-sm font-medium text-slate-400" htmlFor="c-name">
            Name
          </label>
          <input
            id="c-name"
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none ring-orange-500/0 transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <label className="mt-4 block text-sm font-medium text-slate-400" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label className="mt-4 block text-sm font-medium text-slate-400" htmlFor="c-msg">
            Message
          </label>
          <textarea
            id="c-msg"
            rows={5}
            className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-6 w-full md:w-auto"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send message"}
          </Button>
          {status && (
            <p
              className={`mt-4 text-sm ${status.type === "ok" ? "text-emerald-400" : "text-red-400"}`}
            >
              {status.text}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
