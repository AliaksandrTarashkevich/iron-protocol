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
        background: done ? t.greenSoft : t.surface,
        border: `1px solid ${done ? `${t.green}33` : t.border}`,
        borderRadius: 10,
        overflow: "hidden",
        opacity: done ? 0.6 : 1,
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
        {/* Morphing checkbox */}
        <motion.div
          animate={{
            scale: done ? [1, 1.3, 1] : 1,
            borderColor: done ? t.green : t.border,
            background: done ? t.green : "transparent",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
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
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check size={14} color="#fff" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
          <motion.button
            whileTap={{ scale: 0.85 }}
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
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              {open ? <ChevronDown size={16} /> : <Info size={16} />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && info.desc && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
