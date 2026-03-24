import { useState, useRef } from "react";
import { X, Sun, Moon, Download, Upload, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { exportData, importData } from "../hooks/useDataBackup";

export default function SettingsModal({ mode, onToggleMode, onClose }) {
  const t = useTheme();
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importData(file);
      setImportStatus("success");
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setImportStatus("error");
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: t.surface,
          borderRadius: "20px 20px 0 0",
          padding: "20px 16px env(safe-area-inset-bottom, 16px)",
          zIndex: 301,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Настройки</h2>
          <button
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
          </button>
        </div>

        {/* Theme Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Тема</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>{mode === "dark" ? "Тёмная" : "Светлая"}</div>
          </div>
          <button
            onClick={onToggleMode}
            style={{
              background: t.surface2,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: t.text,
            }}
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Export */}
        <div style={{ padding: "16px 0 8px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Данные</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>
            Экспорт сохранит все тренировки, вес и настроения в файл
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={exportData}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: t.accent,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Download size={16} /> Экспорт
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 12,
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: t.surface2,
                color: t.text,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Upload size={16} /> Импорт
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
          </div>
          {importStatus === "success" && (
            <div style={{ marginTop: 8, fontSize: 12, color: t.green, fontWeight: 600, textAlign: "center" }}>
              Данные восстановлены! Перезагрузка...
            </div>
          )}
          {importStatus === "error" && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: t.red,
                fontWeight: 600,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <AlertCircle size={14} /> Ошибка: неверный файл
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
