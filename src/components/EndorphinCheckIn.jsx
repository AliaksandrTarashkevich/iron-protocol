import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Custom SVG mood faces (no emoji)
function MoodIcon({ level, size = 32, active, color }) {
  const styles = { width: size, height: size, cursor: "pointer", transition: "transform 0.15s" };
  if (active) styles.transform = "scale(1.2)";

  // 5 levels: exhausted, tired, okay, good, fire
  const faces = {
    1: ( // exhausted
      <svg viewBox="0 0 32 32" style={styles}>
        <circle cx="16" cy="16" r="14" fill={active ? color : "none"} stroke={color} strokeWidth="2" opacity={active ? 0.2 : 0.4} />
        <circle cx="11" cy="13" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <circle cx="21" cy="13" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <path d="M10 22 Q16 18 22 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
      </svg>
    ),
    2: ( // tired
      <svg viewBox="0 0 32 32" style={styles}>
        <circle cx="16" cy="16" r="14" fill={active ? color : "none"} stroke={color} strokeWidth="2" opacity={active ? 0.2 : 0.4} />
        <circle cx="11" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <circle cx="21" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <line x1="10" y1="21" x2="22" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
      </svg>
    ),
    3: ( // okay
      <svg viewBox="0 0 32 32" style={styles}>
        <circle cx="16" cy="16" r="14" fill={active ? color : "none"} stroke={color} strokeWidth="2" opacity={active ? 0.2 : 0.4} />
        <circle cx="11" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <circle cx="21" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <path d="M11 21 Q16 23 21 21" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
      </svg>
    ),
    4: ( // good
      <svg viewBox="0 0 32 32" style={styles}>
        <circle cx="16" cy="16" r="14" fill={active ? color : "none"} stroke={color} strokeWidth="2" opacity={active ? 0.2 : 0.4} />
        <circle cx="11" cy="13" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <circle cx="21" cy="13" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <path d="M10 19 Q16 25 22 19" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
      </svg>
    ),
    5: ( // fire/euphoria
      <svg viewBox="0 0 32 32" style={styles}>
        <circle cx="16" cy="16" r="14" fill={active ? color : "none"} stroke={color} strokeWidth="2" opacity={active ? 0.3 : 0.4} />
        <path d="M9 14 L13 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
        <path d="M23 14 L19 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
        <circle cx="11" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <circle cx="21" cy="14" r="1.5" fill={color} opacity={active ? 1 : 0.5} />
        <path d="M10 19 Q16 27 22 19" fill={active ? `${color}44` : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.5} />
      </svg>
    ),
  };

  return faces[level] || null;
}

// Energy bar SVG
function EnergyBar({ level, maxLevel = 5, active, color }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
      {Array.from({ length: maxLevel }, (_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8 + i * 4,
            borderRadius: 2,
            background: i < level ? color : `${color}20`,
            opacity: active ? 1 : 0.5,
            transition: "all 0.15s",
          }}
        />
      ))}
    </div>
  );
}

const MOOD_LABELS = ["Убит", "Устал", "Норм", "Хорошо", "Огонь"];
const ENERGY_LABELS = ["На нуле", "Мало", "Средне", "Много", "Макс"];

export default function EndorphinCheckIn({ onSubmit, onSkip }) {
  const t = useTheme();
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);

  const canSubmit = mood > 0 && energy > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: t.surface,
          borderRadius: 20,
          padding: "28px 24px",
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Как ощущения?</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Отслеживай эндорфин после тренировки</div>
        </div>

        {/* Mood selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Настроение</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                onClick={() => setMood(level)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
              >
                <MoodIcon level={level} active={mood === level} color={mood === level ? t.accent : t.textSubtle} />
                <span style={{ fontSize: 9, color: mood === level ? t.accent : t.textSubtle, fontWeight: mood === level ? 700 : 400 }}>
                  {MOOD_LABELS[level - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Энергия</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                onClick={() => setEnergy(level)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: energy === level ? `${t.accent}15` : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <EnergyBar level={level} active={energy === level} color={energy === level ? t.accent : t.textSubtle} />
                <span style={{ fontSize: 9, color: energy === level ? t.accent : t.textSubtle, fontWeight: energy === level ? 700 : 400 }}>
                  {ENERGY_LABELS[level - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onSkip}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: "transparent",
              color: t.textMuted,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Пропустить
          </button>
          <button
            onClick={() => canSubmit && onSubmit({ mood, energy })}
            disabled={!canSubmit}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: canSubmit ? t.accent : t.surface3,
              color: canSubmit ? "#fff" : t.textSubtle,
              fontSize: 13,
              fontWeight: 600,
              cursor: canSubmit ? "pointer" : "default",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            Записать
          </button>
        </div>
      </div>
    </div>
  );
}
