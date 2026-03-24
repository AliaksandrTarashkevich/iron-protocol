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
    <div style={{ padding: "14px 16px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h1
          style={{
            fontSize: t.headerSize || 20,
            fontWeight: 900,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            letterSpacing: "-0.03em",
          }}
        >
          <Flame
            size={22}
            style={{
              color: t.accent,
              filter: `drop-shadow(0 0 8px ${t.accent}66)`,
            }}
          />
          <span>
            IRON<span style={{ color: t.textSubtle, fontWeight: 400 }}>PROTOCOL</span>
          </span>
        </h1>
        <div
          style={{
            fontSize: 11,
            color: t.textMuted,
            marginTop: 3,
            marginLeft: 30,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Нед. {weekNum + 1}/8</span>
          <span
            style={{
              color: phaseColor,
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: 4,
              background: `${phaseColor}15`,
              fontSize: 10,
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
        whileTap={{ scale: 0.9, rotate: 90 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onOpenSettings}
        style={{
          background: t.surface2,
          border: t.cardBorder || `1px solid ${t.border}`,
          borderRadius: 10,
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: t.textMuted,
        }}
      >
        <Settings size={17} />
      </motion.button>
    </div>
  );
}
