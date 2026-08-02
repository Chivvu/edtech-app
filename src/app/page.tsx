"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  BarChart3,
  Search,
  CheckCircle2,
  GitBranch,
  Bot,
  Globe,
  Lock,
  Play,
  X,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

// --- Custom Social SVG Icons ---
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

// --- 3D Particle & Neural Canvas Background ---
function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 18), 70);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint gradient mesh
      const grad1 = ctx.createRadialGradient(mouseX, mouseY, 50, mouseX, mouseY, 450);
      grad1.addColorStop(0, "rgba(108, 99, 255, 0.12)");
      grad1.addColorStop(0.5, "rgba(124, 58, 237, 0.05)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-80" />;
}

// --- 3D Holographic AI Core Component ---
function HolographicAICore({ mousePos }: { mousePos: { x: number; y: number } }) {
  const rotateX = (mousePos.y - 0.5) * 20;
  const rotateY = (mousePos.x - 0.5) * 20;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[460px] aspect-square mx-auto">
      {/* Outer Rotating Glowing Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 shadow-[0_0_50px_rgba(0,229,255,0.15)]"
      />

      {/* Counter-rotating Inner Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 rounded-full border border-purple-500/40 shadow-[0_0_40px_rgba(124,58,237,0.2)]"
      />

      {/* 3D Glass Sphere Container */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
        className="relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-purple-900/20 to-black/80 backdrop-blur-2xl shadow-[0_25px_80px_rgba(108,99,255,0.35)] transition-transform duration-200 ease-out"
      >
        {/* Glowing Center Logo */}
        <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-purple-400/40 bg-black/80 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
          <img src="/logo.jpg" alt="EduFlow AI Hologram" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 pointer-events-none animate-pulse" />
        </div>

        {/* Orbiting Glass Data Nodes */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -left-6 flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-black/80 px-3 py-2 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/20 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Gemini 2.0 Flash</span>
        </motion.div>

        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-4 -right-6 flex items-center gap-2 rounded-xl border border-purple-500/40 bg-black/80 px-3 py-2 text-xs font-semibold text-purple-300 shadow-lg shadow-purple-500/20 backdrop-blur-md"
        >
          <Cpu className="h-3.5 w-3.5 text-purple-400" />
          <span>GPT-4o Engine</span>
        </motion.div>

        <motion.div
          animate={{ x: [-6, 6, -6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 -left-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-black/80 px-3 py-2 text-xs font-semibold text-emerald-300 shadow-lg shadow-emerald-500/20 backdrop-blur-md"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Quality Score 98%</span>
        </motion.div>

        <motion.div
          animate={{ x: [6, -6, 6] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-4 flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-black/80 px-3 py-2 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/20 backdrop-blur-md"
        >
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>pgvector Index</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- Main 3D Enterprise Landing Page ---
export default function EnterpriseLandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeCopilotPrompt, setActiveCopilotPrompt] = useState(0);
  const [copied, setCopied] = useState(false);

  const copilotPrompts = [
    {
      prompt: "Generate quiz questions for React 19 Server Components",
      response: `🎯 **Generated Quiz (Bloom's Taxonomy Level: Apply)**\n\nQ1: What is the primary difference between a React Server Component and a Client Component?\nA) Server components render on the server and send zero JavaScript bundle to the browser.\nB) Server components can use useState and useEffect.\nC) Server components run only in local development.\n\nAnswer: **A** (Reduces client JS bundle size by up to 60%).`,
    },
    {
      prompt: "Check for duplicate lessons in Module 2: System Design",
      response: `🔍 **Duplicate Scan Completed (pgvector Cosine Similarity)**\n\nFound 1 High Similarity Duplicate:\n• **Lesson 2.1**: "Distributed Caching Strategies" (98.4% match with Lesson 4.2)\n\n💡 **Suggested Action**: Merge Lesson 2.1 into Module 4 as a shared prerequisite.`,
    },
    {
      prompt: "Perform WCAG 2.1 AA Accessibility Audit on Module 1",
      response: `🛡️ **Accessibility Audit Report (WCAG 2.1 AA)**\n\nScore: **96/100**\n• ✅ Contrast Ratio: Pass (7.5:1 on headers)\n• ✅ Alt Text: 100% covered across diagram figures\n• ⚠ Recommendation: Add keyboard aria-labels to interactive code tabs in Lesson 1.3.`,
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("git clone https://github.com/Chivvu/edtech-app.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#07090D] text-foreground font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-cyan-300">
      {/* 3D Particle Background */}
      <BackgroundCanvas />

      {/* Ambient Aurora Glow Lights */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-t from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] z-0" />

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090D]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-purple-500/40 bg-black/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
              EduFlow <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <a href="#copilot" className="hover:text-foreground transition-colors">AI Copilot</a>
            <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
              Open Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.2)]"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next-Gen Enterprise AI Operating System</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              The Operating System for{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Educational Intelligence
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed"
            >
              AI-powered course intelligence, semantic duplicate detection, curriculum analytics, quality governance, and enterprise approval workflows — all in one modern platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-600/40 hover:shadow-[0_0_35px_rgba(108,99,255,0.6)] hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <span>Start Free Workspace</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                <Play className="mr-2 h-4 w-4 fill-white text-white" />
                <span>Watch Product Demo</span>
              </button>
            </motion.div>

            {/* Micro Trust Stats */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl font-bold text-white">98.4%</div>
                <div className="text-[11px] text-neutral-400">Duplicate Match Acc.</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">3.8x</div>
                <div className="text-[11px] text-neutral-400">Faster Course Audits</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-[11px] text-neutral-400">WCAG 2.1 AA Compliant</div>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive AI Core Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HolographicAICore mousePos={mousePos} />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="relative z-10 py-12 border-y border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
            Empowering Modern EdTech & Enterprise Universities
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75">
            {["MIT EdLab", "Stanford Online", "Coursera Enterprise", "Pluralsight", "Udemy Academy", "Harvard Extension"].map((name, i) => (
              <div
                key={i}
                className="group relative cursor-pointer px-4 py-2 rounded-xl border border-transparent hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300"
              >
                <span className="text-sm font-extrabold tracking-wider text-neutral-400 group-hover:text-cyan-300 transition-colors">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 FEATURE CUBES GRID */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Enterprise Capabilities</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Unmatched Quality & Scale
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base">
            Replace fragmented spreadsheets and manual reviews with an automated, AI-first curriculum architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
              title: "AI Course Review",
              desc: "Automated Bloom's Taxonomy evaluation, WCAG 2.1 AA accessibility checks, and pedagogical readability scoring.",
              color: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
            },
            {
              icon: <Layers className="h-6 w-6 text-purple-400" />,
              title: "Semantic Duplicate Detection",
              desc: "High-precision pgvector cosine similarity scans that prevent redundant modules across your catalog.",
              color: "from-purple-500/20 to-indigo-600/20 border-purple-500/30",
            },
            {
              icon: <GitBranch className="h-6 w-6 text-indigo-400" />,
              title: "Curriculum Intelligence",
              desc: "Graph-based dependency analysis that maps skill progression and identifies prerequisite gaps.",
              color: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
            },
            {
              icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
              title: "Executive Analytics",
              desc: "Real-time metrics, reviewer velocity dashboards, author output statistics, and quality score heatmaps.",
              color: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
            },
            {
              icon: <CheckCircle2 className="h-6 w-6 text-blue-400" />,
              title: "Approval Workflow Stepper",
              desc: "Multi-tier sign-off pipeline (Draft ➔ ID Audit ➔ Peer Review ➔ Admin Sign-off) with automated triggers.",
              color: "from-blue-500/20 to-cyan-600/20 border-blue-500/30",
            },
            {
              icon: <Bot className="h-6 w-6 text-amber-400" />,
              title: "Multi-Model AI Copilot",
              desc: "Google Gemini 2.0 Flash & OpenAI GPT-4o powered chat drawer for instant lesson and quiz generation.",
              color: "from-amber-500/20 to-orange-600/20 border-amber-500/30",
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-rose-400" />,
              title: "Enterprise Governance",
              desc: "Granular Role-Based Access Control (RBAC), tenant isolation, Sentry error telemetry, and OWASP headers.",
              color: "from-rose-500/20 to-pink-600/20 border-rose-500/30",
            },
            {
              icon: <Globe className="h-6 w-6 text-teal-400" />,
              title: "Multi-Tenant Workspaces",
              desc: "Secure multi-organization data segregation with custom domain support and audit trails.",
              color: "from-teal-500/20 to-emerald-600/20 border-teal-500/30",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`group relative flex flex-col justify-between rounded-2xl border ${item.color} bg-gradient-to-br p-6 backdrop-blur-xl shadow-xl transition-all hover:shadow-[0_15px_40px_rgba(108,99,255,0.2)]`}
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/60 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore capability</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D WORKFLOW TIMELINE */}
      <section id="workflow" className="relative z-10 py-24 border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">Streamlined Architecture</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              From Draft to Published Course in 5 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", name: "Author Upload", desc: "Upload syllabus, video, or markdown" },
              { step: "02", name: "AI Quality Audit", desc: "Bloom's Taxonomy & WCAG scoring" },
              { step: "03", name: "Duplicate Scan", desc: "pgvector similarity matching" },
              { step: "04", name: "Peer Review", desc: "Collaborative inline comment threads" },
              { step: "05", name: "Admin Sign-off", desc: "One-click production publishing" },
            ].map((node, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md hover:border-purple-500/40 transition-all">
                <span className="text-2xl font-black text-purple-500/40 mb-2 font-mono">{node.step}</span>
                <h4 className="text-sm font-bold text-white mb-1">{node.name}</h4>
                <p className="text-xs text-neutral-400">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI COPILOT LIVE TERMINAL DEMO */}
      <section id="copilot" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
              <Bot className="h-3.5 w-3.5" />
              <span>Multi-Model AI Intelligence</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your Personal AI Curriculum Copilot
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Ask Gemini 2.0 Flash or OpenAI GPT-4o to analyze course structure, resolve duplicate lessons, or generate Bloom's Taxonomy assessments in seconds.
            </p>

            <div className="space-y-2 pt-2">
              {copilotPrompts.map((cp, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCopilotPrompt(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                    activeCopilotPrompt === idx
                      ? "border-purple-500/60 bg-purple-500/15 text-white font-semibold shadow-lg shadow-purple-500/10"
                      : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  💬 "{cp.prompt}"
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/15 bg-black/90 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/80">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[11px] text-neutral-400 font-sans font-medium">
                    EduFlow Copilot Terminal — Gemini 2.0 & GPT-4o
                  </span>
                </div>
                <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                </span>
              </div>

              {/* Terminal Output Body */}
              <div className="p-5 space-y-4 min-h-[300px] text-neutral-300 leading-relaxed font-sans">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
                  <span>&gt; Prompt:</span>
                  <span className="text-white font-semibold">"{copilotPrompts[activeCopilotPrompt].prompt}"</span>
                </div>
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 whitespace-pre-wrap">
                  {copilotPrompts[activeCopilotPrompt].response}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE ANALYTICS SECTION */}
      <section id="analytics" className="relative z-10 py-24 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Executive Overview</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Holographic Curriculum Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Catalog Health Index</span>
              <div className="text-4xl font-extrabold text-emerald-400">96.8 / 100</div>
              <p className="text-xs text-neutral-400">Calculated across Bloom's coverage, clarity, and WCAG accessibility metrics.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Duplicate Scan Coverage</span>
              <div className="text-4xl font-extrabold text-cyan-400">100% Catalog</div>
              <p className="text-xs text-neutral-400">1538-dimensional pgvector cosine vector index scans active.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Avg Approval Cycle</span>
              <div className="text-4xl font-extrabold text-purple-400">1.4 Days</div>
              <p className="text-xs text-neutral-400">Accelerated from traditional 6.2 days with automated AI audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#07090D] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-purple-500/40 bg-black/80">
              <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-bold text-white">EduFlow AI</span>
            <span className="text-xs text-neutral-500">© 2026 EduFlow AI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>Designed with ❤️ by <strong className="text-white">Shivam Kumar</strong></span>
            <a
              href="https://github.com/Chivvu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/10 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>@Chivvu</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shivam-kumar-006393315"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              <span>Shivam Kumar</span>
            </a>
          </div>
        </div>
      </footer>

      {/* PRODUCT DEMO MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDemoModalOpen(false)} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/20 bg-black p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                EduFlow AI Platform Architecture & Live Features Demo
              </h3>
              <button onClick={() => setDemoModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl border border-white/10 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/40 bg-black/80 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <img src="/logo.jpg" alt="EduFlow AI" className="h-full w-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-white">EduFlow AI Interactive Demo Active</h4>
              <p className="text-xs text-neutral-400 max-w-md">
                Click below to launch the live workspace directly with interactive course audits, duplicate detection, and Gemini 2.0 AI assistant!
              </p>
              <Link
                href="/dashboard"
                onClick={() => setDemoModalOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white text-xs shadow-lg shadow-indigo-600/30"
              >
                Launch Workspace Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
