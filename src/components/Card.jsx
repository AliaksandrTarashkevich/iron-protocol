import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style, variant = "default" }) {
  const t = useTheme();

  const variants = {
    default: {
      background: t.surface,
      border: t.cardBorder,
      borderRadius: t.cardRadius,
      padding: 20,
      boxShadow: t.shadow,
      backdropFilter: `blur(${t.cardBlur}px)`,
      WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
    },
    solid: {
      background: t.surfaceSolid,
      border: "none",
      borderRadius: t.cardRadius,
      padding: 20,
      boxShadow: t.shadow,
    },
    accent: {
      background: t.accentSoft,
      border: "none",
      borderRadius: t.cardRadius,
      padding: 20,
    },
    flat: {
      background: t.surface2,
      border: "none",
      borderRadius: t.cardRadius,
      padding: 16,
      backdropFilter: `blur(${t.cardBlur}px)`,
      WebkitBackdropFilter: `blur(${t.cardBlur}px)`,
    },
  };

  return (
    <div style={{ ...variants[variant], ...style }}>
      {children}
    </div>
  );
}
