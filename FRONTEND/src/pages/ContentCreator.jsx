import { motion } from "framer-motion";
import { 
  Users, 
  Video, 
  Eye, 
  Play, 
  ArrowRight, 
  ExternalLink,
  Milestone,
  X
} from "lucide-react";
import Youtube from "../components/icons/Youtube.jsx";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fetchContentCreatorPublic } from "../services/api.js";

const DEFAULT_DATA = {
  channel_name: "Voice Of Ankish 7",
  channel_desc: "Dedicated to making high-quality tutorials on coding, technology, and AI. Join me as we explore the digital landscape together.",
  channel_logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  subscribe_url: "https://youtube.com",
  stats_subscribers: "1K+",
  stats_videos: "50+",
  stats_views: "100K+",
  featured_videos: [
    {
      id: "1",
      title: "How to Build a Modern Portfolio with React & Tailwind",
      description: "In this tutorial, I'll show you how to create a stunning portfolio website from scratch using modern web technologies.",
      date: "May 10, 2024",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      link: "https://youtube.com",
    }
  ],
  shorts: [],
  playlists: [],
  journey: []
};

export default function Content() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const imgFallback = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80";

  function getYoutubeEmbedUrl(url) {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  }

  function handleVideoClick(e, link) {
    const embedUrl = getYoutubeEmbedUrl(link);
    if (embedUrl) {
      e.preventDefault();
      setActiveVideo(embedUrl);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchContentCreatorPublic();
        if (res && res.channel_name) {
          setData(res);
        } else {
          setData(DEFAULT_DATA);
        }
      } catch (e) {
        console.error("Failed to load content creator data", e);
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const s = data || DEFAULT_DATA;

  const CHANNEL_STATS = [
    { label: "Subscribers", value: s.stats_subscribers, icon: Users, color: "text-red-500" },
    { label: "Total Videos", value: s.stats_videos, icon: Video, color: "text-blue-500" },
    { label: "Total Views", value: s.stats_views, icon: Eye, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-40 pb-24 px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-linear-to-r from-orange-500/10 to-red-500/10 px-6 py-2 text-sm font-bold text-orange-400 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.15)]"
          >
            <Youtube className="h-5 w-5 animate-pulse" />
            <span className="uppercase tracking-widest">Digital Storyteller</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Content <span className="bg-linear-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">Creation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-xl text-slate-400 leading-relaxed"
          >
            Bringing ideas to life through high-quality tutorials, tech insights, and creative digital storytelling.
          </motion.p>
        </div>
      </section>

      {/* Featured Channel */}
      <section className="px-5 py-20 relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl group"
          >
            {/* Animated Banner Background */}
            {s.channel_banner ? (
              <div 
                className="absolute top-0 left-0 right-0 h-48 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                style={{ backgroundImage: `url(${s.channel_banner})` }}
              />
            ) : (
              <>
                <div className="absolute top-0 left-0 right-0 h-48 bg-linear-to-r from-orange-600 via-red-600 to-purple-600 opacity-30 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute top-0 left-0 right-0 h-48 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              </>
            )}
            <div className="absolute top-0 left-0 right-0 h-48 bg-linear-to-t from-slate-900 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center md:flex-row md:items-end gap-10 mt-12 md:mt-24">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="h-40 w-40 rounded-3xl border-8 border-slate-950 bg-slate-900 overflow-hidden shadow-2xl shrink-0 z-20 relative"
              >
                <img 
                  src={s.channel_logo || imgFallback} 
                  alt="Profile" 
                  className="h-full w-full object-cover" 
                  onError={(e) => { e.target.src = imgFallback; }}
                />
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="font-display text-4xl font-black text-white md:text-6xl tracking-tight mb-4">{s.channel_name}</h2>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    {s.channel_desc}
                  </p>
                </motion.div>
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-5">
                  <motion.a 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(220,38,38,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    href={s.subscribe_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-base font-black text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/30"
                  >
                    <Youtube className="h-6 w-6" />
                    SUBSCRIBE NOW
                  </motion.a>
                  <motion.div className="flex -space-x-3 items-center ml-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="fan" />
                      </div>
                    ))}
                    <span className="ml-4 text-sm font-bold text-slate-500 tracking-tighter">+ Join 1K+ Fans</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Stats Area with Neon Effects */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {CHANNEL_STATS.map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, backgroundColor: "rgba(15,23,42,0.6)" }}
                  className="flex flex-col items-center gap-4 rounded-4xl border border-white/5 bg-slate-950/60 p-8 transition-all relative group"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Videos - Modern Grid */}
      {s.featured_videos?.length > 0 && (
        <section className="px-5 py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-full bg-orange-500/5 -skew-y-6 pointer-events-none" />
          <div className="mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-display text-4xl font-black text-white md:text-5xl">Featured <span className="text-orange-500">Creations</span></h2>
                <p className="text-slate-400 mt-4 text-lg">Handpicked tutorials and projects that showcase my skills.</p>
              </div>
              <a href={s.subscribe_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors">
                VIEW ALL VIDEOS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {s.featured_videos.map((video, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-4xl border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-md transition-all hover:border-orange-500/50 hover:shadow-orange-500/10"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <a 
                      href={video.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block h-full w-full"
                      onClick={(e) => handleVideoClick(e, video.link)}
                    >
                      <img 
                        src={video.thumbnail || imgFallback} 
                        alt={video.title} 
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                        onError={(e) => { e.target.src = imgFallback; }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                        <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transform">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4">
                      <span className="h-px w-8 bg-orange-500/50" />
                      {video.date}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white leading-tight group-hover:text-orange-400 transition-colors">
                      <a 
                        href={video.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => handleVideoClick(e, video.link)}
                      >
                        {video.title}
                      </a>
                    </h3>
                    <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-400 font-medium">
                      {video.description}
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <a 
                        href={video.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white group/link"
                        onClick={(e) => handleVideoClick(e, video.link)}
                      >
                        WATCH NOW 
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 group-hover/link:bg-orange-500 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shorts Section - Vibrant Horizontal Scroll */}
      {s.shorts?.length > 0 && (
        <section className="px-5 py-24 bg-linear-to-b from-transparent via-orange-500/5 to-transparent">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-black text-white md:text-5xl mb-4">Trending <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Shorts</span></h2>
              <p className="text-slate-400 text-lg">Bite-sized content for quick learning and inspiration.</p>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-12 scrollbar-hide no-scrollbar -mx-5 px-5 snap-x">
              {s.shorts.map((short, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  href={short.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleVideoClick(e, short.link)}
                  className="relative h-112.5 w-72 shrink-0 overflow-hidden rounded-[2.5rem] border-2 border-white/5 bg-slate-900 snap-start group cursor-pointer shadow-2xl transition-all hover:border-red-500/40"
                >
                  <img 
                    src={short.thumbnail || imgFallback} 
                    alt={short.title} 
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                    onError={(e) => { e.target.src = imgFallback; }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">NEW SHORT</span>
                    </div>
                    <p className="text-xl font-bold text-white leading-tight">{short.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                      <Play className="h-8 w-8 text-white fill-current" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Playlists - Glassmorphism Grid */}
      {s.playlists?.length > 0 && (
        <section className="px-5 py-24 relative overflow-hidden">
          <div className="absolute -right-[10%] top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="font-display text-3xl font-black text-white px-8">Curated Playlists</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {s.playlists.map((p, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  href={p.link || "#"}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => handleVideoClick(e, p.link)}
                  className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-left shadow-xl backdrop-blur-xl transition-all hover:border-purple-500/40 hover:bg-slate-900/60"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-800 mb-6 shadow-inner">
                    <img 
                      src={p.thumbnail || imgFallback} 
                      alt={p.title} 
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                      onError={(e) => { e.target.src = imgFallback; }}
                    />
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-40 group-hover:opacity-20 transition-opacity">
                      <div className="h-12 w-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                      {p.count}
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">{p.title}</h3>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Creator Journey - Modern Timeline */}
      {s.journey?.length > 0 && (
        <section className="px-5 py-24 bg-slate-950">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl font-black text-white md:text-5xl mb-4">My Journey</h2>
              <p className="text-slate-400 text-lg">The milestones that shaped my content creation path.</p>
            </div>
            <div className="relative space-y-12">
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-orange-500 via-purple-500 to-transparent opacity-30" />
              
              {s.journey.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row gap-10 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10">
                    <Milestone className="h-5 w-5 text-orange-400" />
                  </div>
                  
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-black text-orange-500 uppercase tracking-widest mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">{milestone.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-lg font-medium">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Ultra Modern */}
      <section className="px-5 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600 opacity-5 pointer-events-none" />
        <div className="mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] border border-white/10 bg-slate-900/40 p-12 md:p-20 backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] group-hover:bg-orange-500/30 transition-colors duration-700" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-500/20 rounded-full blur-[80px] group-hover:bg-red-500/30 transition-colors duration-700" />
            
            <div className="relative z-10 text-center">
              <h2 className="font-display text-4xl font-black text-white md:text-7xl mb-8 leading-tight">
                Let&apos;s Build <br/> <span className="text-orange-500">Something Great</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                Subscribe to join a community of 1K+ learners and stay updated with the latest in tech, coding, and AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  href={s.subscribe_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto rounded-2xl bg-white px-12 py-5 text-base font-black text-slate-950 hover:bg-orange-500 hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                >
                  SUBSCRIBE NOW
                </motion.a>
                <a href="#contact" className="text-sm font-black text-white uppercase tracking-widest hover:text-orange-400 transition-colors">
                  Get in Touch
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox for Images */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-5 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            <motion.button
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-8 w-8" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImg}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              alt="Preview"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal for Watching */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-5 backdrop-blur-xl"
            onClick={() => setActiveVideo(null)}
          >
            <motion.button
              className="absolute top-5 right-5 text-slate-400 hover:text-white z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveVideo(null)}
            >
              <X className="h-10 w-10" />
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={activeVideo}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Video Player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
