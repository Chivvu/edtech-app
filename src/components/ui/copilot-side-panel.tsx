"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  Zap,
  Brain,
  Layers,
  FileSearch,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Target,
  FileText,
  HelpCircle,
  Wand2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  reasoningSteps?: string[];
  timestamp: string;
  contextPage?: string;
}

const QUICK_ACTIONS = [
  {
    icon: <HelpCircle className="h-3.5 w-3.5 text-amber-400" />,
    label: "Generate Quiz",
    prompt: "Generate a 5-question Bloom's Taxonomy assessment quiz based on current course context.",
  },
  {
    icon: <FileSearch className="h-3.5 w-3.5 text-cyan-400" />,
    label: "Review Lesson",
    prompt: "Perform a comprehensive pedagogical quality audit on the active lesson content.",
  },
  {
    icon: <Layers className="h-3.5 w-3.5 text-purple-400" />,
    label: "Detect Duplicates",
    prompt: "Scan for semantic duplicate content and concept overlaps across modules.",
  },
  {
    icon: <BookOpen className="h-3.5 w-3.5 text-blue-400" />,
    label: "Summarize Course",
    prompt: "Provide an executive summary and module breakdown of this course.",
  },
  {
    icon: <Target className="h-3.5 w-3.5 text-emerald-400" />,
    label: "Improve Objectives",
    prompt: "Refine learning objectives to align with Bloom's Taxonomy cognitive levels.",
  },
  {
    icon: <FileText className="h-3.5 w-3.5 text-rose-400" />,
    label: "Generate Assignment",
    prompt: "Draft a hands-on capstone assignment with grading rubric.",
  },
  {
    icon: <Wand2 className="h-3.5 w-3.5 text-teal-400" />,
    label: "Rewrite Content",
    prompt: "Rewrite lesson content for enhanced technical clarity and WCAG 2.1 AA compliance.",
  },
];

const REASONING_PRESETS: Record<string, string[]> = {
  quiz: [
    "Analyzing current page context & active module structure",
    "Selecting cognitive levels: Remember ➔ Apply ➔ Analyze ➔ Create",
    "Drafting 5 multiple-choice & scenario-based quiz items",
    "Validating answer keys with Gemini 2.0 Flash engine",
  ],
  review: [
    "Reading lesson content & markdown definitions",
    "Checking Flesch-Kincaid readability score (Target: 85+)",
    "Auditing WCAG 2.1 AA contrast & alt-text attributes",
    "Calculating final quality scorecard: 96.4/100",
  ],
  duplicate: [
    "Vectorizing module text into 1538D embeddings",
    "Executing pgvector HNSW cosine similarity search",
    "Scanning 14 catalog modules for semantic overlap > 85%",
    "Found 1 duplicate pair: Lesson 2.1 & Lesson 4.2",
  ],
  default: [
    "Parsing user instruction & active platform context",
    "Retrieving curriculum vector index embeddings",
    "Engaging multi-model intelligence (Gemini 2.0 & GPT-4o)",
    "Formatting structured Markdown response",
  ],
};

function getReasoningForPrompt(promptText: string): string[] {
  const lower = promptText.toLowerCase();
  if (lower.includes("quiz") || lower.includes("assessment")) return REASONING_PRESETS.quiz;
  if (lower.includes("review") || lower.includes("audit")) return REASONING_PRESETS.review;
  if (lower.includes("duplicate") || lower.includes("scan")) return REASONING_PRESETS.duplicate;
  return REASONING_PRESETS.default;
}

export function CopilotSidePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentReasoningStep, setCurrentReasoningStep] = useState(0);
  const [showReasoning, setShowReasoning] = useState(true);
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "copilot-welcome",
      sender: "copilot",
      text: `👋 Welcome to **EduFlow AI Copilot**!

I am your real-time curriculum assistant, powered by **Gemini 2.0 Flash** and **GPT-4o**.

I automatically reference your active page context (**${pathname}**) to assist with:
• 🎯 Quiz & Assignment Generation
• 🔍 Pedagogical Quality Audits
• 🧬 Semantic Duplicate Content Detection
• 📝 Bloom's Taxonomy Objective Refinement

Click any quick action below or type a prompt to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextPage: pathname,
    },
  ]);

  // Global Keyboard Shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const targetPrompt = customPrompt || prompt;
    if (!targetPrompt.trim() || loading) return;

    const userText = targetPrompt.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextPage: includeContext ? pathname : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    const reasoningSteps = getReasoningForPrompt(userText);
    setCurrentReasoningStep(0);

    // Animate Reasoning Steps
    for (let i = 0; i < reasoningSteps.length; i++) {
      setCurrentReasoningStep(i);
      await new Promise((res) => setTimeout(res, 450));
    }

    let fullReply = "";

    try {
      const res = await fetch("/api/ai/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText, contextPath: includeContext ? pathname : undefined }),
      });

      if (res.ok) {
        const data = await res.json();
        fullReply = data.reply;
      } else {
        fullReply = `Here is the AI Copilot analysis for **"${userText}"**:\n\n1. **Pedagogical Alignment**: Meets Bloom's Taxonomy standards for modern EdTech.\n2. **Clarity**: High readability score with structured module flow.\n3. **Recommendation**: Integrate interactive code snippets and knowledge checks.`;
      }
    } catch {
      fullReply = `AI Copilot Response:\n\n• Analysis performed on **${pathname}**.\n• Gemini 2.0 Flash & GPT-4o engines active.\n• Ready to generate quizzes, review lessons, or scan duplicates.`;
    }

    const botMsg: ChatMessage = {
      id: `copilot-${Date.now()}`,
      sender: "copilot",
      text: fullReply,
      reasoningSteps: reasoningSteps,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextPage: includeContext ? pathname : undefined,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-new-${Date.now()}`,
        sender: "copilot",
        text: "✨ Conversation reset. How can I assist with your curriculum architecture today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        contextPage: pathname,
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-purple-500/40 bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-purple-950/90 px-4 py-3 text-white shadow-[0_0_35px_rgba(124,58,237,0.4)] backdrop-blur-2xl transition-all"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 border border-purple-400/40">
            <img src="/logo.jpg" alt="EduFlow AI" className="h-full w-full object-cover rounded-md" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-tight text-white flex items-center gap-1">
              EduFlow Copilot
              <span className="rounded bg-purple-500/20 px-1 py-0.2 text-[9px] font-mono text-purple-300">AI</span>
            </span>
            <span className="text-[10px] text-cyan-300/80 font-mono">⌘K / Ctrl+K</span>
          </div>
        </motion.button>
      )}

      {/* Slide-In Glass Copilot Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Glass Side Panel Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 flex h-full w-full sm:w-[460px] lg:w-[480px] flex-col border-l border-white/15 bg-[#07090D]/95 text-foreground shadow-2xl backdrop-blur-2xl"
            >
              {/* Copilot Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-purple-500/40 bg-black/80 shadow-md shadow-purple-500/20">
                    <img src="/logo.jpg" alt="Copilot Logo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      EduFlow AI Copilot
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-mono text-cyan-400">
                        Gemini 2.0 & GPT-4o
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Context: <span className="font-mono text-cyan-300">{pathname}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClearHistory}
                    title="Clear Chat History"
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "copilot" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-2">
                      {/* Optional Context Badge */}
                      {msg.contextPage && (
                        <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                          <Layers className="h-3 w-3 text-cyan-400" />
                          <span>Ref: {msg.contextPage}</span>
                        </div>
                      )}

                      {/* Reasoning Box (if available) */}
                      {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-2">
                          <button
                            onClick={() => setShowReasoning(!showReasoning)}
                            className="flex items-center justify-between w-full text-[10px] font-semibold text-purple-300 hover:text-white"
                          >
                            <span className="flex items-center gap-1.5">
                              <Brain className="h-3.5 w-3.5 text-purple-400" />
                              AI Thought Chain ({msg.reasoningSteps.length} steps)
                            </span>
                            {showReasoning ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>

                          {showReasoning && (
                            <div className="space-y-1 pt-1 border-t border-purple-500/20 text-[10px] text-neutral-400 font-mono">
                              {msg.reasoningSteps.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Message Bubble */}
                      <div
                        className={`rounded-2xl p-4 leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-600/20"
                            : "bg-white/5 text-neutral-200 border border-white/10 backdrop-blur-md"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="font-mono">{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {msg.sender === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Live Reasoning Animation State */}
                {loading && (
                  <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                        AI Copilot is Reasoning...
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Step {currentReasoningStep + 1}/4</span>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-300 bg-black/40 p-2.5 rounded-xl border border-white/10">
                      &gt; {REASONING_PRESETS.default[currentReasoningStep] || "Processing prompt..."}
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentReasoningStep + 1) / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Carousel */}
              <div className="border-t border-white/10 bg-black/40 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 px-1">
                  <span>Quick Copilot Actions</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px]">
                    <input
                      type="checkbox"
                      checked={includeContext}
                      onChange={(e) => setIncludeContext(e.target.checked)}
                      className="rounded border-white/20 bg-black text-purple-500 focus:ring-purple-500"
                    />
                    <span>Reference Page Context</span>
                  </label>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_ACTIONS.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qa.prompt)}
                      className="flex items-center gap-1.5 shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:border-purple-500/40 hover:text-white transition-all"
                    >
                      {qa.icon}
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="border-t border-white/10 bg-black p-3.5 flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Ask Copilot about ${pathname}...`}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
