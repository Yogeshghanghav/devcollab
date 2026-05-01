import Sidebar from "./Sidebar";
import { useSocket } from "../hooks/useSocket";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }) {
  useSocket();

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: "#0f0f13", color: "#f0f0f5", position: "relative",
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(108,99,255,0.08) 0%, transparent 60%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 80% 100%, rgba(147,51,234,0.06) 0%, transparent 60%)",
      }} />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(22, 22, 30, 0.95)",
            backdropFilter: "blur(16px)",
            color: "#f0f0f5",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            fontSize: 13,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#0f0f13" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0f0f13" },
          },
        }}
      />

      {/* Sidebar */}
      <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        minWidth: 0, overflow: "hidden", position: "relative", zIndex: 1,
      }}>
        {children}
      </main>
    </div>
  );
}