import { X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function SettingsModal({ isDark, onToggleMode, onClose }) {
  const t = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: t.surfaceSolid || t.surface,
          borderRadius: "24px 24px 0 0",
          padding: "16px 20px env(safe-area-inset-bottom, 20px)",
          zIndex: 301,
          boxShadow: "0 -4px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: t.surface3 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Настройки</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: t.surface3,
              border: "none",
              borderRadius: 10,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: t.textMuted,
            }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onToggleMode}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 18px",
            background: t.surface,
            border: "none",
            borderRadius: t.cardRadius,
            cursor: "pointer",
            backdropFilter: `blur(${t.cardBlur}px)`,
            boxShadow: t.shadow,
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Оформление</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
              {isDark ? "Тёмная тема" : "Светлая тема"}
            </div>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: t.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.accent,
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
