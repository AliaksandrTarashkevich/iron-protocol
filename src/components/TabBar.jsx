import { Dumbbell, Target, Calendar, TrendingDown } from "lucide-react";
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
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        display: "flex",
        padding: "4px 0 env(safe-area-inset-bottom, 6px)",
        zIndex: 100,
      }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "6px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? t.accent : t.textSubtle,
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              fontFamily: "inherit",
            }}
          >
            <Icon size={20} />
            <span style={{ marginTop: 2 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
