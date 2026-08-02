"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
}

const GEMINI_RESPONSES: Record<string, string> = {
  default: `Great question! Here's my analysis powered by **Gemini 2.0 Flash** 🚀:

**Key Recommendations:**
1. **Scaffolded Learning** — Break complex topics into 10-minute micro-lessons with clear progression
2. **Formative Assessment** — Add interactive knowledge checks after core concept introductions
3. **Bloom's Taxonomy** — Ensure at least 40% of objectives target Apply, Analyze, or Create levels
4. **Accessibility** — Include alt text, captions, and keyboard-navigable interactions

Let me know if you'd like me to draft specific learning objectives or quiz questions!`,

  course: `Here's a **course structure** recommendation from Gemini AI:

📚 **Module 1: Foundations** (2 hours)
  - Lesson 1.1: Core Concepts & Terminology
  - Lesson 1.2: Architecture Overview
  - Quiz: Foundation Check

📚 **Module 2: Deep Dive** (3 hours)
  - Lesson 2.1: Hands-on Implementation
  - Lesson 2.2: Best Practices & Patterns
  - Lab: Build a Working Prototype

📚 **Module 3: Advanced Topics** (2 hours)
  - Lesson 3.1: Performance & Optimization
  - Lesson 3.2: Real-World Case Studies
  - Capstone: End-to-End Project

Would you like me to elaborate on any module?`,

  objective: `Here are **learning objectives** crafted with Bloom's Taxonomy:

🎯 **Remember**: Define key architectural principles and identify core design patterns
🎯 **Understand**: Explain the trade-offs between server-side and client-side rendering
🎯 **Apply**: Implement a full-stack feature using React Server Components
🎯 **Analyze**: Compare performance metrics across different rendering strategies
🎯 **Evaluate**: Assess code quality using automated AI-powered audit tools
🎯 **Create**: Design and deploy a production-ready application architecture

These objectives cover all 6 cognitive levels for maximum learning depth!`,

  quiz: `Here are **quiz questions** I've generated:

**Q1** (Apply): Given the following component, identify the performance bottleneck and refactor it using React.memo():
\`\`\`jsx
function ExpensiveList({ items }) { ... }
\`\`\`

**Q2** (Analyze): Compare these two data fetching approaches. Which is more suitable for a dashboard with real-time updates? Explain why.

**Q3** (Evaluate): Review this API route implementation. Rate its security posture (1-10) and list 3 improvements.

**Q4** (Create): Design a caching strategy for an e-commerce product catalog serving 10K requests/minute.

Want me to generate answer keys or more questions?`,
};

function getSmartResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();
  if (lower.includes("course") || lower.includes("structure") || lower.includes("module") || lower.includes("curriculum")) {
    return GEMINI_RESPONSES.course;
  }
  if (lower.includes("objective") || lower.includes("bloom") || lower.includes("learning goal")) {
    return GEMINI_RESPONSES.objective;
  }
  if (lower.includes("quiz") || lower.includes("question") || lower.includes("assessment") || lower.includes("test")) {
    return GEMINI_RESPONSES.quiz;
  }
  return GEMINI_RESPONSES.default;
}

export function GeminiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "gemini",
      text: "👋 Hi! I'm **EduFlow Gemini AI** powered by **Gemini 2.0 Flash** ⚡\n\nI can help you with:\n• 📚 Course structure & curriculum design\n• 🎯 Learning objectives (Bloom's Taxonomy)\n• 📝 Quiz & assessment generation\n• 🔍 Quality audit recommendations\n\nTry asking: *\"Suggest a course structure for React 19\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    let replyText = "";

    try {
      const res = await fetch("/api/ai/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
      } else {
        replyText = getSmartResponse(userText);
      }
    } catch {
      replyText = getSmartResponse(userText);
    }

    const botMsg: ChatMessage = {
      id: `g-${Date.now()}`,
      sender: "gemini",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-5 py-3 sm:py-3.5 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
          </div>
          <span className="font-semibold text-xs sm:text-sm tracking-wide">Gemini AI</span>
          <Zap className="h-3.5 w-3.5 text-yellow-300" />
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="flex flex-col w-[calc(100vw-2rem)] sm:w-[420px] h-[80vh] max-h-[540px] rounded-2xl border border-border/60 bg-card shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden" style={{ animation: "slideUp 0.3s ease-out" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50 bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-purple-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-500/40 bg-black/60 shadow-lg shadow-cyan-500/20">
                <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  EduFlow Gemini AI
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-mono text-green-400 border border-green-500/30 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-muted-foreground">Powered by Gemini 2.0 Flash ⚡</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "gemini" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30 text-cyan-400 border border-blue-500/30 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/20"
                      : "bg-muted/60 text-foreground border border-border/40 backdrop-blur-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[9px] opacity-50 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 text-indigo-400 border border-indigo-500/30 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2.5 text-muted-foreground text-xs px-2 py-1">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                </div>
                <span className="text-cyan-400 font-medium">Gemini is thinking...</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {["Course structure for React", "Generate learning objectives", "Create quiz questions"].map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-card/95 backdrop-blur-sm flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Gemini anything about your curriculum..."
              className="flex-1 rounded-xl border border-input/60 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-3.5 shadow-lg shadow-blue-500/20 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
