import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { PLAN } from "../data/plan";
import { KEY_EXERCISES } from "../data/exercises";
import Card from "../components/Card";

export default function ProgressTab({ weightLog, onAddWeight, completedWorkouts, endorphinLog = [] }) {
  const t = useTheme();
  const [weightInput, setWeightInput] = useState("");
  const [weightSaved, setWeightSaved] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const handleAddWeight = () => {
    const w = parseFloat(weightInput);
    if (!w || w < 30 || w > 300) return;
    onAddWeight(w);
    setWeightInput("");
    setWeightSaved(true);
    setTimeout(() => setWeightSaved(false), 2000);
  };

  const todayWeight = weightLog.find((e) => e.date === today);

  return (
    <div>
      {/* Weight Input */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Записать вес</div>
          {todayWeight && (
            <span style={{ fontSize: 11, color: t.green }}>Сегодня: {todayWeight.weight} кг</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>
          Одна запись в день — повторный ввод обновит значение
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="кг"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddWeight()}
            style={{
              flex: 1,
              background: t.surface2,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              color: t.text,
              fontSize: 16,
              fontWeight: 600,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleAddWeight}
            style={{
              background: t.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
        {weightSaved && (
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontSize: 12,
              color: t.green,
              fontWeight: 600,
            }}
          >
            Вес записан!
          </div>
        )}
      </Card>

      {/* Weight Graph */}
      {weightLog.length > 0 && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingDown size={16} /> Вес тела
          </div>
          <WeightChart data={weightLog} theme={t} />
          {weightLog.length >= 2 && <WeightDelta weightLog={weightLog} theme={t} />}
        </Card>
      )}

      {/* Weight Log */}
      {weightLog.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>Записи веса</div>
          {[...weightLog]
            .reverse()
            .slice(0, 10)
            .map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: i % 2 === 0 ? t.surface : "transparent",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                <span style={{ color: t.textMuted }}>{entry.date}</span>
                <span style={{ fontWeight: 700 }}>{entry.weight} кг</span>
              </div>
            ))}
        </div>
      )}

      {/* Endorphin Graph */}
      {endorphinLog.length > 0 && <EndorphinGraph data={endorphinLog} theme={t} />}

      {/* Strength Progress */}
      <StrengthProgress completedWorkouts={completedWorkouts} theme={t} />

      {/* Empty state */}
      {!weightLog.length && Object.keys(completedWorkouts).length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: t.textMuted, fontSize: 13 }}>
          Запиши свой вес
          <br />
          <span style={{ fontSize: 11 }}>Каждый день, утром, после туалета</span>
        </div>
      )}
    </div>
  );
}

function WeightChart({ data, theme: t }) {
  const chartData = data.slice(-30);
  if (chartData.length < 2) {
    return (
      <div style={{ textAlign: "center", fontSize: 12, color: t.textMuted, padding: 16 }}>
        {chartData[0].weight} кг — добавь ещё запись для графика
      </div>
    );
  }

  const W = 320, H = 120, PX = 32, PY = 16;
  const min = Math.min(...chartData.map((e) => e.weight)) - 1;
  const max = Math.max(...chartData.map((e) => e.weight)) + 1;
  const range = max - min || 1;

  const points = chartData.map((e, i) => ({
    x: PX + (i / (chartData.length - 1)) * (W - PX * 2),
    y: PY + (1 - (e.weight - min) / range) * (H - PY * 2),
    w: e.weight,
    d: e.date,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${H - PY} L${points[0].x},${H - PY} Z`;
  const gridLines = Array.from({ length: 4 }, (_, i) => min + (range / 3) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridLines.map((v, i) => {
        const y = PY + (1 - (v - min) / range) * (H - PY * 2);
        return (
          <g key={i}>
            <line x1={PX} y1={y} x2={W - PX} y2={y} stroke={t.border} strokeWidth="0.5" />
            <text x={PX - 4} y={y + 3} textAnchor="end" fontSize="7" fill={t.textSubtle}>
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#wg)" />
      <path d={line} fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4 : 2.5}
            fill={i === points.length - 1 ? t.accent : t.surface}
            stroke={t.accent}
            strokeWidth={i === points.length - 1 ? 2 : 1}
          />
          {(i === 0 || i === points.length - 1) && (
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8" fontWeight="700" fill={t.text}>
              {p.w}
            </text>
          )}
        </g>
      ))}
      {chartData.length <= 10 &&
        points.map((p, i) => (
          <text key={`d${i}`} x={p.x} y={H - 3} textAnchor="middle" fontSize="6" fill={t.textSubtle}>
            {p.d.slice(5)}
          </text>
        ))}
    </svg>
  );
}

function WeightDelta({ weightLog, theme: t }) {
  const delta = weightLog[weightLog.length - 1].weight - weightLog[0].weight;
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 4,
        fontSize: 13,
        fontWeight: 700,
        color: delta <= 0 ? t.green : t.red,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {delta <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
      {delta > 0 ? "+" : ""}
      {delta.toFixed(1)} кг с начала
    </div>
  );
}

function StrengthProgress({ completedWorkouts, theme: t }) {
  const workouts = Object.values(completedWorkouts).sort((a, b) => a.date.localeCompare(b.date));

  if (workouts.length < 2) {
    return (
      <Card style={{ marginTop: 12, textAlign: "center", padding: 24 }}>
        <BarChart3 size={32} color={t.textSubtle} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Графики силы</div>
        <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>
          После 2+ тренировок здесь появятся графики прогресса: отжимания, жим, подтягивания, планка и другие
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 40, opacity: 0.25 }}>
          {[20, 35, 30, 45, 40, 55, 50, 65, 60, 75, 70, 80].map((h, i) => (
            <div key={i} style={{ width: 12, height: `${h}%`, borderRadius: "2px 2px 0 0", background: t.accent }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: t.textSubtle, marginTop: 8 }}>Заверши 2 тренировки на «Старт» →</div>
      </Card>
    );
  }

  const history = {};
  KEY_EXERCISES.forEach((ke) => {
    const pts = [];
    workouts.forEach((w) => {
      let exList = w.exercises;
      if (!exList && w.week != null && w.day != null) {
        const pw = PLAN[w.week];
        if (pw && pw.days[w.day]) exList = pw.days[w.day].exercises;
      }
      if (exList) {
        const found = exList.find((e) => e.id === ke.id);
        if (found) {
          const num = parseInt(found.reps) || 0;
          if (num > 0) pts.push({ date: w.date, val: num, week: (w.week || 0) + 1 });
        }
      }
    });
    if (pts.length >= 1) history[ke.id] = pts;
  });

  const entries = KEY_EXERCISES.filter((ke) => history[ke.id]);
  if (entries.length === 0) return null;

  return (
    <Card style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <BarChart3 size={16} /> Прогресс силы
      </div>
      {entries.map((ke) => {
        const pts = history[ke.id];
        const first = pts[0].val;
        const last = pts[pts.length - 1].val;
        const diff = last - first;
        const min = Math.min(...pts.map((p) => p.val)) - 1;
        const max = Math.max(...pts.map((p) => p.val)) + 1;
        const range = max - min || 1;

        return (
          <div key={ke.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{ke.label}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: diff > 0 ? t.green : diff < 0 ? t.red : t.textMuted,
                }}
              >
                {pts.length === 1
                  ? `${last} повт.`
                  : `${first} → ${last}${diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : ""}`}
              </span>
            </div>
            <div style={{ height: 28, display: "flex", alignItems: "flex-end", gap: 2 }}>
              {pts.slice(-12).map((p, i, arr) => (
                <div
                  key={i}
                  title={`Нед.${p.week}: ${p.val}`}
                  style={{
                    flex: 1,
                    borderRadius: "2px 2px 0 0",
                    height: `${Math.max(((p.val - min) / range) * 24 + 4, 4)}px`,
                    background: i === arr.length - 1 ? t.accent : `${t.accent}55`,
                    minHeight: 4,
                    transition: "height 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function EndorphinGraph({ data, theme: t }) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const avgMood = (sorted.reduce((s, e) => s + e.mood, 0) / sorted.length).toFixed(1);
  const avgEnergy = (sorted.reduce((s, e) => s + e.energy, 0) / sorted.length).toFixed(1);

  const W = 320, H = 80, PX = 16, PY = 12;

  const moodPoints = sorted.map((e, i) => ({
    x: PX + (sorted.length > 1 ? (i / (sorted.length - 1)) * (W - PX * 2) : (W - PX * 2) / 2),
    y: PY + (1 - (e.mood - 1) / 4) * (H - PY * 2),
  }));
  const energyPoints = sorted.map((e, i) => ({
    x: PX + (sorted.length > 1 ? (i / (sorted.length - 1)) * (W - PX * 2) : (W - PX * 2) / 2),
    y: PY + (1 - (e.energy - 1) / 4) * (H - PY * 2),
  }));

  const moodLine = moodPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const energyLine = energyPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <Card style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <Heart size={16} /> Эндорфин
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: t.textMuted }}>
          Настроение: <span style={{ color: t.accent, fontWeight: 700 }}>{avgMood}/5</span>
        </div>
        <div style={{ fontSize: 11, color: t.textMuted }}>
          Энергия: <span style={{ color: t.green, fontWeight: 700 }}>{avgEnergy}/5</span>
        </div>
      </div>
      {sorted.length >= 2 ? (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((v) => {
            const y = PY + (1 - (v - 1) / 4) * (H - PY * 2);
            return (
              <line key={v} x1={PX} y1={y} x2={W - PX} y2={y} stroke={t.border} strokeWidth="0.3" />
            );
          })}
          {/* Energy line */}
          <path d={energyLine} fill="none" stroke={t.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          {/* Mood line */}
          <path d={moodLine} fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Mood dots */}
          {moodPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === moodPoints.length - 1 ? 3.5 : 2} fill={t.accent} />
          ))}
        </svg>
      ) : (
        <div style={{ textAlign: "center", fontSize: 11, color: t.textMuted, padding: 8 }}>
          После 2+ записей появится график
        </div>
      )}
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: t.textMuted }}>
          <div style={{ width: 10, height: 2, borderRadius: 1, background: t.accent }} /> Настроение
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: t.textMuted }}>
          <div style={{ width: 10, height: 2, borderRadius: 1, background: t.green, opacity: 0.6 }} /> Энергия
        </div>
      </div>
    </Card>
  );
}
