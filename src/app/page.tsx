import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-50 p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-purple-500/40 bg-black/80 shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-transform duration-500 hover:scale-105">
            <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
          </div>
          <div className="inline-block rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 border border-blue-500/20 mt-1">
            Internal Course Intelligence Platform
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          EduFlow <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="text-neutral-400 text-lg">
          AI-powered pedagogical audits, semantic duplicate content detection, and multi-tier approval workflows for modern EdTech organizations.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-neutral-800 hover:bg-neutral-900 font-semibold text-neutral-300 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
