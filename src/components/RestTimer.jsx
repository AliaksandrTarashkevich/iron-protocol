import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function RestTimer({ seconds, label, onDone }) {
  const t = useTheme();
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((l) => l - 1), 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {}
      onDone?.();
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  const progress = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 8,
      }}
    >
      <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
        <svg viewBox="0 0 40 40" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="20" cy="20" r="17" fill="none" stroke={t.border} strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke={timeLeft === 0 ? t.green : t.accent}
            strokeWidth="3"
            strokeDasharray={106.8}
            strokeDashoffset={106.8 * (1 - progress / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: t.text,
          }}
        >
          {timeLeft}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: t.textMuted }}>{label}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button
            onClick={() => setRunning(!running)}
            style={{
              background: running ? t.red : t.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {running ? <Pause size={12} /> : <Play size={12} />}
            {running ? "Пауза" : "Старт"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setTimeLeft(seconds);
            }}
            style={{
              background: t.surface3,
              color: t.textMuted,
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
