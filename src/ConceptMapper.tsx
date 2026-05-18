import { motion } from "motion/react";
import { Network, Zap, Target, BookOpen, Atom } from "lucide-react";
import { cn } from "../../lib/utils";

export function ConceptMapper() {
  // A simplistic visual placeholder for "Concept Mapping" using animated SVG/Motion
  // In a more complex version, this would be a draggable canvas (e.g. React Flow)
  
  const concepts = [
    { id: 1, label: "Quantum Physics", icon: Atom, x: "50%", y: "50%", color: "text-indigo-500", size: 60 },
    { id: 2, label: "Newtonian Mechanics", icon: Zap, x: "20%", y: "30%", color: "text-amber-500", size: 40 },
    { id: 3, label: "Relativity", icon: Target, x: "80%", y: "25%", color: "text-purple-500", size: 45 },
    { id: 4, label: "Optics", icon: BookOpen, x: "30%", y: "75%", color: "text-emerald-500", size: 40 },
    { id: 5, label: "Thermodynamics", icon: Network, x: "70%", y: "80%", color: "text-red-500", size: 40 },
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[450px] bg-slate-900 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }}></div>

      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
           <Network className="w-5 h-5 text-indigo-400" />
           Concept Explorer
        </h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Interactive Learning Space</p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Analysis</span>
        </div>
      </div>

      {/* SVG Connections (Static for vis) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="30%" y2="75%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </svg>

      {/* Nodes */}
      {concepts.map((concept) => (
        <motion.div
          key={concept.id}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 0.95 }}
          className="absolute cursor-grab active:cursor-grabbing group"
          style={{ left: concept.x, top: concept.y, transform: "translate(-50%, -50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className={cn(
               "rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl relative",
               "transition-all group-hover:border-indigo-500/50"
            )} style={{ width: concept.size, height: concept.size }}>
              <concept.icon className={cn("w-6 h-6", concept.color)} />
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/5 blur-sm group-hover:bg-indigo-500/10 transition-all"></div>
            </div>
            <span className="mt-2 text-[8px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
              {concept.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Experimental Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h4 className="text-4xl font-black text-white/5 uppercase tracking-widest scale-150">Neural Map</h4>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 text-white/20 text-[8px] font-bold uppercase tracking-[0.2em] pointer-events-none">
        Prototype v0.1 • Gesture Enabled
      </div>
    </div>
  );
}
