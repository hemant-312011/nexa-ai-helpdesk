import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";

function ChatWindow({ messages, isTyping, onSuggestionClick }) {
  const bottomRef = useRef(null);

  const showWelcomeScreen = messages.length <= 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <section className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col">
        {showWelcomeScreen && (
          <WelcomeScreen onSuggestionClick={onSuggestionClick} />
        )}

        <div
          className={`flex flex-1 flex-col gap-6 ${
            showWelcomeScreen ? "justify-end" : "justify-start"
          }`}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              sender={message.sender}
              message={message.message}
              time={message.time}
            />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;
