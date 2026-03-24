import { Dumbbell, Target, Calendar, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const TABS = [
  { id: "workout", icon: Dumbbell, label: "Старт" },
  { id: "program", icon: Target, label: "План" },
  { id: "calendar", icon: Calendar, label: "Календарь" },
  { id: "weight", icon: TrendingDown, label: "Прогресс" },
];

export default function TabBar({ activeTab, onTabChange }) {
  const t = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        padding: "8px 12px env(safe-area-inset-bottom, 12px)",
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: t.surfaceSolid || t.surface,
          borderRadius: 20,
          display: "flex",
          padding: "6px",
          boxShadow: t.shadowStrong,
          backdropFilter: `blur(${t.cardBlur}px)`,
          WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
          border: t.cardBorder,
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px 0 6px",
                background: isActive ? t.accentSoft : "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? t.accent : t.textSubtle,
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Inter', inherit",
                borderRadius: 14,
                transition: "background 0.2s, color 0.2s",
                letterSpacing: "-0.01em",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
              <span style={{ marginTop: 3 }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
