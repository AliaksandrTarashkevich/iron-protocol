import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { PHASE_COLORS } from "../styles/theme";

export default function WeekProgress({ currentWeek, viewingWeek, activeTab }) {
  const t = useTheme();

  return (
    <div style={{ padding: "4px 16px 10px", display: "flex", gap: 4 }}>
      {PLAN.map((week, i) => {
        const isViewing = activeTab === "program" && i === viewingWeek;
        const isCurrent = i === currentWeek;
        const isDone = i < currentWeek;
        const color = PHASE_COLORS[week.phase];

        return (
          <motion.div
            key={i}
            animate={{
              opacity: isDone ? 0.4 : 1,
              scale: isCurrent ? 1 : 1,
            }}
            style={{
              flex: 1,
              height: isCurrent ? 5 : 4,
              borderRadius: 3,
              background: isDone
                ? color
                : isCurrent
                  ? `linear-gradient(90deg, ${color}, ${t.accent})`
                  : isViewing
                    ? `${color}55`
                    : t.surface3,
              boxShadow: isCurrent ? `0 0 8px ${color}44` : "none",
              transition: "all 0.3s",
            }}
          />
        );
      })}
    </div>
  );
}
