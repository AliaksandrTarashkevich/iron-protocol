import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CONFETTI_COLORS = ["#22c55e", "#6366f1", "#eab308", "#f97316", "#ec4899", "#8b5cf6", "#06b6d4"];

export default function Celebration() {
  const t = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Confetti */}
      {Array.from({ length: 40 }, (_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: `${Math.random() * 100}vw`,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: 720,
            opacity: 0,
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            width: 6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : 2,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          }}
        />
      ))}

      {/* Trophy card */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
        style={{
          background: t.surface,
          borderRadius: 20,
          padding: "32px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          textAlign: "center",
          zIndex: 201,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: 2, repeatType: "loop" }}
        >
          <Trophy size={48} color={t.green} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 20, fontWeight: 800, color: t.green, marginTop: 8 }}
        >
          ОТЛИЧНАЯ РАБОТА!
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}
        >
          Тренировка записана
        </motion.div>
      </motion.div>
    </div>
  );
}
