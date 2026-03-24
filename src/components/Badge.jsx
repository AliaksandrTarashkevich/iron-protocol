export default function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 6,
        background: `${color}20`,
        color,
      }}
    >
      {children}
    </span>
  );
}
