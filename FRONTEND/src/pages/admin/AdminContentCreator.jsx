import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Users, 
  Eye, 
  Milestone,
  Play,
  Loader2,
  RefreshCw,
  Search
} from "lucide-react";
import Youtube from "../../components/icons/Youtube.jsx";
import { fetchAdminContentCreator, saveAdminContentCreator, adminUploadImage } from "../../services/api.js";
import toast from "react-hot-toast";

export default function AdminContentCreator() {
  const [data, setData] = useState({
    channel_name: "",
    channel_desc: "",
    channel_logo: "",
    channel_banner: "",
    subscribe_url: "",
    stats_subscribers: "",
    stats_videos: "",
    stats_views: "",
    featured_videos: [],
    shorts: [],
    playlists: [],
    journey: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [ytResults, setYtResults] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetchAdminContentCreator();
      if (res) {
        setData(prev => ({ ...prev, ...res }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load content creator data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    console.log("Saving Content Creator data:", data);
    try {
      const res = await saveAdminContentCreator(data);
      console.log("Save response:", res);
      if (res) {
        setData(prev => ({ ...prev, ...res }));
      }
      toast.success("Content Creator settings saved!");
    } catch (err) {
      console.error("Save error details:", err);
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(e, field, listKey = null, index = null) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await adminUploadImage(file);
      if (listKey !== null && index !== null) {
        updateListItem(listKey, index, field, res.url);
      } else {
        setData(prev => ({ ...prev, [field]: res.url }));
      }
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // Generic list management
  const addItem = (listKey, defaultItem) => {
    setData(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], defaultItem]
    }));
  };

  const removeItem = (listKey, index) => {
    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (listKey, index, field, value) => {
    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Manage Content Creator</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-600/20"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {/* Basic Channel Info */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
          <Youtube className="h-5 w-5 text-red-500" />
          Channel Branding
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Channel Name</label>
            <input
              type="text"
              value={data.channel_name}
              onChange={e => setData(prev => ({ ...prev, channel_name: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="e.g. Voice Of Ankish 7"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Subscribe URL</label>
            <input
              type="text"
              value={data.subscribe_url}
              onChange={e => setData(prev => ({ ...prev, subscribe_url: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="YouTube Channel Link"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Channel Description</label>
            <textarea
              value={data.channel_desc}
              onChange={e => setData(prev => ({ ...prev, channel_desc: e.target.value }))}
              className="w-full h-24 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none resize-none"
              placeholder="Tell your viewers about your channel..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Channel Logo URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={data.channel_logo}
                onChange={e => setData(prev => ({ ...prev, channel_logo: e.target.value }))}
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-slate-800 px-4 hover:bg-slate-700 transition">
                <ImageIcon className="h-5 w-5 text-slate-400" />
                <input type="file" className="hidden" onChange={e => handleFileUpload(e, "channel_logo")} />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Channel Banner URL (Optional)</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={data.channel_banner}
                onChange={e => setData(prev => ({ ...prev, channel_banner: e.target.value }))}
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-slate-800 px-4 hover:bg-slate-700 transition">
                <ImageIcon className="h-5 w-5 text-slate-400" />
                <input type="file" className="hidden" onChange={e => handleFileUpload(e, "channel_banner")} />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
          <Users className="h-5 w-5 text-blue-500" />
          Channel Statistics
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Subscribers</label>
            <input
              type="text"
              value={data.stats_subscribers}
              onChange={e => setData(prev => ({ ...prev, stats_subscribers: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="e.g. 1.2K+"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Total Videos</label>
            <input
              type="text"
              value={data.stats_videos}
              onChange={e => setData(prev => ({ ...prev, stats_videos: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="e.g. 150+"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Total Views</label>
            <input
              type="text"
              value={data.stats_views}
              onChange={e => setData(prev => ({ ...prev, stats_views: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="e.g. 500K+"
            />
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Video className="h-5 w-5 text-emerald-500" />
            Featured Videos
          </h2>
          <button
            onClick={() => addItem("featured_videos", { title: "", description: "", thumbnail: "", link: "", date: new Date().toLocaleDateString() })}
            className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <Plus className="h-4 w-4" />
            Add Video
          </button>
        </div>
        <div className="space-y-4">
          {data.featured_videos.map((video, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-4 relative group">
              <button
                onClick={() => removeItem("featured_videos", i)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={video.title}
                  onChange={e => updateListItem("featured_videos", i, "title", e.target.value)}
                  placeholder="Video Title"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={video.link}
                  onChange={e => updateListItem("featured_videos", i, "link", e.target.value)}
                  placeholder="YouTube Video URL"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={video.thumbnail}
                    onChange={e => updateListItem("featured_videos", i, "thumbnail", e.target.value)}
                    placeholder="Thumbnail URL"
                    className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                  />
                  <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-slate-800 px-3 hover:bg-slate-700 transition">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={e => handleFileUpload(e, "thumbnail", "featured_videos", i)} 
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={video.date}
                  onChange={e => updateListItem("featured_videos", i, "date", e.target.value)}
                  placeholder="Release Date (e.g. May 2024)"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <div className="md:col-span-2">
                  <textarea
                    value={video.description}
                    onChange={e => updateListItem("featured_videos", i, "description", e.target.value)}
                    placeholder="Brief video description..."
                    className="w-full h-16 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {data.featured_videos.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-4 italic">No featured videos added yet.</p>
          )}
        </div>
      </section>

      {/* Shorts */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Play className="h-5 w-5 text-orange-500" />
            Shorts & Reels
          </h2>
          <button
            onClick={() => addItem("shorts", { title: "", thumbnail: "", link: "" })}
            className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <Plus className="h-4 w-4" />
            Add Short
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.shorts.map((short, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-4 relative">
              <button
                onClick={() => removeItem("shorts", i)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-3">
                <input
                  type="text"
                  value={short.title}
                  onChange={e => updateListItem("shorts", i, "title", e.target.value)}
                  placeholder="Short Title"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={short.link}
                  onChange={e => updateListItem("shorts", i, "link", e.target.value)}
                  placeholder="Short URL"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={short.thumbnail}
                    onChange={e => updateListItem("shorts", i, "thumbnail", e.target.value)}
                    placeholder="Thumbnail URL"
                    className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                  />
                  <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-slate-800 px-3 hover:bg-slate-700 transition">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={e => handleFileUpload(e, "thumbnail", "shorts", i)} 
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Milestone className="h-5 w-5 text-purple-500" />
            Creator Journey
          </h2>
          <button
            onClick={() => addItem("journey", { year: "", title: "", description: "" })}
            className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </button>
        </div>
        <div className="space-y-4">
          {data.journey.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-4 relative">
              <button
                onClick={() => removeItem("journey", i)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid gap-4 md:grid-cols-4">
                <input
                  type="text"
                  value={item.year}
                  onChange={e => updateListItem("journey", i, "year", e.target.value)}
                  placeholder="Year/Date"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={e => updateListItem("journey", i, "title", e.target.value)}
                  placeholder="Milestone Title"
                  className="md:col-span-3 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <div className="md:col-span-4">
                  <textarea
                    value={item.description}
                    onChange={e => updateListItem("journey", i, "description", e.target.value)}
                    placeholder="Description..."
                    className="w-full h-16 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Eye className="h-5 w-5 text-indigo-500" />
            Curated Playlists
          </h2>
          <button
            onClick={() => addItem("playlists", { title: "", count: "", thumbnail: "", link: "" })}
            className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <Plus className="h-4 w-4" />
            Add Playlist
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.playlists.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-4 relative">
              <button
                onClick={() => removeItem("playlists", i)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-3">
                <input
                  type="text"
                  value={p.title}
                  onChange={e => updateListItem("playlists", i, "title", e.target.value)}
                  placeholder="Playlist Title"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={p.count}
                  onChange={e => updateListItem("playlists", i, "count", e.target.value)}
                  placeholder="Video Count (e.g. 12 Videos)"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={p.thumbnail}
                    onChange={e => updateListItem("playlists", i, "thumbnail", e.target.value)}
                    placeholder="Thumbnail URL"
                    className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                  />
                  <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-slate-800 px-3 hover:bg-slate-700 transition">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={e => handleFileUpload(e, "thumbnail", "playlists", i)} 
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={p.link}
                  onChange={e => updateListItem("playlists", i, "link", e.target.value)}
                  placeholder="Playlist Link"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-base font-bold text-white transition hover:bg-orange-700 disabled:opacity-50 shadow-xl shadow-orange-600/20"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save All Content Creator Settings
        </button>
      </div>
    </div>
  );
}
