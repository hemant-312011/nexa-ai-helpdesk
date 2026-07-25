function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <span className="text-xl">✦</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-white">AI Helpdesk Assistant</h1>

            <span className="hidden rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 sm:inline">
              AI Powered
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />

            <p className="text-xs text-slate-400">
              Online · Usually replies instantly
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open options"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        ⋯
      </button>
    </header>
  );
}

export default Header;
