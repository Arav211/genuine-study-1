import { useState, useEffect } from "react";
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  FileText, 
  FlaskConical, 
  Orbit,
  LogIn,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PomodoroTimer } from "./components/study/PomodoroTimer";
import { TodoList } from "./components/study/TodoList";
import { FlashcardDeck } from "./components/study/FlashcardDeck";
import { Scratchpad } from "./components/study/Scratchpad";
import { CopilotChat } from "./components/study/CopilotChat";
import { ConceptMapper } from "./components/study/ConceptMapper";
import { Notes } from "./components/study/Notes";
import { StudyLab } from "./components/study/StudyLab";
import { cn } from "./lib/utils";
import { useAuth } from "./lib/AuthContext";

import { LandingPage } from "./components/auth/LandingPage";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { TermsAndConditions } from "./components/legal/TermsAndConditions";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "cards" | "notes" | "lab">("dashboard");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user, loading, signIn, logout } = useAuth();

  useEffect(() => {
    (window as any).showPrivacy = () => setShowPrivacy(true);
    (window as any).showTerms = () => setShowTerms(true);
    return () => { 
      delete (window as any).showPrivacy;
      delete (window as any).showTerms;
    };
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Brain },
    { id: "chat", label: "AI", icon: MessageSquare },
    { id: "cards", label: "Cards", icon: Lightbulb },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "lab", label: "Lab", icon: FlaskConical },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-slate-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  if (showTerms) {
    return <TermsAndConditions onBack={() => setShowTerms(false)} />;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 md:pb-0">
      {/* Top Header */}
      <nav className="sticky top-0 z-50 px-4 md:px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center overflow-hidden w-9 h-9 md:w-10 md:h-10">
                <Orbit className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400 animate-[spin_10s_linear_infinite]" />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] bg-clip-text text-transparent">
              Genuine Study
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-sm font-bold uppercase tracking-wider",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticated</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{user.displayName || user.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                disabled={loading}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm overflow-hidden">
                  <ConceptMapper />
                </section>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
                    <FlashcardDeck compact />
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
                    <Scratchpad />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <aside className="lg:col-span-4 flex flex-col gap-6">
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-indigo-600">
                  <PomodoroTimer />
                </section>
                
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[400px]">
                  <TodoList />
                </section>
              </aside>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-10rem)]"
            >
              <CopilotChat fullScreen />
            </motion.div>
          )}

          {activeTab === "cards" && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FlashcardDeck />
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Notes />
            </motion.div>
          )}

          {activeTab === "lab" && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <StudyLab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden px-2 py-1">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-all rounded-xl",
                activeTab === tab.id 
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 font-bold" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "scale-110" : "")} />
              <span className="text-[10px] uppercase font-black tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
