import { Flame, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { PHASE_COLORS } from "../styles/theme";

export default function Header({ onOpenSettings, currentWeek, viewingWeek, activeTab }) {
  const t = useTheme();
  const week = activeTab === "program" ? PLAN[viewingWeek] : PLAN[currentWeek];
  const weekNum = activeTab === "program" ? viewingWeek : currentWeek;
  const phaseColor = PHASE_COLORS[week.phase];

  return (
    <div style={{ padding: "12px 20px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: t.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={18} color={t.accent} />
          </div>
          <span>
            IRON<span style={{ color: t.textSubtle, fontWeight: 400 }}>PROTOCOL</span>
          </span>
        </h1>
        <div
          style={{
            fontSize: 12,
            color: t.textMuted,
            marginTop: 4,
            marginLeft: 42,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontWeight: 500 }}>Нед. {weekNum + 1}/8</span>
          <span
            style={{
              color: phaseColor,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: t.pillRadius,
              background: `${phaseColor}15`,
              fontSize: 11,
            }}
          >
            {week.phase}
          </span>
          <span style={{ color: t.textSubtle }}>
            {week.rounds}кр · {week.restEx}с
          </span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onOpenSettings}
        style={{
          background: t.surface,
          border: "none",
          borderRadius: 12,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: t.textMuted,
          boxShadow: t.shadow,
          backdropFilter: `blur(${t.cardBlur}px)`,
        }}
      >
        <Settings size={18} />
      </motion.button>
    </div>
  );
}
