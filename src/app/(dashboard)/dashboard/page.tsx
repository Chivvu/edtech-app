import React from "react";
import { auth } from "@/lib/auth";
import { DashboardService } from "@/features/analytics/services/dashboard.service";
import { MetricCards } from "@/features/analytics/components/metric-cards";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { ReviewerWorkloadWidget } from "@/features/analytics/components/reviewer-workload-widget";
import { InstructorProductivityWidget } from "@/features/analytics/components/instructor-productivity-widget";
import { RecentActivityWidget } from "@/features/analytics/components/recent-activity-widget";
import { Sparkles, Calendar } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const organizationId = session?.user?.organizationId || "demo-org-id";

  const metrics = await DashboardService.getMetrics(organizationId);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Internal Course Intelligence
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3 w-3" /> Live Audit Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time quality scorecards, SME reviewer workload, and automated curriculum gap analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg shrink-0">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>Last Updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {/* 1. Metric Cards Grid (Total Courses, Pending Reviews, Published Courses, Avg Health Score, AI Reports) */}
      <MetricCards
        totalCourses={metrics.totalCourses}
        pendingReviews={metrics.pendingReviews}
        publishedCourses={metrics.publishedCourses}
        avgHealthScore={metrics.avgHealthScore}
        aiReportsCount={metrics.aiReportsCount}
      />

      {/* 2. Primary Charts (Monthly Uploads, Approval Rate, Review Turnaround) */}
      <DashboardCharts
        monthlyUploads={metrics.monthlyUploads}
        approvalRateTrend={metrics.approvalRateTrend}
        reviewTimeTurnaround={metrics.reviewTimeTurnaround}
      />

      {/* 3. Deep Widgets Grid (Reviewer Workload, Instructor Productivity, Activity Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReviewerWorkloadWidget reviewers={metrics.reviewerWorkload} />
        <InstructorProductivityWidget instructors={metrics.instructorProductivity} />
        <RecentActivityWidget activities={metrics.recentActivity} />
      </div>
    </div>
  );
}
