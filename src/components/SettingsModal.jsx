import { useState } from "react";
import { Download, Upload, Copy, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const BACKUP_KEYS = ["wt_w", "wt_d", "wt_wl", "wt_el"];

function gatherBackup() {
  const data = {};
  for (const key of BACKUP_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) data[key] = JSON.parse(raw);
    } catch {}
  }
  return {
    version: 1,
    app: "iron-protocol",
    exportedAt: new Date().toISOString(),
    data,
  };
}

export default function SettingsModal({ onClose }) {
  const t = useTheme();
  const [copied, setCopied] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [restoreText, setRestoreText] = useState("");
  const [restoreError, setRestoreError] = useState("");

  const handleCopy = async () => {
    const json = JSON.stringify(gatherBackup(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: download instead
      handleDownload();
    }
  };

  const handleDownload = () => {
    const json = JSON.stringify(gatherBackup(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iron-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    setRestoreError("");
    try {
      const parsed = JSON.parse(restoreText);
      if (!parsed.data || typeof parsed.data !== "object") {
        setRestoreError("Неверный формат: нет поля data");
        return;
      }
      // Validate at least one expected key
      const hasValidKey = BACKUP_KEYS.some((k) => k in parsed.data);
      if (!hasValidKey) {
        setRestoreError("Неверный формат: данные не найдены");
        return;
      }
      // Write to localStorage
      for (const [key, value] of Object.entries(parsed.data)) {
        if (BACKUP_KEYS.includes(key)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }
      window.location.reload();
    } catch {
      setRestoreError("Ошибка парсинга JSON");
    }
  };

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}>
        <SheetHeader style={{ padding: "12px 24px 16px" }}>
          <SheetTitle className="text-lg">Настройки</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "0 24px 16px" }} className="flex flex-col gap-3">
          {/* Copy backup */}
          <Button
            variant="outline"
            className="w-full h-auto justify-between rounded-2xl" style={{ padding: "18px 20px" }}
            onClick={handleCopy}
          >
            <div className="text-left flex-1 min-w-0 mr-3">
              <div className="text-[15px] font-semibold">Скопировать бэкап</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Весь прогресс в буфер обмена
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: t.accentSoft, color: t.accent }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </div>
          </Button>

          {/* Download backup */}
          <Button
            variant="outline"
            className="w-full h-auto justify-between rounded-2xl" style={{ padding: "18px 20px" }}
            onClick={handleDownload}
          >
            <div className="text-left flex-1 min-w-0 mr-3">
              <div className="text-[15px] font-semibold">Скачать файл</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                JSON файл в Downloads
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: t.accentSoft, color: t.accent }}
            >
              <Download size={20} />
            </div>
          </Button>

          {/* Restore */}
          {!showRestore ? (
            <Button
              variant="outline"
              className="w-full h-auto justify-between rounded-2xl" style={{ padding: "18px 20px" }}
              onClick={() => setShowRestore(true)}
            >
              <div className="text-left flex-1 min-w-0 mr-3">
                <div className="text-[15px] font-semibold">Восстановить</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Вставить бэкап из буфера
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: t.accentSoft, color: t.accent }}
              >
                <Upload size={20} />
              </div>
            </Button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={restoreText}
                onChange={(e) => setRestoreText(e.target.value)}
                placeholder='Вставьте JSON бэкап сюда...'
                className="w-full h-28 rounded-xl p-3 text-sm resize-none border"
                style={{
                  background: t.surface,
                  color: t.text,
                  borderColor: t.border,
                }}
              />
              {restoreError && (
                <div className="text-xs" style={{ color: t.red }}>{restoreError}</div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => { setShowRestore(false); setRestoreText(""); setRestoreError(""); }}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 rounded-xl"
                  style={{ background: t.accent, color: "#111" }}
                  onClick={handleRestore}
                  disabled={!restoreText.trim()}
                >
                  Восстановить
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
