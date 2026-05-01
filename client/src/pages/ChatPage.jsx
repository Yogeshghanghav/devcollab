import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchChannels,
  fetchChannelMessages,
  fetchDirectMessages,
} from "../features/chat/chatSlice";

import { getSocket } from "../services/socket";

import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import ChannelHeader from "../components/chat/ChannelHeader";
import EmptyState from "../components/ui/EmptyState";

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function ChatPage() {
  const dispatch = useDispatch();

  const {
    channels,
    activeChannelId,
    activeDmUserId,
    messages,
    dmMessages,
    messagesLoading,
    typingUsers,
  } = useSelector((s) => s.chat);

  const { users } = useSelector((s) => s.auth);

  const activeChannel = channels.find((c) => c._id === activeChannelId);
  const activeDmUser = users.find((u) => u._id === activeDmUserId);

  // 📦 Load channels
  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  // 💬 Channel messages
  useEffect(() => {
    if (!activeChannelId) return;

    dispatch(fetchChannelMessages({ channelId: activeChannelId }));

    const socket = getSocket();
    socket?.emit("join_channel", activeChannelId);
  }, [dispatch, activeChannelId]);

  // 📩 DM messages
  useEffect(() => {
    if (!activeDmUserId) return;
    dispatch(fetchDirectMessages(activeDmUserId));
  }, [dispatch, activeDmUserId]);

  // 🚀 Send handlers
  const handleChannelSend = (text) => {
    getSocket()?.emit("send_channel_message", {
      channelId: activeChannelId,
      text,
    });
  };

  const handleDmSend = (text) => {
    getSocket()?.emit("send_direct_message", {
      recipientId: activeDmUserId,
      text,
    });
  };

  // 📊 Current messages
  const currentMessages = activeChannelId
    ? messages[activeChannelId] || []
    : activeDmUserId
    ? dmMessages[activeDmUserId] || []
    : [];

  const currentTyping = activeChannelId
    ? typingUsers[activeChannelId] || []
    : [];

  // 💤 Empty state
  if (!activeChannelId && !activeDmUserId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
          <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-white mb-1">
            Select a conversation
          </h2>
          <p className="text-sm text-gray-400">
            Choose a channel or DM from sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">

      {/* 🔥 Glow Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#6c63ff22,transparent_70%)]" />

      {/* 🧠 Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <ChannelHeader channel={activeChannel} dmUser={activeDmUser} />
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <MessageList
            messages={currentMessages}
            loading={messagesLoading}
            typingUsers={currentTyping}
          />
        </div>
      </div>

      {/* ✏️ Input */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto">
          <MessageInput
            onSend={activeChannelId ? handleChannelSend : handleDmSend}
            channelId={activeChannelId}
            placeholder={
              activeChannelId
                ? `Message #${activeChannel?.name || "…"}`
                : `Message ${activeDmUser?.name || "…"}`
            }
          />
        </div>
      </div>
    </div>
  );
}