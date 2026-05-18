import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Search, Save, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Note } from "../../types";
import { explainConcept } from "../../lib/gemini";
import { cn } from "../../lib/utils";

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("genuine_study_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id || null);
  const [search, setSearch] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    localStorage.setItem("genuine_study_notes", JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find(n => n.id === selectedId);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (selectedId === id) setSelectedId(filtered[0]?.id || null);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAIImprove = async () => {
    if (!selectedNote || !selectedNote.content.trim()) return;
    setLoadingAI(true);
    try {
      const response = await explainConcept(
        `Improve and organize these notes, make them look professional with markdown: ${selectedNote.content}`,
        "standard"
      );
      if (response) {
        updateNote(selectedNote.id, { content: response });
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to organize notes with AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (selectedId) setShowSidebar(false);
    else setShowSidebar(true);
  }, [selectedId]);

  return (
    <div className="flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all",
        !showSidebar && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> My Notes
            </h2>
            <button 
              onClick={addNote}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
            />
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => { setSelectedId(note.id); setShowSidebar(false); }}
              className={cn(
                "w-full text-left p-4 border-b border-slate-100 dark:border-slate-800/50 transition-all group",
                selectedId === note.id ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={cn(
                  "text-sm font-bold truncate pr-4",
                  selectedId === note.id ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                )}>
                  {note.title || "Untitled Note"}
                </h3>
                <Trash2 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="w-3.5 h-3.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" 
                />
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{note.content || "Empty content..."}</p>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-10" />
              <p className="text-xs">No notes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className={cn(
        "flex-grow flex flex-col bg-white dark:bg-slate-950 transition-all",
        showSidebar && "hidden md:flex"
      )}>
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-grow">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <input 
                  type="text" 
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="text-sm md:text-lg font-black bg-transparent outline-none w-full dark:text-white"
                  placeholder="Title..."
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAIImprove}
                  disabled={loadingAI}
                  className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all whitespace-nowrap"
                >
                  {loadingAI ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span className="hidden sm:inline">AI Organize</span>
                  <span className="sm:hidden">AI</span>
                </button>
              </div>
            </div>
            <textarea 
              value={selectedNote.content}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              className="flex-grow p-4 md:p-8 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-xs md:text-sm"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 opacity-10 mb-4" />
            <p className="text-sm">Select a note to start editing or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
