"use client";

import React, { useState, useEffect, useTransition } from "react";
import { getAnalyticsDataAction, generateExecutiveReportAction } from "@/features/analytics/actions/analytics.actions";
import { AnalyticsReport } from "@/features/analytics/services/analytics.service";
import { GeminiExecutiveReport } from "@/lib/ai/gemini";
import { AnalyticsFilterBar } from "@/features/analytics/components/analytics-filter-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SkeletonChart, SkeletonTable } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp, Sparkles, Award, Users, ShieldCheck, FileSpreadsheet, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [timeRange, setTimeRange] = useState("30D");
  const [report, setReport] = useState<AnalyticsReport | null>(null);

  // Gemini AI Executive Report State
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState(false);
  const [execReport, setExecReport] = useState<GeminiExecutiveReport | null>(null);

  const fetchAnalytics = () => {
    startTransition(async () => {
      const res = await getAnalyticsDataAction(timeRange);
      if (res.success && res.data) {
        setReport(res.data);
      }
    });
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleGenerateGeminiReport = async () => {
    setIsGeneratingAIReport(true);
    toast({ type: "info", title: "Gemini 2.5 Flash Analyzing", description: "Evaluating platform velocity, quality metrics, and SME efficiency..." });

    try {
      const res = await generateExecutiveReportAction(timeRange);
      if (res.success && res.data) {
        setExecReport(res.data);
        toast({ type: "success", title: "Executive Report Generated", description: "Google Gemini AI analysis ready." });
      } else {
        toast({ type: "error", title: "Report Error", description: res.error || "Failed to generate report." });
      }
    } catch {
      toast({ type: "error", title: "Gemini API Error", description: "Could not communicate with Gemini API." });
    } finally {
      setIsGeneratingAIReport(false);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Instructor Name,Total Created,Published Count,Avg Score"]
        .concat(
          report.instructorProductivity.map(
            (i) => `"${i.authorName}",${i.totalCreated},${i.publishedCount},${i.avgScore}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eduflow_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ type: "success", title: "CSV Downloaded", description: "Exported instructor productivity metrics." });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Executive Analytics & Quality Intelligence
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-3.5 w-3.5" /> Platform Intelligence
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Curriculum volume velocity, SME reviewer turnaround efficiency, AI usage, and quality score distribution.
          </p>
        </div>

        <Button
          disabled={isGeneratingAIReport}
          onClick={handleGenerateGeminiReport}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:from-purple-500 hover:to-indigo-500"
        >
          {isGeneratingAIReport ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Generating AI Report...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" /> Gemini Executive Report
            </>
          )}
        </Button>
      </div>

      {/* Gemini AI Executive Intelligence Card */}
      {execReport && (
        <Card className="border-purple-500/30 bg-purple-500/5 shadow-2xl space-y-4 p-6 rounded-2xl">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-foreground">Google Gemini 2.5 Flash Executive Intelligence Summary</h3>
            </div>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-mono text-purple-300 border border-purple-500/30">
              Grounded AI Analysis ({timeRange})
            </span>
          </div>

          <p className="text-xs text-foreground leading-relaxed font-medium">
            {execReport.executiveSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Upload Velocity</span>
              <p className="text-xs text-indigo-300">{execReport.uploadVelocityAnalysis}</p>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Quality Approval Trend</span>
              <p className="text-xs text-emerald-300">{execReport.qualityTrendInsight}</p>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-black/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">AI Efficiency Savings</span>
              <p className="text-xs text-cyan-300">{execReport.aiEfficiencyImpact}</p>
            </div>
          </div>

          {execReport.recommendations?.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">Strategic Recommendations</span>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {execReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Filter Bar */}
      <AnalyticsFilterBar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onExportCSV={handleExportCSV}
      />

      {isPending || !report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable rows={5} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Primary Charts Grid (Weekly Uploads & Approval Rate) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Uploads Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <span>Weekly Course Content Upload Velocity</span>
                </CardTitle>
                <CardDescription>New modules and lesson content published per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.weeklyUploads}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.12)" />
                      <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                          borderRadius: "8px",
                          color: "#f4f4f5",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="uploads" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Approval Rate Trend Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>First-Pass Quality Approval Rate (%)</span>
                </CardTitle>
                <CardDescription>Percentage of courses passing quality audit on first review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={report.approvalRateTrend}>
                      <defs>
                        <linearGradient id="apprGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.12)" />
                      <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={[50, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                          borderRadius: "8px",
                          color: "#f4f4f5",
                          fontSize: "12px",
                        }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#apprGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Usage & Course Health Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Engine Usage Cards */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>AI Engine Usage Metrics</span>
                </CardTitle>
                <CardDescription>Gemini 2.5 Flash executions & pgvector embedding queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <span className="text-xs text-muted-foreground">Total Automated Audits</span>
                  <span className="text-xl font-extrabold text-purple-400">{report.aiUsageMetrics.totalAudits}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
                  <span className="text-xs text-muted-foreground">Vector Embeddings Computed</span>
                  <span className="text-xl font-extrabold text-indigo-400">{report.aiUsageMetrics.totalEmbeddings}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <span className="text-xs text-muted-foreground">Tokens Processed</span>
                  <span className="text-xl font-extrabold text-blue-400">1.85M</span>
                </div>
              </CardContent>
            </Card>

            {/* Course Health Index Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4 text-indigo-400" />
                  <span>Course Quality Score Distribution</span>
                </CardTitle>
                <CardDescription>Pedagogical health score breakdown across total catalog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.courseHealthDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{item.range}</span>
                      <span className="font-bold text-indigo-400">{item.count} Courses</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${(item.count / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Instructor Productivity & Reviewer Performance Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructor Productivity Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span>Instructor Productivity</span>
                </CardTitle>
                <Button size="sm" variant="ghost" leftIcon={<FileSpreadsheet className="h-3.5 w-3.5" />} onClick={handleExportCSV}>
                  CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Avg Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.instructorProductivity.map((ins) => (
                      <TableRow key={ins.authorId}>
                        <TableCell className="font-semibold text-foreground">{ins.authorName}</TableCell>
                        <TableCell className="text-muted-foreground">{ins.totalCreated}</TableCell>
                        <TableCell className="text-emerald-400 font-semibold">{ins.publishedCount}</TableCell>
                        <TableCell className="text-right font-bold text-indigo-400">{ins.avgScore}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Reviewer Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>SME Reviewer Turnaround & Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer Name</TableHead>
                      <TableHead>Turnaround</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead className="text-right">Approved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.reviewerPerformance.map((rev) => (
                      <TableRow key={rev.reviewerId}>
                        <TableCell className="font-semibold text-foreground">{rev.reviewerName}</TableCell>
                        <TableCell className="text-purple-400 font-semibold">{rev.avgTurnaroundDays} days</TableCell>
                        <TableCell className="text-amber-400 font-semibold">{rev.pendingCount}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-400">{rev.approvedCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
