import { Check, ChevronDown, Info, Target, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { EXERCISE_INFO } from "../data/exercises";

export default function ExerciseRow({ exercise, done, onToggle, open, onOpen }) {
  const t = useTheme();
  const info = EXERCISE_INFO[exercise.id] || {};

  return (
    <motion.div
      layout
      style={{
        background: done ? t.greenSoft : (t.surfaceSolid || t.surface),
        border: done ? `1px solid ${t.green}33` : (t.cardBorder || `1px solid ${t.border}`),
        borderRadius: t.exerciseRadius || 12,
        overflow: "hidden",
        ...(t.cardBlur > 0 && {
          backdropFilter: `blur(${t.cardBlur}px)`,
          WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
        }),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        {/* Circular checkbox with gradient */}
        <motion.div
          animate={{
            scale: done ? [1, 1.25, 1] : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: done ? "none" : `2px solid ${t.surface3}`,
            background: done
              ? (t.accentGradient || `linear-gradient(135deg, ${t.green}, #16a34a)`)
              : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: done ? `0 0 12px ${t.green}44` : "none",
            transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
          }}
        >
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check size={13} color="#fff" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Exercise info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: exercise.priority ? 600 : 500,
              color: done ? t.textMuted : exercise.priority ? (t.accentDark || t.accent) : t.text,
              textDecoration: done ? "line-through" : "none",
              opacity: done ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 5,
              letterSpacing: "-0.01em",
            }}
          >
            {exercise.priority && (
              <Target
                size={13}
                style={{
                  flexShrink: 0,
                  color: t.accent,
                  filter: `drop-shadow(0 0 4px ${t.accent}44)`,
                }}
              />
            )}
            {info.short || exercise.id}
          </div>
          {exercise.weight && (
            <div style={{ fontSize: 11, color: t.textSubtle, marginTop: 2 }}>
              {exercise.weight}
            </div>
          )}
        </div>

        {/* Reps + info button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: done ? t.green : (t.accentDark || t.accent),
              minWidth: 28,
              textAlign: "right",
              letterSpacing: "-0.02em",
            }}
          >
            {done ? <Check size={16} /> : exercise.reps}
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            style={{
              background: open ? `${t.accent}15` : "transparent",
              border: "none",
              cursor: "pointer",
              color: open ? t.accent : t.textSubtle,
              padding: 4,
              borderRadius: 6,
              display: "flex",
              transition: "all 0.15s",
            }}
          >
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              {open ? <ChevronDown size={16} /> : <Info size={16} />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Expandable info */}
      <AnimatePresence>
        {open && info.desc && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 14px 14px 50px",
                fontSize: 13,
                lineHeight: 1.6,
                color: t.textMuted,
              }}
            >
              <p style={{ margin: "0 0 8px" }}>{info.desc}</p>
              {(exercise.note || info.tips) && (
                <div
                  style={{
                    background: `${t.accent}08`,
                    border: `1px solid ${t.accent}15`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: t.accent,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    lineHeight: 1.5,
                  }}
                >
                  <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  {exercise.note || info.tips}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
