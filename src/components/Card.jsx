import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style }) {
  const t = useTheme();
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
