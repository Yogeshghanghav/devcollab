import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function MessageList({
  messages = [],
  loading = false,
  typingUsers = [],
}) {
  const bottomRef = useRef(null);

  // 🔽 smooth auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typingUsers.length]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 💤 Empty state (premium)
  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl text-center">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">
            No messages yet
          </h3>
          <p className="text-xs text-gray-400">
            Start the conversation 🚀
          </p>
        </div>
      </div>
    );
  }

  // 📦 Group messages (clean logic)
  const grouped = messages.map((msg, i) => {
    const prev = messages[i - 1];

    const sameUser =
      prev &&
      (prev.user?._id || prev.user) === (msg.user?._id || msg.user);

    const within2min =
      prev &&
      new Date(msg.createdAt) - new Date(prev.createdAt) < 120000;

    return {
      ...msg,
      showHeader: !(sameUser && within2min),
    };
  });

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 flex flex-col">

      {/* Spacer for bottom alignment */}
      <div className="flex-1" />

      {/* 💬 Messages */}
      <div className="flex flex-col gap-1">
        {grouped.map((msg) => (
          <div
            key={msg._id}
            className="animate-[fadeIn_0.25s_ease]"
          >
            <MessageBubble
              message={msg}
              showHeader={msg.showHeader}
            />
          </div>
        ))}
      </div>

      {/* ✨ Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 mt-2 animate-fade-in">
          <div className="w-8" />

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">

            {/* animated dots */}
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>

            <span className="truncate">
              {typingUsers.map((u) => u.name).join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing…
            </span>
          </div>
        </div>
      )}

      {/* 🔽 Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}