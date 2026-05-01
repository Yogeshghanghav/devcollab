import { format } from "date-fns";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { useSelector } from "react-redux";

export default function MessageBubble({ message, showHeader = true }) {
  const { user } = useSelector((s) => s.auth);

  const senderId = message.user?._id || message.user;
  const isOwn = senderId === user?._id;

  const name = message.user?.name || message.userName || "Unknown";
  const role = message.user?.role;
  const time = format(new Date(message.createdAt), "HH:mm");

  return (
    <div
      className={`flex gap-3 px-4 group ${
        isOwn ? "justify-end" : "justify-start"
      } ${showHeader ? "mt-4" : "mt-0.5"}`}
    >
      {/* 👤 Avatar (left only for others) */}
      {!isOwn && (
        <div className="w-8 flex-shrink-0">
          {showHeader && <Avatar name={name} size="sm" />}
        </div>
      )}

      {/* 💬 Message Block */}
      <div className="flex flex-col max-w-[70%]">

        {/* 🧠 Header */}
        {showHeader && !isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">
              {name}
            </span>

            {role && <Badge label={role} variant={role} />}

            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition">
              {time}
            </span>
          </div>
        )}

        {/* 💬 Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl text-sm leading-relaxed break-words shadow-md transition-all
          ${
            isOwn
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm"
              : "bg-white/10 backdrop-blur-xl border border-white/10 text-gray-200 rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>

        {/* ⏱ time for own message */}
        {isOwn && (
          <span className="text-[11px] text-gray-400 mt-1 self-end opacity-0 group-hover:opacity-100 transition">
            {time}
          </span>
        )}
      </div>
    </div>
  );
}