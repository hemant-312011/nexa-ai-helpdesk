import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

function createWelcomeMessage() {
  return {
    id: crypto.randomUUID(),
    sender: "bot",
    message: "Hello! I'm your AI Helpdesk Assistant. How can I help you today?",
    time: "Just now",
  };
}

function createConversation() {
  return {
    id: crypto.randomUUID(),
    threadId: crypto.randomUUID(),
    title: "New conversation",
    messages: [createWelcomeMessage()],
    createdAt: Date.now(),
  };
}

function App() {
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem("nexa-conversations");

    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);

        if (
          Array.isArray(parsedConversations) &&
          parsedConversations.length > 0
        ) {
          return parsedConversations;
        }
      } catch (error) {
        console.error("Unable to load conversations:", error);
      }
    }

    return [createConversation()];
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    const savedActiveId = localStorage.getItem("nexa-active-conversation");

    const activeConversationExists = conversations.some(
      (conversation) => conversation.id === savedActiveId,
    );

    return activeConversationExists
      ? savedActiveId
      : conversations[0]?.id || null;
  });

  const [isTyping, setIsTyping] = useState(false);

  const [editingConversationId, setEditingConversationId] = useState(null);

  const [editingTitle, setEditingTitle] = useState("");

  const activeConversation = useMemo(() => {
    return (
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) || conversations[0]
    );
  }, [conversations, activeConversationId]);

  useEffect(() => {
    localStorage.setItem("nexa-conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem("nexa-active-conversation", activeConversationId);
    }
  }, [activeConversationId]);

  function updateConversation(conversationId, updateFunction) {
    setConversations((previousConversations) =>
      previousConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return updateFunction(conversation);
      }),
    );
  }

  async function sendMessage(text) {
    const cleanText = text.trim();

    if (!cleanText || isTyping || !activeConversation) {
      return;
    }

    const conversationId = activeConversation.id;
    const threadId = activeConversation.threadId;

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      message: cleanText,
      time: "Just now",
    };

    updateConversation(conversationId, (conversation) => {
      const userMessages = conversation.messages.filter(
        (message) => message.sender === "user",
      );

      const isFirstUserMessage = userMessages.length === 0;

      return {
        ...conversation,
        title: isFirstUserMessage ? cleanText.slice(0, 32) : conversation.title,
        messages: [...conversation.messages, userMessage],
      };
    });

    setIsTyping(true);

    try {
      const response = await fetch(
        "https://nexa-ai-helpdesk.onrender.com/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: cleanText,
            threadId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to receive AI response.");
      }

      const botMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        message: data.reply,
        time: "Just now",
      };

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [...conversation.messages, botMessage],
      }));
    } catch (error) {
      console.error("Chat request failed:", error);

      const errorMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        message:
          "Sorry, I couldn't connect to the support service. Please try again.",
        time: "Just now",
      };

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [...conversation.messages, errorMessage],
      }));
    } finally {
      setIsTyping(false);
    }
  }

  function startNewChat() {
    if (isTyping) {
      return;
    }

    const newConversation = createConversation();

    setEditingConversationId(null);
    setEditingTitle("");

    setConversations((previousConversations) => [
      newConversation,
      ...previousConversations,
    ]);

    setActiveConversationId(newConversation.id);
  }

  function openConversation(conversationId) {
    if (isTyping || editingConversationId) {
      return;
    }

    setActiveConversationId(conversationId);
  }

  function deleteConversation(conversationId) {
    if (isTyping) {
      return;
    }

    setEditingConversationId(null);
    setEditingTitle("");

    setConversations((previousConversations) => {
      const updatedConversations = previousConversations.filter(
        (conversation) => conversation.id !== conversationId,
      );

      if (updatedConversations.length === 0) {
        const newConversation = createConversation();

        setActiveConversationId(newConversation.id);

        return [newConversation];
      }

      if (activeConversationId === conversationId) {
        setActiveConversationId(updatedConversations[0].id);
      }

      return updatedConversations;
    });
  }

  function startRenaming(conversation) {
    if (isTyping) {
      return;
    }

    setEditingConversationId(conversation.id);
    setEditingTitle(conversation.title);
  }

  function saveRenamedConversation(conversationId) {
    const cleanTitle = editingTitle.trim();

    if (cleanTitle) {
      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        title: cleanTitle.slice(0, 40),
      }));
    }

    setEditingConversationId(null);
    setEditingTitle("");
  }

  function cancelRenaming() {
    setEditingConversationId(null);
    setEditingTitle("");
  }

  function handleRenameKeyDown(event, conversationId) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveRenamedConversation(conversationId);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelRenaming();
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/80 p-5 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
              <span className="text-xl">✦</span>
            </div>

            <div>
              <h2 className="font-semibold text-white">Nexa Support</h2>

              <p className="text-xs text-slate-400">AI customer assistance</p>
            </div>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            disabled={isTyping}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-lg">＋</span>
            New conversation
          </button>

          <div className="mt-8 min-h-0 flex-1">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recent conversations
            </p>

            <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversation?.id;

                const isEditing = conversation.id === editingConversationId;

                return (
                  <div
                    key={conversation.id}
                    className={`group flex items-center gap-1 rounded-xl border p-2 transition ${
                      isActive
                        ? "border-violet-500/30 bg-violet-500/15"
                        : "border-transparent bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(event) =>
                          setEditingTitle(event.target.value)
                        }
                        onKeyDown={(event) =>
                          handleRenameKeyDown(event, conversation.id)
                        }
                        onBlur={() => saveRenamedConversation(conversation.id)}
                        autoFocus
                        maxLength={40}
                        className="min-w-0 flex-1 rounded-lg border border-violet-500/40 bg-slate-950 px-2 py-2 text-sm text-white outline-none focus:border-violet-400"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openConversation(conversation.id)}
                        disabled={isTyping}
                        className="min-w-0 flex-1 px-1 py-1 text-left disabled:cursor-not-allowed"
                      >
                        <p className="truncate text-sm text-slate-200">
                          {conversation.title}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isActive ? "text-violet-300" : "text-slate-500"
                          }`}
                        >
                          {isActive
                            ? "Active conversation"
                            : `${Math.max(
                                conversation.messages.length - 1,
                                0,
                              )} messages`}
                        </p>
                      </button>
                    )}

                    {!isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => startRenaming(conversation)}
                          disabled={isTyping}
                          aria-label={`Rename ${conversation.title}`}
                          title="Rename conversation"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 opacity-0 transition hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed group-hover:opacity-100"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path
                              d="M13.5 6.5L17.5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M4 20L8.2 19.1L18.2 9.1C19.3 8 19.3 6.2 18.2 5.1C17.1 4 15.3 4 14.2 5.1L4.2 15.1L4 20Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteConversation(conversation.id)}
                          disabled={isTyping}
                          aria-label={`Delete ${conversation.title}`}
                          title="Delete conversation"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed group-hover:opacity-100"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 7H20"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M9 3H15L16 7H8L9 3Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />

                            <path
                              d="M6 7L7 21H17L18 7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />

                            <path
                              d="M10 11V17"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M14 11V17"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">
                GU
              </div>

              <div>
                <p className="text-sm font-medium">Guest User</p>

                <p className="text-xs text-slate-500">Free support account</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              All systems operational
            </div>
          </div>
        </aside>

        <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

          <Header />

          <ChatWindow
            messages={activeConversation?.messages || []}
            isTyping={isTyping}
            onSuggestionClick={sendMessage}
          />

          <ChatInput onSend={sendMessage} isTyping={isTyping} />
        </main>
      </div>
    </div>
  );
}

export default App;
