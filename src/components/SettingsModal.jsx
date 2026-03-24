import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function SettingsModal({ isDark, onToggleMode, onClose }) {
  const t = useTheme();

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-safe">
        <SheetHeader>
          <SheetTitle className="text-xl">Настройки</SheetTitle>
        </SheetHeader>
        <div className="px-2 pt-4 pb-4">
          <Button
            variant="outline"
            className="w-full h-auto justify-between py-4 px-5 rounded-2xl"
            onClick={onToggleMode}
          >
            <div className="text-left">
              <div className="text-[15px] font-semibold">Оформление</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isDark ? "Тёмная тема" : "Светлая тема"}
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: t.accentSoft, color: t.accent }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
