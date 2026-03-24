import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style }) {
  const t = useTheme();
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: 16,
        boxShadow: t.shadow,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
