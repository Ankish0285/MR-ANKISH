import { useRef, useState } from "react";
import { adminUploadImage } from "../../services/api.js";

export default function ImageUrlField(props) {
  const { id, label, value, onChange, disabled } = props;
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setUploading(true);
    try {
      const data = await adminUploadImage(f);
      if (data && data.url) onChange(data.url);
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="url"
          placeholder="https://..."
          className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current && inputRef.current.click()}
          className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      {value ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 p-2">
          <img src={value} alt="" className="mx-auto max-h-40 w-auto max-w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
}
