import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function StatCard({
  label,
  value,
  sub,
  accent = false,
  loading = false,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // 🔢 Smooth counter animation
  useEffect(() => {
    if (loading || value == null || isNaN(value)) return;

    let start = 0;
    const end = Number(value);
    const duration = 600;
    const stepTime = 16;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, loading]);

  return (
    <div
      className={`relative p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300
      ${
        accent
          ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 shadow-[0_0_25px_rgba(108,99,255,0.25)]"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {/* ✨ subtle glow */}
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top,#6c63ff33,transparent_70%)]" />

      {/* 🏷 label */}
      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-medium">
        {label}
      </p>

      {/* 🔢 value */}
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <h2
          className={`text-2xl font-bold font-display transition-all ${
            accent ? "text-indigo-400" : "text-white"
          }`}
        >
          {typeof value === "number" ? displayValue : value ?? "—"}
        </h2>
      )}

      {/* 📉 sub text */}
      {sub && (
        <p className="text-xs text-gray-400 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}