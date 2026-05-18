import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { MessageSquare, Paperclip, Send, Sparkles, User, Bot, Search, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: { uri: string; title: string }[];
}

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function CopilotChat({ fullScreen }: { fullScreen?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "bot",
      content: "Hello! I'm your Genuine Study AI assistant. I can help you research topics, explain complex concepts, or even quiz you. What are we studying today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResearch, setIsResearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    setLoading(true);

    try {
      const sysInstruction = isResearch 
        ? "You are a research assistant for Genuine Study. Use Google Search to find credible academic resources. Provide a brief overview and relevant links. Use LaTeX $ $ or $$ $$ for any scientific or mathematical notation."
        : "You are an expert study tutor for Genuine Study. Answer concisely, use analogies for complex topics, and encourage active recall. Always use LaTeX $ $ or $$ $$ for mathematical or scientific formulas to ensure they render beautifully.";

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentInput,
          options: {
            system: sysInstruction,
            research: isResearch
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.text || "I apologize, but I couldn't generate a helpful response at this moment.";
      const sources = data.sources || [];

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: responseText,
        sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("AI Error:", err);
      let errorMessage = "Sorry, I ran into an error. Check your API key or try again.";
      let actionLink = "";
      
      if (err.message?.includes("API key not valid") || err.message?.includes("invalid")) {
        errorMessage = "The Gemini API key configured on the server is invalid.";
        actionLink = "https://aistudio.google.com/app/apikey";
      } else if (err.message?.includes("quota") || err.message?.includes("429")) {
        errorMessage = "Gemini quota exceeded (Error 429). Check your usage limits.";
        actionLink = "https://aistudio.google.com/app/plan";
      }

      const content = `${errorMessage}\n\nTechnical details: ${err.message || "Unknown error"}${actionLink ? `\n\n[Fix this here](${actionLink})` : ""}`;

      setMessages(prev => [...prev, { 
        id: "error-" + Date.now(), 
        role: "bot", 
        content
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-3xl flex flex-col shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden",
      fullScreen ? "h-full" : "h-[550px]"
    )}>
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest">AI</h3>
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", loading ? "bg-amber-500" : "bg-emerald-500")} />
                <span className="text-[10px] text-slate-400 font-bold uppercase">{loading ? "Thinking..." : "Ready"}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsResearch(!isResearch)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all border",
              isResearch 
                ? "bg-indigo-600 border-indigo-500 text-white" 
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            )}
          >
            <Search className="w-3 h-3" />
            <span>RESEARCH MODE</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex w-full mb-4",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200" 
                : "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50 rounded-tl-none text-indigo-900 dark:text-indigo-100"
            )}>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-indigo-900/50 flex flex-wrap gap-1.5">
                  {msg.sources.slice(0, 4).map((source, i) => (
                    <a 
                      key={i}
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all truncate max-w-[120px]"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-grow pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all dark:text-white placeholder:text-slate-400" 
            placeholder={isResearch ? "Ask for study resources..." : "Ask anything..."} 
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="h-10 w-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 transition-all flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
