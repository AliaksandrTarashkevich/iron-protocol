import { useState, useCallback } from "react";
import { THEME } from "./styles/theme";
import { PLAN } from "./data/plan";
import { ThemeContext } from "./context/ThemeContext";
import { useLocalStorage, useLocalStorageString } from "./hooks/useLocalStorage";
import Header from "./components/Header";
import WeekProgress from "./components/WeekProgress";
import TabBar from "./components/TabBar";
import Celebration from "./components/Celebration";
import SettingsModal from "./components/SettingsModal";
import WorkoutTab from "./tabs/WorkoutTab";
import ProgramTab from "./tabs/ProgramTab";
import CalendarTab from "./tabs/CalendarTab";
import ProgressTab from "./tabs/ProgressTab";

export default function App() {
  // Theme
  const [mode, setMode] = useLocalStorageString("wt_th", "dark");
  const theme = THEME[mode];

  // Navigation
  const [activeTab, setActiveTab] = useState("workout");

  // Core state (persisted)
  const [currentWeek, setCurrentWeek] = useLocalStorage("wt_w", 0);
  const [completedWorkouts, setCompletedWorkouts] = useLocalStorage("wt_d", {});
  const [weightLog, setWeightLog] = useLocalStorage("wt_wl", []);

  // UI state
  const [viewingWeek, setViewingWeek] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Derived values
  const week = PLAN[currentWeek];
  const completedCount = Object.values(completedWorkouts).filter((c) => c.week === currentWeek).length;
  const dayIndex = Math.min(completedCount, 2);
  const today = new Date().toISOString().slice(0, 10);
  const todayKey = `${today}_w${currentWeek}_d${dayIndex}`;
  const todayDone = todayKey in completedWorkouts;

  // Actions
  const handleMarkComplete = useCallback(() => {
    const workout = week.days[dayIndex];
    setCompletedWorkouts((prev) => ({
      ...prev,
      [todayKey]: {
        week: currentWeek,
        day: dayIndex,
        name: workout.name,
        date: today,
        rounds: week.rounds,
        exercises: workout.exercises.map((e) => ({ id: e.id, reps: e.reps })),
      },
    }));
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setActiveTab("calendar");
    }, 2500);
  }, [currentWeek, dayIndex, today, todayKey, week]);

  const handleAddWeight = useCallback(
    (weight) => {
      setWeightLog((prev) =>
        [...prev.filter((e) => e.date !== today), { date: today, weight }].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      );
    },
    [today],
  );

  const handleToggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          color: theme.text,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          maxWidth: 480,
          margin: "0 auto",
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {showCelebration && <Celebration />}
        {showSettings && (
          <SettingsModal
            mode={mode}
            onToggleMode={handleToggleMode}
            onClose={() => setShowSettings(false)}
          />
        )}

        <Header
          onOpenSettings={() => setShowSettings(true)}
          currentWeek={currentWeek}
          viewingWeek={viewingWeek}
          activeTab={activeTab}
        />

        <WeekProgress currentWeek={currentWeek} viewingWeek={viewingWeek} activeTab={activeTab} />

        <div style={{ padding: "4px 16px 0" }}>
          {activeTab === "workout" && (
            <WorkoutTab
              week={week}
              currentWeek={currentWeek}
              dayIndex={dayIndex}
              todayDone={todayDone}
              completedCount={completedCount}
              onMarkComplete={handleMarkComplete}
            />
          )}

          {activeTab === "program" && (
            <ProgramTab
              currentWeek={currentWeek}
              viewingWeek={viewingWeek}
              onViewWeek={setViewingWeek}
              onSwitchWeek={setCurrentWeek}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarTab completedWorkouts={completedWorkouts} currentWeek={currentWeek} />
          )}

          {activeTab === "weight" && (
            <ProgressTab
              weightLog={weightLog}
              onAddWeight={handleAddWeight}
              completedWorkouts={completedWorkouts}
            />
          )}
        </div>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeContext.Provider>
  );
}
