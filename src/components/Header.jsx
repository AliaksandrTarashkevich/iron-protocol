import { Flame, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { PHASE_COLORS } from "../styles/theme";

export default function Header({ onOpenSettings, currentWeek, viewingWeek, activeTab }) {
  const t = useTheme();
  const week = activeTab === "program" ? PLAN[viewingWeek] : PLAN[currentWeek];
  const weekNum = activeTab === "program" ? viewingWeek : currentWeek;

  return (
    <div style={{ padding: "14px 16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={22} color={t.accent} />
          <span>
            IRON<span style={{ color: t.textMuted, fontWeight: 400 }}>PROTOCOL</span>
          </span>
        </h1>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, marginLeft: 30 }}>
          Нед. {weekNum + 1}/8 · <span style={{ color: PHASE_COLORS[week.phase] }}>{week.phase}</span> · {week.rounds}{" "}
          кр · {week.restEx}с/{week.restRound}с
        </div>
      </div>
      <button
        onClick={onOpenSettings}
        style={{
          background: t.surface2,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: t.text,
        }}
      >
        <Settings size={16} />
      </button>
    </div>
  );
}
