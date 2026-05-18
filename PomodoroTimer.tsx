import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Pause, Coffee, Brain, Settings, Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

type TimerMode = "study" | "short" | "long";

const MODES = {
  study: { label: "Study", minutes: 25, color: "bg-indigo-600" },
  short: { label: "Break", minutes: 5, color: "bg-emerald-500" },
  long: { label: "Long Break", minutes: 15, color: "bg-purple-600" },
};

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("study");
  const [customMinutes, setCustomMinutes] = useState<{ [key in TimerMode]: number }>(() => {
    const saved = localStorage.getItem("genuine_study_timer_settings");
    return saved ? JSON.parse(saved) : {
      study: MODES.study.minutes,
      short: MODES.short.minutes,
      long: MODES.long.minutes,
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(customMinutes.study * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem("genuine_study_timer_settings", JSON.stringify(customMinutes));
  }, [customMinutes]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Sound or Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Timer Finished!", { body: `Your ${mode} session is over.` });
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(customMinutes[mode] * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(customMinutes[newMode] * 60);
  };

  const handleCustomMinutesChange = (m: TimerMode, value: string) => {
    const mins = parseInt(value) || 1;
    const clampedMins = Math.max(1, Math.min(mins, 120));
    const newCustom = { ...customMinutes, [m]: clampedMins };
    setCustomMinutes(newCustom);
    if (mode === m && !isActive) {
      setTimeLeft(clampedMins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8 w-full">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
              mode === m 
                ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="text-center w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="text-7xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "p-3 rounded-xl transition-all",
              isEditing 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
            title="Edit Durations"
          >
            {isEditing ? <Check className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-3 gap-2 mb-8"
          >
            {(Object.keys(MODES) as TimerMode[]).map((m) => (
              <div key={m} className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">{MODES[m].label}</label>
                <input 
                  type="number"
                  value={customMinutes[m]}
                  onChange={(e) => handleCustomMinutesChange(m, e.target.value)}
                  className="w-full text-center bg-slate-100 dark:bg-slate-800 rounded-lg py-2 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            ))}
          </motion.div>
        )}
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={toggleTimer}
            className={cn(
              "flex-grow text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
              isActive ? "bg-slate-400 hover:bg-slate-500" : MODES[mode].color
            )}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? "PAUSE" : "START"}</span>
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-14 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl transition-all flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        {mode === "study" ? <Brain className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
        <span>Focus Session</span>
      </div>
    </div>
  );
}
