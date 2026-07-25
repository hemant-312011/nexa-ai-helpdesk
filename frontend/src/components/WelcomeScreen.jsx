const suggestions = [
  {
    icon: "🔑",
    title: "Reset my password",
    prompt: "I forgot my account password. How can I reset it?",
  },
  {
    icon: "💳",
    title: "Billing issue",
    prompt: "I have a problem with my recent billing payment.",
  },
  {
    icon: "📦",
    title: "Track my order",
    prompt: "I want to track my recent order.",
  },
  {
    icon: "🛠",
    title: "Technical support",
    prompt: "I am experiencing a technical problem and need help.",
  },
];

function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="message-animation mb-10 flex flex-col items-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-2xl shadow-violet-600/30">
        <span className="text-4xl">🤖</span>
      </div>

      <h1 className="text-4xl font-bold text-white">AI Helpdesk</h1>

      <p className="mt-3 text-center text-slate-400">
        Ask anything about your account, billing or technical issues.
      </p>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion.title}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-500/10"
          >
            <span className="mr-2">{suggestion.icon}</span>

            {suggestion.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WelcomeScreen;
