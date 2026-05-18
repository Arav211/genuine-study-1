import { FlaskConical, Rocket, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function StudyLab() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center overflow-hidden relative">
      {/* Decorative background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="bg-indigo-600/10 p-6 rounded-full inline-block mb-6 border border-indigo-600/20">
          <FlaskConical className="w-16 h-16 text-indigo-600 animate-pulse" />
        </div>
        
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight uppercase">
          Interactive Lab
        </h2>
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Coming Soon
          </span>
          <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
        </div>
        
        <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          We are building a revolutionary 3D environment for anatomy visualization and virtual chemistry simulations. Mix molecules, explore the human body, and learn through exploration.
        </p>
        
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 uppercase border border-slate-100 dark:border-slate-700">
            <Rocket className="w-3 h-3" /> Phase: Alpha Testing
          </div>
        </div>
      </motion.div>

      {/* Experimental Aesthetic nodes */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-indigo-400/20 rounded-full" />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400/20 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-blue-400/20 rounded-full" />
    </div>
  );
}
