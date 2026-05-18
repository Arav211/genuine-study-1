import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Orbit, LogIn, Brain, Sparkles, Zap, Shield, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export function LandingPage() {
  const { signIn, loading } = useAuth();
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleStart = () => {
    setShowConsentModal(true);
  };

  const handleAcceptAndSignIn = () => {
    setShowConsentModal(false);
    signIn();
  };

  const features = [
    { icon: Brain, title: "AI Concept Mapping", desc: "Visualize connections between complex topics automatically." },
    { icon: Zap, title: "Quick Flashcards", desc: "Generated summary cards to boost your retention speed." },
    { icon: Shield, title: "Secure Sync", desc: "Your study data is always safe and synced across devices." },
    { icon: Sparkles, title: "AI", desc: "Your personal tutor available 24/7 to answer any question." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center z-10 space-y-12"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800 animate-bounce">
            <Orbit className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] bg-clip-text text-transparent">
              Genuine Study
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            The ultimate AI-powered workspace for serious learners. 
            Organize, visualize, and master any subject with the help of your personal study genie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <f.icon className="w-6 h-6 text-indigo-500 mb-3" />
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="pt-8">
          <button 
            onClick={handleStart}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-200 bg-indigo-600 border-2 border-transparent rounded-2xl hover:bg-indigo-700 active:scale-95 shadow-2xl shadow-indigo-200 dark:shadow-none overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full transition-all duration-300 transform translate-x-full bg-white opacity-10 group-hover:translate-x-0 ease"></div>
            <LogIn className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" />
            <span className="relative text-lg">Start Studying Now</span>
          </button>
          <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">
            Secure Google Sign In • No password required
          </p>
        </div>
      </motion.div>

      {/* Consent Modal */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConsentModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
            >
              <button 
                onClick={() => setShowConsentModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black dark:text-white">One Last Step</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  By signing in, you agree to our Terms and acknowledge our Privacy Policy.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "I agree to the <button onClick={() => (window as any).showTerms?.()} className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">Terms & Conditions</button> and have read the <button onClick={() => (window as any).showPrivacy?.()} className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">Privacy Policy</button>."
                  </p>
                </div>
              </div>

              <button 
                onClick={handleAcceptAndSignIn}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Agree and Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer hint */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <div className="text-slate-400 text-xs font-medium">
          Trusted by learners worldwide
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => (window as any).showPrivacy?.()}
            className="text-slate-400 hover:text-indigo-500 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => (window as any).showTerms?.()}
            className="text-slate-400 hover:text-indigo-500 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
