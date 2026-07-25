function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 message-animation">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
        <span className="text-sm">✦</span>
      </div>

      <div className="flex flex-col items-start">
        <p className="mb-1.5 px-1 text-xs font-medium text-slate-500">
          Nexa AI
        </p>

        <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md">
          <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />

          <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />

          <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
