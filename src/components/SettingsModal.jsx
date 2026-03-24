import { X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { STYLE_META, THEME } from "../styles/theme";

const STYLES = ["minimal", "glass", "premium"];

function StylePreview({ styleKey, active, theme, onClick }) {
  const meta = STYLE_META[styleKey];
  const previewTheme = THEME[meta.darkKey];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        flex: 1,
        padding: 0,
        border: active ? `2px solid ${theme.accent}` : `2px solid ${theme.border || "transparent"}`,
        borderRadius: 14,
        background: "transparent",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Mini preview */}
      <div
        style={{
          background: previewTheme.bgGradient || previewTheme.bg,
          padding: 10,
          height: 72,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            background: previewTheme.surface,
            border: previewTheme.cardBorder,
            borderRadius: previewTheme.cardRadius * 0.4,
            height: 10,
            ...(previewTheme.cardBlur > 0 && {
              backdropFilter: `blur(${previewTheme.cardBlur}px)`,
            }),
          }}
        />
        <div style={{ display: "flex", gap: 3, flex: 1 }}>
          <div
            style={{
              flex: 1,
              background: previewTheme.surface,
              border: previewTheme.cardBorder,
              borderRadius: previewTheme.cardRadius * 0.3,
            }}
          />
          <div
            style={{
              flex: 1,
              background: previewTheme.accentGradient || previewTheme.accent,
              borderRadius: previewTheme.buttonRadius > 20 ? 8 : previewTheme.cardRadius * 0.3,
              boxShadow: previewTheme.buttonGlow,
            }}
          />
        </div>
      </div>
      {/* Label */}
      <div style={{ padding: "8px 6px", background: theme.surface2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: active ? theme.accent : theme.text }}>
          {meta.label}
        </div>
        <div style={{ fontSize: 9, color: theme.textSubtle, marginTop: 1 }}>{meta.description}</div>
      </div>
    </motion.button>
  );
}

export default function SettingsModal({ currentStyle, isDark, onChangeStyle, onToggleDarkLight, onClose }) {
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
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
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
          background: t.style === "glass" ? t.surface2 : t.surface,
          borderRadius: "20px 20px 0 0",
          padding: "20px 16px env(safe-area-inset-bottom, 16px)",
          zIndex: 301,
          ...(t.cardBlur > 0 && {
            backdropFilter: `blur(${t.cardBlur}px)`,
            WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
          }),
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.surface3 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Оформление</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: t.surface2,
              border: "none",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: t.text,
            }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Style picker */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {STYLES.map((s) => (
            <StylePreview
              key={s}
              styleKey={s}
              active={currentStyle === s}
              theme={t}
              onClick={() => onChangeStyle(s)}
            />
          ))}
        </div>

        {/* Dark/Light toggle (disabled for premium) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            opacity: currentStyle === "premium" ? 0.3 : 1,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Режим</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              {currentStyle === "premium" ? "Только тёмный" : isDark ? "Тёмный" : "Светлый"}
            </div>
          </div>
          <motion.button
            whileTap={currentStyle !== "premium" ? { scale: 0.9, rotate: 180 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => currentStyle !== "premium" && onToggleDarkLight()}
            style={{
              background: t.surface2,
              border: `1px solid ${t.border || "transparent"}`,
              borderRadius: 8,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentStyle === "premium" ? "default" : "pointer",
              color: t.text,
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
