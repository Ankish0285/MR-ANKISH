export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 md:flex-row">
        <p className="text-center text-sm text-slate-500 md:text-left">
          Copyright {year} Ankish Kumar
        </p>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="https://github.com" className="hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" className="hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
