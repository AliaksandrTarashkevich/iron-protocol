import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { PHASE_COLORS } from "../styles/theme";

export default function WeekProgress({ currentWeek, viewingWeek, activeTab }) {
  const t = useTheme();

  return (
    <div style={{ padding: "4px 16px 8px", display: "flex", gap: 3 }}>
      {PLAN.map((week, i) => {
        const isViewing = activeTab === "program" && i === viewingWeek;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background:
                i < currentWeek
                  ? PHASE_COLORS[week.phase]
                  : i === currentWeek
                    ? t.accent
                    : isViewing
                      ? `${PHASE_COLORS[week.phase]}88`
                      : t.surface3,
              opacity: i < currentWeek ? 0.5 : 1,
              transition: "all 0.3s",
            }}
          />
        );
      })}
    </div>
  );
}
