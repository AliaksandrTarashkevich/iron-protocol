import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/Card";

function CountUp({ value, color }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let frame = 0;
    const steps = Math.min(value, 20);
    const interval = setInterval(() => {
      frame++;
      setDisplay(Math.round((frame / steps) * value));
      if (frame >= steps) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [value]);
  return <span style={{ fontSize: 28, fontWeight: 800, color }}>{display}</span>;
}

const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function CalendarTab({ completedWorkouts, currentWeek }) {
  const t = useTheme();
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date().toISOString().slice(0, 10);
  const calendarDate = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const completedDates = Object.values(completedWorkouts).map((c) => c.date);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          style={{ background: t.surface2, border: "none", color: t.text, padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700 }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          style={{ background: t.surface2, border: "none", color: t.text, padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 6 }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: t.textSubtle, padding: 4 }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === today;
          const hasWorkout = completedDates.includes(dateStr);
          return (
            <div
              key={day}
              style={{
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 8,
                fontSize: 12,
                background: hasWorkout ? t.greenSoft : isToday ? t.surface2 : "transparent",
                border: isToday ? `1.5px solid ${t.accent}` : "1.5px solid transparent",
                color: hasWorkout ? t.green : t.text,
                fontWeight: hasWorkout || isToday ? 700 : 400,
              }}
            >
              {day}
              {hasWorkout && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
                  <Dumbbell size={7} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card style={{ textAlign: "center", padding: 12 }}>
            <CountUp value={Object.keys(completedWorkouts).length} color={t.green} />
            <div style={{ fontSize: 11, color: t.textMuted }}>Тренировок</div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card style={{ textAlign: "center", padding: 12 }}>
            <CountUp value={currentWeek + 1} color={t.accent} />
            <div style={{ fontSize: 11, color: t.textMuted }}>Неделя</div>
          </Card>
        </motion.div>
      </div>

      {Object.keys(completedWorkouts).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>Последние</div>
          {Object.entries(completedWorkouts)
            .sort((a, b) => b[1].date.localeCompare(a[1].date))
            .slice(0, 5)
            .map(([key, w]) => (
              <div
                key={key}
                style={{
                  background: t.surface,
                  borderRadius: 8,
                  padding: "6px 10px",
                  marginBottom: 3,
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  border: `1px solid ${t.border}`,
                }}
              >
                <span>{w.date}</span>
                <span style={{ color: t.textMuted }}>{w.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
