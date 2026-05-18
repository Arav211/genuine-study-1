import { useState } from "react";
import { Pencil, Sparkles } from "lucide-react";
import { explainConcept } from "../../lib/gemini";
import { cn } from "../../lib/utils";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function Scratchpad() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAIAction = async (action: "summarize" | "explain" | "eli5") => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      let prompt = "";
      if (action === "summarize") prompt = `Summarize this effectively. If there are formulas, use LaTeX $ $ or $$ $$: ${text}`;
      else if (action === "explain") prompt = `Explain this concept in detail. Use LaTeX $ $ for any scientific formulas: ${text}`;
      else if (action === "eli5") prompt = `Explain this like I'm 5. Keep it simple but use $ $ for basic science notation if needed: ${text}`;

      const explanation = await explainConcept(prompt, action === "eli5" ? "eli5" : "standard");
      setResult(explanation ?? "Could not process.");
    } catch (err) {
      console.error(err);
      setResult("Error processing with AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Pencil className="w-4 h-4 text-purple-500" /> Scratchpad
        </h3>
        <div className="flex gap-2">
          <button 
            disabled={loading}
            onClick={() => handleAIAction("summarize")}
            className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 px-2 py-1 rounded font-bold transition-all uppercase"
          >
            Summarize
          </button>
          <button 
            disabled={loading}
            onClick={() => handleAIAction("eli5")}
            className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded font-bold transition-all uppercase"
          >
            ELI5
          </button>
        </div>
      </div>

      <div className="relative flex-grow min-h-[150px]">
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none outline-none border border-transparent focus:border-indigo-200 dark:focus:border-indigo-900 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm leading-relaxed" 
          placeholder="Jot down quick formulas or meeting notes..."
        />
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
        )}
      </div>

      {result && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Insight</span>
          </div>
          <div className="prose prose-sm dark:prose-invert text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {result}
            </ReactMarkdown>
          </div>
          <button 
            onClick={() => setResult(null)}
            className="mt-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
}
