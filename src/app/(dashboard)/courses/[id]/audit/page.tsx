"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { runCourseAuditAction } from "@/features/audit/actions/audit.actions";
import { AIAuditResult } from "@/features/audit/validations/audit.schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BloomsBarChart } from "@/components/ui/charts";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Shield, BookOpen, User, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CourseAuditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseId = params.id as string;

  const [isPending, startTransition] = useTransition();
  const [auditResult, setAuditResult] = useState<AIAuditResult | null>(null);

  const handleRunAudit = () => {
    startTransition(async () => {
      const res = await runCourseAuditAction(courseId);
      if (res.success && res.data) {
        setAuditResult(res.data);
        toast({
          type: "success",
          title: "AI Quality Audit Complete",
          description: `Health Score: ${res.data.healthScore}%`,
        });
      } else {
        toast({ type: "error", title: "Audit Failed", description: res.error || "Failed to generate report." });
      }
    });
  };

  const bloomsArray = auditResult
    ? Object.entries(auditResult.bloomsCoverage).map(([key, val]) => ({
        level: key.charAt(0).toUpperCase() + key.slice(1),
        value: val,
      }))
    : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Course Details", href: `/courses/${courseId}` },
          { label: "AI Quality Audit Report" },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Automated Course Intelligence Audit
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
              <Sparkles className="h-3.5 w-3.5" /> GPT-4o Audit Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time pedagogical review, Bloom's Taxonomy cognitive indexing, and clarity scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
            Back to Course
          </Button>
          <Button variant="glow" isLoading={isPending} leftIcon={<RefreshCw className="h-4 w-4" />} onClick={handleRunAudit}>
            {auditResult ? "Re-Run AI Audit" : "Run AI Quality Audit"}
          </Button>
        </div>
      </div>

      {!auditResult ? (
        /* Empty / Run Audit Prompt */
        <Card className="p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-foreground">Ready to Audit Curriculum Quality</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Analyze pedagogical rigor, detect cognitive coverage gaps across Bloom's Taxonomy levels, and generate WCAG accessibility metrics.
            </p>
          </div>
          <Button variant="glow" size="lg" isLoading={isPending} leftIcon={<Sparkles className="h-5 w-5" />} onClick={handleRunAudit}>
            Initiate AI Quality Audit
          </Button>
        </Card>
      ) : (
        /* Audit Report View */
        <div className="space-y-6">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-5 border-indigo-500/30 bg-indigo-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overall Quality Health Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-indigo-400">{auditResult.healthScore}%</span>
                <span className="text-xs text-emerald-400 font-semibold">Passed Standard</span>
              </div>
            </Card>

            <Card className="p-5 border-emerald-500/20 bg-emerald-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Industry Alignment
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-emerald-400">{auditResult.industryRelevanceScore}%</span>
              </div>
            </Card>

            <Card className="p-5 border-purple-500/20 bg-purple-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Readability & Clarity
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-purple-400">{auditResult.readabilityScore}%</span>
              </div>
            </Card>

            <Card className="p-5 border-blue-500/20 bg-blue-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                WCAG Accessibility
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-blue-400">{auditResult.accessibilityScore}%</span>
              </div>
            </Card>
          </div>

          {/* AI Executive Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>AI Executive Pedagogical Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/60">
                {auditResult.summary}
              </p>
            </CardContent>
          </Card>

          {/* Bloom's Taxonomy Cognitive Coverage & Objectives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bloom's Taxonomy Cognitive Coverage</CardTitle>
                <CardDescription>Distribution of cognitive complexity levels across curriculum</CardDescription>
              </CardHeader>
              <CardContent>
                <BloomsBarChart data={bloomsArray} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  <span>Extracted Learning Objectives</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditResult.learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-foreground bg-muted/20 p-3 rounded-lg border border-border/40">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Curriculum Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {auditResult.strengths.map((str, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>{str}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Quality & Rigor Gaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {auditResult.weaknesses.map((wk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                    <span className="font-bold text-amber-400">•</span>
                    <span>{wk}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Actionable AI Suggestions Card */}
          <Card className="border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-purple-400">
                <Lightbulb className="h-4 w-4" />
                <span>Actionable AI Quality Improvement Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditResult.suggestions.map((sug, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-foreground bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/20">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 font-bold text-purple-400 shrink-0 text-[10px]">
                    {i + 1}
                  </div>
                  <span>{sug}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
