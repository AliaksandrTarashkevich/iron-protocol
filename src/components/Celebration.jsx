import { Trophy } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const CONFETTI_COLORS = ["#22c55e", "#6366f1", "#eab308", "#f97316", "#ec4899", "#8b5cf6", "#06b6d4"];

export default function Celebration() {
  const t = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        @keyframes celebration-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); } }
        .confetti-piece { position: absolute; top: -20px; width: 10px; height: 10px; border-radius: 2px; animation: confetti-fall 2.5s ease-in forwards; }
      `}</style>
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            width: 6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
      <div
        style={{
          background: t.surface,
          borderRadius: 20,
          padding: "32px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          textAlign: "center",
          animation: "celebration-pulse 0.6s ease",
          zIndex: 201,
        }}
      >
        <Trophy size={48} color={t.green} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: t.green }}>ОТЛИЧНАЯ РАБОТА!</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>Тренировка записана</div>
      </div>
    </div>
  );
}
