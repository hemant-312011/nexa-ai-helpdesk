import { useRef, useState } from "react";

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 4L21 12L4 20L7 12L4 4Z" fill="currentColor" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

function ChatInput({ onSend, isTyping }) {
  const [text, setText] = useState("");

  const textareaRef = useRef(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;

    textarea.style.height = "0px";

    textarea.style.height = textarea.scrollHeight + "px";
  }

  function handleChange(e) {
    setText(e.target.value);

    resizeTextarea();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim() || isTyping) {
      return;
    }

    onSend(text);

    setText("");

    textareaRef.current.style.height = "48px";
  }

  return (
    <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 py-5">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl transition-all duration-300 focus-within:border-violet-500">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            +
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            disabled={isTyping}
            onChange={handleChange}
            placeholder="Message AI Helpdesk..."
            className="min-h-12 max-h-40 flex-1 resize-none overflow-auto bg-transparent pt-3 text-white outline-none placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                handleSubmit(e);
              }
            }}
          />

          <button
            disabled={!text.trim() || isTyping}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 transition hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
          >
            {isTyping ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
