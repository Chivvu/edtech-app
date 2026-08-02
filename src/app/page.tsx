import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-50 p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
          Internal Course Intelligence Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          EduFlow AI
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
