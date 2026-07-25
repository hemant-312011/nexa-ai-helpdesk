import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function BotAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
      <span className="text-sm">✦</span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-xs font-semibold text-slate-200">
      YOU
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Code copy failed:", error);
    }
  }

  return (
    <div className="my-4 max-w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.05] px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {language || "code"}
        </span>

        <button
          type="button"
          onClick={copyCode}
          className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-violet-500/60 hover:bg-violet-500/10 hover:text-violet-300"
        >
          {copied ? "✓ Copied" : "Copy code"}
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            },
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function MarkdownMessage({ message }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1({ children }) {
          return (
            <h1 className="mb-3 mt-2 text-xl font-bold text-white">
              {children}
            </h1>
          );
        },

        h2({ children }) {
          return (
            <h2 className="mb-2 mt-4 text-lg font-semibold text-white">
              {children}
            </h2>
          );
        },

        h3({ children }) {
          return (
            <h3 className="mb-2 mt-3 text-base font-semibold text-white">
              {children}
            </h3>
          );
        },

        p({ children }) {
          return <p className="mb-3 leading-6 last:mb-0">{children}</p>;
        },

        strong({ children }) {
          return (
            <strong className="font-semibold text-white">{children}</strong>
          );
        },

        em({ children }) {
          return <em className="italic text-slate-300">{children}</em>;
        },

        ul({ children }) {
          return <ul className="mb-3 ml-5 list-disc space-y-1">{children}</ul>;
        },

        ol({ children }) {
          return (
            <ol className="mb-3 ml-5 list-decimal space-y-1">{children}</ol>
          );
        },

        li({ children }) {
          return <li className="pl-1">{children}</li>;
        },

        blockquote({ children }) {
          return (
            <blockquote className="my-3 border-l-4 border-violet-500 bg-violet-500/10 px-4 py-2 text-slate-300">
              {children}
            </blockquote>
          );
        },

        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-violet-300 underline decoration-violet-500/50 underline-offset-4 transition hover:text-violet-200"
            >
              {children}
            </a>
          );
        },

        code({ className, children, ...props }) {
          const languageMatch = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          if (languageMatch) {
            return <CodeBlock language={languageMatch[1]} code={code} />;
          }

          return (
            <code
              className="rounded bg-slate-950/80 px-1.5 py-0.5 font-mono text-[13px] text-violet-300"
              {...props}
            >
              {children}
            </code>
          );
        },

        pre({ children }) {
          return <>{children}</>;
        },

        table({ children }) {
          return (
            <div className="my-4 max-w-full overflow-x-auto">
              <table className="min-w-full border-collapse overflow-hidden rounded-lg border border-white/10 text-left text-sm">
                {children}
              </table>
            </div>
          );
        },

        thead({ children }) {
          return <thead className="bg-white/10 text-white">{children}</thead>;
        },

        th({ children }) {
          return (
            <th className="border border-white/10 px-3 py-2 font-semibold">
              {children}
            </th>
          );
        },

        td({ children }) {
          return (
            <td className="border border-white/10 px-3 py-2 text-slate-300">
              {children}
            </td>
          );
        },

        hr() {
          return <hr className="my-4 border-white/10" />;
        },
      }}
    >
      {message}
    </ReactMarkdown>
  );
}

function MessageBubble({ sender, message, time }) {
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Message copy failed:", error);
    }
  }

  return (
    <div
      className={`message-animation flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <BotAvatar />}

      <div
        className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <p className="mb-1.5 px-1 text-xs font-medium text-slate-500">
          {isUser ? "You" : "Nexa AI"}
        </p>

        <div
          className={`max-w-full rounded-2xl px-4 py-3 text-sm leading-6 shadow-xl ${
            isUser
              ? "whitespace-pre-wrap rounded-br-md bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-blue-950/20"
              : "rounded-bl-md border border-white/10 bg-white/[0.07] text-slate-200 shadow-black/10 backdrop-blur-md"
          }`}
        >
          {isUser ? message : <MarkdownMessage message={message} />}
        </div>

        <div className="mt-2 flex items-center gap-3 px-1">
          <p className="text-[11px] text-slate-600">{time}</p>

          {!isUser && (
            <button
              type="button"
              onClick={copyMessage}
              className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-slate-400 transition hover:border-violet-500/60 hover:bg-violet-500/10 hover:text-violet-300"
            >
              {copied ? "✓ Copied" : "Copy message"}
            </button>
          )}
        </div>
      </div>

      {isUser && <UserAvatar />}
    </div>
  );
}

export default MessageBubble;
