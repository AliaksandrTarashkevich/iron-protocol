import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style }) {
  const t = useTheme();
  return (
    <div
      style={{
        background: t.surface,
        border: t.cardBorder,
        borderRadius: t.cardRadius,
        padding: 16,
        boxShadow: t.shadow,
        ...(t.cardBlur > 0 && {
          backdropFilter: `blur(${t.cardBlur}px)`,
          WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
