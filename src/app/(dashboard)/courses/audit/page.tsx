"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIQualityAuditHubPage() {
  const [courses] = useState([
    {
      id: "c-101",
      title: "Advanced React 19 & Next.js 16 Enterprise Architecture",
      qualityScore: 98.4,
      bloomsScore: 94.0,
      accessibilityScore: 96.0,
      readabilityScore: 92.0,
      status: "PUBLISHED",
      findingsCount: 2,
    },
    {
      id: "c-102",
      title: "System Design Essentials & Distributed AI Infrastructure",
      qualityScore: 94.8,
      bloomsScore: 90.0,
      accessibilityScore: 95.0,
      readabilityScore: 90.0,
      status: "REVIEW_PENDING",
      findingsCount: 4,
    },
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              AI Quality Audit Hub
            </h1>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs font-mono text-purple-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Gemini 2.0 & GPT-4o Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automated pedagogical scoring, Bloom's Taxonomy distribution, and WCAG 2.1 AA accessibility checks.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Select Course to Audit</span>
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Avg Catalog Score</span>
          <div className="text-3xl font-extrabold text-emerald-400">96.6 / 100</div>
          <p className="text-[11px] text-muted-foreground">+7.4% improvement this week</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Bloom's Alignment</span>
          <div className="text-3xl font-extrabold text-cyan-400">92.0%</div>
          <p className="text-[11px] text-muted-foreground">High cognitive level (Apply/Create)</p>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase">WCAG Accessibility</span>
          <div className="text-3xl font-extrabold text-purple-400">95.5%</div>
          <p className="text-[11px] text-muted-foreground">100% alt-text & contrast coverage</p>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Audited Courses</span>
          <div className="text-3xl font-extrabold text-blue-400">18 Courses</div>
          <p className="text-[11px] text-muted-foreground">0 critical defects</p>
        </div>
      </div>

      {/* Course Audit Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            Catalog Course Audit Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase">
              <tr>
                <th className="p-4">Course Title</th>
                <th className="p-4">Overall Score</th>
                <th className="p-4">Bloom's Taxonomy</th>
                <th className="p-4">Accessibility</th>
                <th className="p-4">Readability</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-bold text-foreground text-sm">
                    {c.title}
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                    {c.qualityScore}%
                  </td>
                  <td className="p-4 font-mono text-cyan-400 font-semibold">{c.bloomsScore}%</td>
                  <td className="p-4 font-mono text-purple-400 font-semibold">{c.accessibilityScore}%</td>
                  <td className="p-4 font-mono text-blue-400 font-semibold">{c.readabilityScore}%</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/courses/${c.id}/audit`}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 font-semibold text-xs hover:bg-primary/20"
                    >
                      <span>Full Audit Report</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
