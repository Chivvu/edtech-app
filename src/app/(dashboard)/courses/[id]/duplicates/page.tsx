"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { scanDuplicatesAction } from "@/features/duplicate-detection/actions/duplicate.actions";
import { DuplicateReportResult } from "@/features/duplicate-detection/services/duplicate-detection.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Copy, AlertCircle, Sparkles, CheckCircle2, ArrowRight, RefreshCw, GitMerge, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CourseDuplicatesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseId = params.id as string;

  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState<DuplicateReportResult | null>(null);

  const handleScan = () => {
    startTransition(async () => {
      const res = await scanDuplicatesAction(courseId);
      if (res.success && res.data) {
        setReport(res.data);
        toast({
          type: "warning",
          title: "Duplicate Scan Completed",
          description: `Found ${res.data.totalMatchesFound} content matches across organization courses.`,
        });
      } else {
        toast({ type: "error", title: "Scan Failed", description: res.error || "Failed to scan duplicates." });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Course Details", href: `/courses/${courseId}` },
          { label: "AI Duplicate Content Detection" },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Semantic Duplicate Content Detection
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Copy className="h-3.5 w-3.5" /> Vector Similarity Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Detect overlapping modules, duplicate lesson text, and redundant curriculum assignments across institution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
            Back to Course
          </Button>
          <Button variant="glow" isLoading={isPending} leftIcon={<RefreshCw className="h-4 w-4" />} onClick={handleScan}>
            {report ? "Re-Scan Duplicates" : "Run Duplicate Scan"}
          </Button>
        </div>
      </div>

      {!report ? (
        /* Empty / Run Scan Prompt */
        <Card className="p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Copy className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-foreground">Scan Course for Curriculum Overlap</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Cross-reference lesson titles, video transcripts, and assignment instructions against all organization courses to prevent duplicate effort.
            </p>
          </div>
          <Button variant="glow" size="lg" isLoading={isPending} leftIcon={<Copy className="h-5 w-5" />} onClick={handleScan}>
            Execute Duplicate Analysis
          </Button>
        </Card>
      ) : (
        /* Duplicate Report Results View */
        <div className="space-y-6">
          {/* Similarity Overview Banner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border-amber-500/30 bg-amber-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Highest Similarity Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-amber-400">{Math.round(report.highestSimilarityPct)}%</span>
                <span className="text-xs text-amber-400 font-semibold">High Overlap</span>
              </div>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Overlapping Matches
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">{report.totalMatchesFound}</span>
                <span className="text-xs text-muted-foreground">Cross-Course Matches</span>
              </div>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Curriculum Recommendation
              </span>
              <div className="mt-2 flex items-center gap-2 text-xs font-bold text-indigo-400">
                <GitMerge className="h-4 w-4" />
                <span>Merge Duplicate Modules</span>
              </div>
            </Card>
          </div>

          {/* List of Duplicate Matches */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Detected Duplicate Lesson Pairs ({report.matches.length})</span>
            </h3>

            {report.matches.map((match) => (
              <Card key={match.id} className="p-6 space-y-4 border-amber-500/20">
                {/* Header Match Comparison Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Sparkles className="h-3 w-3" /> {Math.round(match.similarityPct)}% Similarity
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Source: {match.sourceLessonTitle}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Matches in <strong className="text-foreground">{match.targetCourseTitle}</strong>
                  </span>
                </div>

                {/* Side-by-side Lesson Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">This Course Lesson</span>
                    <h4 className="text-xs font-bold text-foreground">{match.sourceLessonTitle}</h4>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Target Organization Lesson</span>
                    <h4 className="text-xs font-bold text-foreground">{match.targetLessonTitle}</h4>
                    <p className="text-[11px] text-muted-foreground">From course: {match.targetCourseTitle}</p>
                  </div>
                </div>

                {/* Overlapping Text Excerpt Box */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Overlapping Content Excerpt
                  </span>
                  <div className="font-mono text-xs text-foreground bg-background p-3 rounded-lg border border-border/80">
                    "{match.matchedExcerpt}"
                  </div>
                </div>

                {/* Suggested Merge Plan */}
                <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
                  <div className="flex items-start gap-2.5 text-xs text-foreground">
                    <GitMerge className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-400">AI Suggested Merge Strategy: </strong>
                      <span>{match.suggestedMergePlan}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="glow" leftIcon={<GitMerge className="h-3.5 w-3.5" />}>
                    Consolidate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
