import { useState, useEffect } from "react";
import { Plus, Check, Trash2, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Todo } from "../../types";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("genuine_study_todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("genuine_study_todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <>
      <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-indigo-500" /> Today's Goals
      </h3>
      
      <div className="relative mb-6">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all text-sm shadow-sm dark:text-slate-200" 
          placeholder="Add a new task..." 
        />
        <button 
          onClick={addTodo}
          className="absolute right-2 top-1.5 h-9 w-9 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center font-bold"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 flex-grow max-h-[400px]">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm"
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>
              
              <span className={`text-sm flex-grow transition-all ${
                todo.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
              }`}>
                {todo.text}
              </span>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600">
            <ListTodo className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">All caught up!</p>
          </div>
        )}
      </div>
    </>
  );
}
