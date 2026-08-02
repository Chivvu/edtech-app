"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { analyzeCurriculumAction } from "@/features/curriculum-analyzer/actions/analyzer.actions";
import { CurriculumAnalysisResult } from "@/features/curriculum-analyzer/validations/analyzer.schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Network, Sparkles, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, GitCommit, BookOpen, Lightbulb, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CurriculumAnalyzerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseId = params.id as string;

  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<CurriculumAnalysisResult | null>(null);

  const handleRunAnalysis = () => {
    startTransition(async () => {
      const res = await analyzeCurriculumAction(courseId);
      if (res.success && res.data) {
        setAnalysis(res.data);
        toast({
          type: "success",
          title: "Curriculum Analysis Complete",
          description: `Curriculum Health Score: ${res.data.curriculumHealthScore}%`,
        });
      } else {
        toast({ type: "error", title: "Analysis Failed", description: res.error || "Failed to analyze curriculum." });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Course Details", href: `/courses/${courseId}` },
          { label: "AI Curriculum Flow Analyzer" },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              AI Curriculum Flow & Gap Analyzer
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <Network className="h-3.5 w-3.5" /> Dependency Graph Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze learning flow, prerequisite dependencies, missing industry topics, and weak module density.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
            Back to Course
          </Button>
          <Button variant="glow" isLoading={isPending} leftIcon={<RefreshCw className="h-4 w-4" />} onClick={handleRunAnalysis}>
            {analysis ? "Re-Analyze Curriculum" : "Run Curriculum Analysis"}
          </Button>
        </div>
      </div>

      {!analysis ? (
        /* Empty / Run Analysis Prompt */
        <Card className="p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Network className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-foreground">Analyze Structural Curriculum Integrity</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Construct visual node graph dependencies, evaluate prerequisite progression, and detect missing technical topics.
            </p>
          </div>
          <Button variant="glow" size="lg" isLoading={isPending} leftIcon={<Network className="h-5 w-5" />} onClick={handleRunAnalysis}>
            Execute Curriculum Analysis
          </Button>
        </Card>
      ) : (
        /* Analysis Results View */
        <div className="space-y-6">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border-blue-500/30 bg-blue-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Curriculum Health Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-blue-400">{Math.round(analysis.curriculumHealthScore)}%</span>
                <span className="text-xs text-emerald-400 font-semibold">High Integrity</span>
              </div>
            </Card>

            <Card className="p-5 border-emerald-500/20 bg-emerald-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Learning Flow Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-emerald-400">{Math.round(analysis.learningFlowScore)}%</span>
              </div>
            </Card>

            <Card className="p-5 border-purple-500/20 bg-purple-500/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Difficulty Progression
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-purple-400">{Math.round(analysis.difficultyProgressionScore)}%</span>
              </div>
            </Card>
          </div>

          {/* Visual Curriculum Dependency Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="h-4 w-4 text-indigo-400" />
                <span>Visual Learning Dependency Node Graph</span>
              </CardTitle>
              <CardDescription>Prerequisites, module progression, and directional learning flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-muted/20 rounded-xl border border-border/60 min-h-[160px]">
                {analysis.graphNodes.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <div
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                        node.type === "prerequisite"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 shadow-md"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        {node.type}
                      </span>
                      <span className="text-xs font-bold mt-0.5 text-foreground">{node.label}</span>
                      <span className="mt-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-background/50 border border-border">
                        {node.difficulty}
                      </span>
                    </div>

                    {i < analysis.graphNodes.length - 1 && (
                      <div className="flex items-center text-muted-foreground">
                        <ArrowRight className="h-5 w-5 text-indigo-400 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missing Topics & Weak Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>Missing Industry Standard Topics</span>
                </CardTitle>
                <CardDescription>Technical topics recommended to incorporate for full coverage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {analysis.missingTopics.map((top, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                    <span className="font-bold text-amber-400">•</span>
                    <span>{top}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-purple-400">
                  <BookOpen className="h-4 w-4" />
                  <span>Modules Requiring Depth Enhancement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.weakModules.map((wm, i) => (
                  <div key={i} className="space-y-1 bg-purple-500/5 p-3 rounded-lg border border-purple-500/20 text-xs">
                    <h5 className="font-bold text-purple-300">{wm.moduleTitle}</h5>
                    <p className="text-muted-foreground">{wm.reason}</p>
                    <p className="font-semibold text-foreground mt-1">Recommendation: {wm.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Card */}
          <Card className="border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-indigo-400">
                <Lightbulb className="h-4 w-4" />
                <span>Actionable AI Curriculum Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-foreground bg-indigo-500/5 p-3.5 rounded-xl border border-indigo-500/20">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-400 shrink-0 text-[10px]">
                    {i + 1}
                  </div>
                  <span>{rec}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
