import { useState } from "react";
import { Check, ChevronDown, Trophy, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { PHASE_COLORS } from "../styles/theme";
import { Button } from "@/components/ui/button";
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
      <Card
        variant="accent"
        style={{ marginBottom: 14 }}
      >
        <div style={{ fontSize: 12, color: t.accentDark || t.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 600 }}>
          Сегодня · Тренировка {dayIndex + 1}/3
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>{workout.name}</div>
        {todayDone && (
          <div style={{ marginTop: 8 }}>
            <Badge color={t.green}><Check size={12} style={{ marginRight: 4 }} /> Выполнено</Badge>
          </div>
        )}
        {completedCount >= 3 && !todayDone && (
          <div style={{ fontSize: 12, color: t.accent, marginTop: 8, fontWeight: 500 }}>
            Все 3 тренировки готовы — переключай неделю в «План»
          </div>
        )}
      </Card>

      {!todayDone &&
        Array.from({ length: week.rounds }, (_, roundIndex) => (
          <div key={roundIndex} style={{ marginBottom: 12 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
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
              <motion.div
                animate={{
                  background: isRoundDone(roundIndex) ? t.green : roundIndex === activeRound ? t.accent : t.surface3,
                  scale: isRoundDone(roundIndex) ? [1, 1.2, 1] : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {isRoundDone(roundIndex) ? <Check size={14} /> : roundIndex + 1}
              </motion.div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Круг {roundIndex + 1}</span>
              <motion.div animate={{ rotate: activeRound === roundIndex ? 0 : -90 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} color={t.textMuted} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeRound === roundIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                    {workout.exercises.map((ex, ei) => (
                      <motion.div
                        key={ei}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ei * 0.04, duration: 0.2 }}
                      >
                        <ExerciseRow
                          exercise={ex}
                          done={isChecked(roundIndex, ei)}
                          onToggle={() => toggleCheck(roundIndex, ei)}
                          open={expandedExercise === `${roundIndex}_${ei}`}
                          onOpen={() =>
                            setExpandedExercise(expandedExercise === `${roundIndex}_${ei}` ? null : `${roundIndex}_${ei}`)
                          }
                        />
                      </motion.div>
                    ))}
                    {isRoundDone(roundIndex) && roundIndex < week.rounds - 1 && (
                      <RestTimer
                        seconds={week.restRound}
                        label={`Отдых → круг ${roundIndex + 2}`}
                        onDone={() => setActiveRound(roundIndex + 1)}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

      {!todayDone && (
        <motion.button
          whileTap={{ scale: 0.97 }}
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
        </motion.button>
      )}
      {showRestTimer && <RestTimer seconds={week.restEx} label="Отдых между упражнениями" />}

      <AnimatePresence>
        {allDone && !todayDone && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleComplete}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: t.buttonRadius,
              border: "none",
              marginTop: 8,
              background: t.accent,
              color: t.isDark ? "#111" : "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 20px ${t.accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            <Trophy size={20} /> ЗАВЕРШЕНА
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
