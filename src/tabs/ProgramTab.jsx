import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { PHASE_COLORS } from "../styles/theme";
import { EXERCISE_INFO } from "../data/exercises";
import { Target } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function ProgramTab({ currentWeek, viewingWeek, onViewWeek, onSwitchWeek }) {
  const t = useTheme();
  const viewedPlan = PLAN[viewingWeek];

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {PLAN.map((w, i) => (
          <button
            key={i}
            onClick={() => onViewWeek(i)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: `1.5px solid ${i === viewingWeek ? PHASE_COLORS[w.phase] : t.border}`,
              background: i === viewingWeek ? `${PHASE_COLORS[w.phase]}15` : t.surface,
              color: i === viewingWeek ? PHASE_COLORS[w.phase] : t.textMuted,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            {w.weekNum}
          </button>
        ))}
      </div>

      <Card style={{ marginBottom: 10, borderColor: `${PHASE_COLORS[viewedPlan.phase]}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Неделя {viewedPlan.weekNum}</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              {viewedPlan.rounds} кр · {viewedPlan.restEx}с/{viewedPlan.restRound}с
            </div>
          </div>
          <Badge color={PHASE_COLORS[viewedPlan.phase]}>{viewedPlan.phase}</Badge>
        </div>
        {viewingWeek === currentWeek && (
          <div style={{ fontSize: 11, color: t.accent, marginTop: 6 }}>← Текущая</div>
        )}
      </Card>

      {viewedPlan.days.map((day, dayIndex) => (
        <Card key={dayIndex} style={{ marginBottom: 8, padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            #{dayIndex + 1}: {day.name}
          </div>
          {day.exercises.map((ex, exIndex) => (
            <div
              key={exIndex}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "3px 0",
                borderBottom: exIndex < day.exercises.length - 1 ? `1px solid ${t.border}` : "none",
                fontSize: 12,
              }}
            >
              <span
                style={{
                  color: ex.priority ? t.accent : t.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {ex.priority && <Target size={10} />}
                {EXERCISE_INFO[ex.id]?.short || ex.id}
              </span>
              <span style={{ color: t.textMuted, whiteSpace: "nowrap", marginLeft: 8 }}>
                {ex.reps}
                {ex.weight ? ` · ${ex.weight}` : ""}
              </span>
            </div>
          ))}
        </Card>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => viewingWeek > 0 && onViewWeek(viewingWeek - 1)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: `1px solid ${t.border}`,
            background: t.surface,
            color: t.textMuted,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
          }}
        >
          ← Пред.
        </button>
        <button
          onClick={() => viewingWeek < 7 && onViewWeek(viewingWeek + 1)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: t.accent,
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          След. →
        </button>
      </div>

      {viewingWeek !== currentWeek && (
        <button
          onClick={() => onSwitchWeek(viewingWeek)}
          style={{
            width: "100%",
            marginTop: 8,
            padding: 12,
            borderRadius: 10,
            border: `2px solid ${t.accent}`,
            background: `${t.accent}15`,
            color: t.accent,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
          }}
        >
          Переключиться на неделю {viewingWeek + 1}
        </button>
      )}
    </div>
  );
}
