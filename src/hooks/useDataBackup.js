export function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    theme: localStorage.getItem("wt_th"),
    currentWeek: JSON.parse(localStorage.getItem("wt_w") || "0"),
    completedWorkouts: JSON.parse(localStorage.getItem("wt_d") || "{}"),
    weightLog: JSON.parse(localStorage.getItem("wt_wl") || "[]"),
    endorphinLog: JSON.parse(localStorage.getItem("wt_el") || "[]"),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `iron-protocol-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version) {
          reject(new Error("Invalid backup file"));
          return;
        }

        if (data.theme) localStorage.setItem("wt_th", data.theme);
        if (data.currentWeek != null) localStorage.setItem("wt_w", JSON.stringify(data.currentWeek));
        if (data.completedWorkouts) localStorage.setItem("wt_d", JSON.stringify(data.completedWorkouts));
        if (data.weightLog) localStorage.setItem("wt_wl", JSON.stringify(data.weightLog));
        if (data.endorphinLog) localStorage.setItem("wt_el", JSON.stringify(data.endorphinLog));

        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
