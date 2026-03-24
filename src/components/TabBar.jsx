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
        background: t.isDark ? `${t.bg}ee` : `${t.surface}ee`,
        borderTop: `1px solid ${t.border || "transparent"}`,
        display: "flex",
        padding: "6px 8px env(safe-area-inset-bottom, 8px)",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? t.accent : t.textSubtle,
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              fontFamily: "'Inter', inherit",
              position: "relative",
              letterSpacing: "-0.01em",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon
                size={21}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{
                  filter: isActive ? `drop-shadow(0 0 6px ${t.accent}55)` : "none",
                  transition: "filter 0.2s",
                }}
              />
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: t.accent,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </div>
            <span style={{ marginTop: 4 }}>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
