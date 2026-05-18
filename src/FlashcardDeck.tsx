import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { Lightbulb, Plus, Wand2, ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Flashcard } from "../../types";
import { generateFlashcards } from "../../lib/gemini";
import { cn } from "../../lib/utils";

interface Props {
  compact?: boolean;
}

export function FlashcardDeck({ compact }: Props) {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("genuine_study_cards");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal form states
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    localStorage.setItem("genuine_study_cards", JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!q.trim() || !a.trim()) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: q.trim(),
      answer: a.trim(),
      createdAt: Date.now(),
    };
    setCards([...cards, newCard]);
    setQ("");
    setA("");
    setIsModalOpen(false);
  };

  const handleAIGen = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    try {
      const generated = await generateFlashcards(aiPrompt);
      const newCards = generated.map((c: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        question: c.question,
        answer: c.answer,
        createdAt: Date.now(),
      }));
      setCards([...cards, ...newCards]);
      setIsAIModalOpen(false);
      setAiPrompt("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = (e: MouseEvent) => {
    e.stopPropagation();
    const newCards = cards.filter((_, i) => i !== currentIndex);
    setCards(newCards);
    if (currentIndex >= newCards.length && currentIndex > 0) {
      setCurrentIndex(newCards.length - 1);
    }
    setIsFlipped(false);
  };

  const nextCard = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const currentCard = cards[currentIndex];

  if (compact) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Active Recall
          </h3>
          <div className="flex gap-1">
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all"
            >
              <Wand2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-2 py-1 rounded-lg"
            >
              + NEW
            </button>
          </div>
        </div>

        {cards.length > 0 ? (
          <div 
            className="flex-grow perspective-1000 group cursor-pointer relative"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full h-full preserve-3d"
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {currentCard.question}
                </p>
                <div className="absolute bottom-3 right-4 text-[8px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest">
                  {currentIndex + 1} / {cards.length} • Question
                </div>
              </div>
              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg"
                style={{ transform: "rotateY(180deg)" }}
              >
                <p className="text-sm text-white font-medium leading-relaxed">
                  {currentCard.answer}
                </p>
                <div className="absolute bottom-3 right-4 text-[8px] font-black uppercase text-indigo-300 tracking-widest">
                  Answer
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400">
            <Lightbulb className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs">No cards yet. Create one manually or use AI to generate from notes.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button 
              onClick={prevCard} 
              disabled={cards.length <= 1}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextCard}
              disabled={cards.length <= 1}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {cards.length > 0 && (
            <button 
              onClick={deleteCard}
              className="p-2 text-slate-400 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Manual Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Card</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Question</label>
                    <textarea 
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 outline-none focus:border-indigo-300 dark:text-white" 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Answer</label>
                    <textarea 
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 outline-none focus:border-indigo-300 dark:text-white" 
                      rows={3} 
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl">Cancel</button>
                    <button onClick={addCard} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none">Save Card</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AI Modal */}
        <AnimatePresence>
          {isAIModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAIModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">AI Generation</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Paste text or a topic to generate 5 cards instantly.</p>
                <div className="space-y-4">
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Photosynthesis process, Newtonian Physics..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 outline-none focus:border-purple-300 dark:text-white" 
                    rows={4} 
                  />
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsAIModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl">Cancel</button>
                    <button 
                      onClick={handleAIGen} 
                      disabled={loading}
                      className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 dark:shadow-none flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      <span>{loading ? "Generating..." : "Generate Cards"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full Screen version for the dedicated tab could be implemented similarly but listing all cards
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">My Decks</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage all your active recall flashcards.</p>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all text-sm"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI GEN</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>ADD MANUAL</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={card.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => {
                const newCards = cards.filter(c => c.id !== card.id);
                setCards(newCards);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all font-bold"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-black text-indigo-500 mb-3 uppercase tracking-widest">Question {idx + 1}</div>
            <h4 className="text-slate-800 dark:text-slate-100 font-bold mb-4 line-clamp-3">{card.question}</h4>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-black text-emerald-500 mb-2 uppercase tracking-widest">Answer</div>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic">{card.answer}</p>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
            <Lightbulb className="w-16 h-16 opacity-10 mb-4" />
            <p>Your deck is empty. Create some cards to get started!</p>
          </div>
        )}
      </div>

       {/* Reuse Modals - for brevity omitted here but in a real app would be shared */}
       {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
             <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Create Card</h2>
                <textarea className="w-full p-4 mb-4 bg-slate-50 dark:bg-slate-800 rounded-xl" placeholder="Question" onChange={e => setQ(e.target.value)} />
                <textarea className="w-full p-4 mb-4 bg-slate-50 dark:bg-slate-800 rounded-xl" placeholder="Answer" onChange={e => setA(e.target.value)} />
                <button onClick={addCard} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
             </div>
          </div>
       )}
       {isAIModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAIModalOpen(false)} />
             <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">AI Generation</h2>
                <textarea className="w-full p-4 mb-4 bg-slate-50 dark:bg-slate-800 rounded-xl" placeholder="Prompt" onChange={e => setAiPrompt(e.target.value)} />
                <button onClick={handleAIGen} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl whitespace-nowrap">
                  {loading ? "Generating..." : "Generate Cards"}
                </button>
             </div>
          </div>
       )}
    </div>
  );
}
