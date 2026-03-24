import { Check, ChevronDown, Info, Target, Lightbulb } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { EXERCISE_INFO } from "../data/exercises";

export default function ExerciseRow({ exercise, done, onToggle, open, onOpen }) {
  const t = useTheme();
  const info = EXERCISE_INFO[exercise.id] || {};

  return (
    <div
      style={{
        background: done ? t.greenSoft : t.surface,
        border: `1px solid ${done ? `${t.green}33` : t.border}`,
        borderRadius: 10,
        overflow: "hidden",
        opacity: done ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `2px solid ${done ? t.green : t.border}`,
            background: done ? t.green : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {done && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: exercise.priority ? 600 : 500,
              color: exercise.priority && !done ? t.accent : t.text,
              textDecoration: done ? "line-through" : "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {exercise.priority && <Target size={12} style={{ flexShrink: 0 }} />}
            {info.short || exercise.id}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {exercise.weight && (
            <span
              style={{
                fontSize: 10,
                color: t.textSubtle,
                background: t.surface2,
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {exercise.weight}
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: done ? t.green : t.accent }}>
            {done ? <Check size={14} /> : exercise.reps}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: t.textMuted,
              padding: 2,
              display: "flex",
            }}
          >
            {open ? <ChevronDown size={16} /> : <Info size={16} />}
          </button>
        </div>
      </div>
      {open && info.desc && (
        <div style={{ padding: "0 12px 12px 44px", fontSize: 12, lineHeight: 1.5, color: t.textMuted }}>
          <p style={{ margin: "0 0 6px" }}>{info.desc}</p>
          {(exercise.note || info.tips) && (
            <div
              style={{
                background: `${t.accent}10`,
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 11,
                color: t.accent,
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <Lightbulb size={12} style={{ flexShrink: 0, marginTop: 1 }} />
              {exercise.note || info.tips}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
