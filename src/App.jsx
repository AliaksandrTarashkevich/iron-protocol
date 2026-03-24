import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME } from "./styles/theme";
import { PLAN } from "./data/plan";
import { ThemeContext } from "./context/ThemeContext";
import { useLocalStorage, useLocalStorageString } from "./hooks/useLocalStorage";
import Header from "./components/Header";
import WeekProgress from "./components/WeekProgress";
import TabBar from "./components/TabBar";
import Celebration from "./components/Celebration";
import SettingsModal from "./components/SettingsModal";
import EndorphinCheckIn from "./components/EndorphinCheckIn";
import WorkoutTab from "./tabs/WorkoutTab";
import ProgramTab from "./tabs/ProgramTab";
import CalendarTab from "./tabs/CalendarTab";
import ProgressTab from "./tabs/ProgressTab";

const TAB_ORDER = ["workout", "program", "calendar", "weight"];

export default function App() {
  // Theme
  const [mode, setMode] = useLocalStorageString("wt_th", "dark");
  const theme = THEME[mode];

  // Navigation
  const [activeTab, setActiveTab] = useState("workout");
  const prevTabRef = useRef(0);
  const tabIndex = TAB_ORDER.indexOf(activeTab);

  const handleTabChange = useCallback((tab) => {
    prevTabRef.current = TAB_ORDER.indexOf(activeTab);
    setActiveTab(tab);
  }, [activeTab]);

  // Swipe direction: 1 = right (next), -1 = left (prev)
  const direction = tabIndex > prevTabRef.current ? 1 : -1;

  const handleSwipe = useCallback((_, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold && tabIndex < TAB_ORDER.length - 1) {
      handleTabChange(TAB_ORDER[tabIndex + 1]);
    } else if (info.offset.x > threshold && tabIndex > 0) {
      handleTabChange(TAB_ORDER[tabIndex - 1]);
    }
  }, [tabIndex, handleTabChange]);

  // Core state (persisted)
  const [currentWeek, setCurrentWeek] = useLocalStorage("wt_w", 0);
  const [completedWorkouts, setCompletedWorkouts] = useLocalStorage("wt_d", {});
  const [weightLog, setWeightLog] = useLocalStorage("wt_wl", []);
  const [endorphinLog, setEndorphinLog] = useLocalStorage("wt_el", []);

  // UI state
  const [viewingWeek, setViewingWeek] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEndorphinCheckIn, setShowEndorphinCheckIn] = useState(false);
  const [pendingWorkoutKey, setPendingWorkoutKey] = useState(null);

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
    setPendingWorkoutKey(todayKey);
    setShowEndorphinCheckIn(true);
  }, [currentWeek, dayIndex, today, todayKey, week]);

  const handleEndorphinSubmit = useCallback(
    ({ mood, energy }) => {
      setEndorphinLog((prev) => [
        ...prev.filter((e) => e.date !== today),
        { date: today, mood, energy, workoutKey: pendingWorkoutKey },
      ]);
      setShowEndorphinCheckIn(false);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        handleTabChange("calendar");
      }, 2500);
    },
    [today, pendingWorkoutKey, handleTabChange],
  );

  const handleEndorphinSkip = useCallback(() => {
    setShowEndorphinCheckIn(false);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      handleTabChange("calendar");
    }, 2500);
  }, [handleTabChange]);

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

  const tabVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

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
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {showEndorphinCheckIn && (
            <EndorphinCheckIn onSubmit={handleEndorphinSubmit} onSkip={handleEndorphinSkip} />
          )}
        </AnimatePresence>
        {showCelebration && <Celebration />}
        <AnimatePresence>
          {showSettings && (
            <SettingsModal
              mode={mode}
              onToggleMode={handleToggleMode}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        <Header
          onOpenSettings={() => setShowSettings(true)}
          currentWeek={currentWeek}
          viewingWeek={viewingWeek}
          activeTab={activeTab}
        />

        <WeekProgress currentWeek={currentWeek} viewingWeek={viewingWeek} activeTab={activeTab} />

        <div style={{ padding: "4px 16px 0", overflow: "hidden" }}>
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleSwipe}
            >
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
                  endorphinLog={endorphinLog}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </ThemeContext.Provider>
  );
}
