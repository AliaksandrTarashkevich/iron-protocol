import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Trophy, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { PHASE_COLORS } from "../styles/theme";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ExerciseRow from "../components/ExerciseRow";
import RestTimer from "../components/RestTimer";

export default function WorkoutTab({ week, currentWeek, dayIndex, todayDone, completedCount, onMarkComplete }) {
  const t = useTheme();
  const [checklist, setChecklist] = useState({});
  const [activeRound, setActiveRound] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);

  const workout = week.days[dayIndex];

  const isChecked = (round, exerciseIndex) => !!checklist[`${round}_${exerciseIndex}`];
  const toggleCheck = (round, exerciseIndex) =>
    setChecklist((prev) => ({ ...prev, [`${round}_${exerciseIndex}`]: !prev[`${round}_${exerciseIndex}`] }));
  const isRoundDone = (round) => workout.exercises.every((_, i) => isChecked(round, i));
  const allDone = Array.from({ length: week.rounds }, (_, r) => isRoundDone(r)).every(Boolean);

  const handleComplete = () => {
    setChecklist({});
    setActiveRound(0);
    onMarkComplete();
  };

  return (
    <div>
      <Card style={{ marginBottom: 12, background: `${PHASE_COLORS[week.phase]}10`, borderColor: `${PHASE_COLORS[week.phase]}33` }}>
        <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          Сегодня · Тренировка {dayIndex + 1}/3
        </div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{workout.name}</div>
        {todayDone && <Badge color={t.green}><Check size={12} style={{ marginRight: 4 }} /> Выполнено</Badge>}
        {completedCount >= 3 && !todayDone && (
          <div style={{ fontSize: 12, color: t.accent, marginTop: 6 }}>
            Все 3 тренировки готовы — переключай неделю в «План»
          </div>
        )}
      </Card>

      {!todayDone &&
        Array.from({ length: week.rounds }, (_, roundIndex) => (
          <div key={roundIndex} style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveRound(activeRound === roundIndex ? -1 : roundIndex)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
                color: t.text,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isRoundDone(roundIndex) ? t.green : roundIndex === activeRound ? t.accent : t.surface3,
                  color: "#fff",
                }}
              >
                {isRoundDone(roundIndex) ? <Check size={14} /> : roundIndex + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Круг {roundIndex + 1}</span>
              {activeRound === roundIndex ? (
                <ChevronDown size={16} color={t.textMuted} />
              ) : (
                <ChevronRight size={16} color={t.textMuted} />
              )}
            </button>
            {activeRound === roundIndex && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {workout.exercises.map((ex, ei) => (
                  <ExerciseRow
                    key={ei}
                    exercise={ex}
                    done={isChecked(roundIndex, ei)}
                    onToggle={() => toggleCheck(roundIndex, ei)}
                    open={expandedExercise === `${roundIndex}_${ei}`}
                    onOpen={() =>
                      setExpandedExercise(expandedExercise === `${roundIndex}_${ei}` ? null : `${roundIndex}_${ei}`)
                    }
                  />
                ))}
                {isRoundDone(roundIndex) && roundIndex < week.rounds - 1 && (
                  <RestTimer
                    seconds={week.restRound}
                    label={`Отдых → круг ${roundIndex + 2}`}
                    onDone={() => setActiveRound(roundIndex + 1)}
                  />
                )}
              </div>
            )}
          </div>
        ))}

      {!todayDone && (
        <button
          onClick={() => setShowRestTimer(!showRestTimer)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${t.border}`,
            background: t.surface,
            color: t.textMuted,
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          <Clock size={14} /> Таймер отдыха ({week.restEx}с)
        </button>
      )}
      {showRestTimer && <RestTimer seconds={week.restEx} label="Отдых между упражнениями" />}

      {allDone && !todayDone && (
        <button
          onClick={handleComplete}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            marginTop: 8,
            background: `linear-gradient(135deg, ${t.green}, #16a34a)`,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 20px ${t.green}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "inherit",
          }}
        >
          <Trophy size={20} /> ЗАВЕРШЕНА
        </button>
      )}
    </div>
  );
}
