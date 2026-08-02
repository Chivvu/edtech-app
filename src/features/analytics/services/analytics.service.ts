import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export interface AnalyticsReport {
  weeklyUploads: { week: string; uploads: number }[];
  approvalRateTrend: { week: string; rate: number }[];
  courseHealthDistribution: { range: string; count: number }[];
  aiUsageMetrics: {
    totalAudits: number;
    totalEmbeddings: number;
    tokensProcessed: number;
    monthlyTrend: { month: string; audits: number }[];
  };
  instructorProductivity: {
    authorId: string;
    authorName: string;
    totalCreated: number;
    publishedCount: number;
    avgScore: number;
  }[];
  reviewerPerformance: {
    reviewerId: string;
    reviewerName: string;
    avgTurnaroundDays: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  }[];
}

export class AnalyticsService {
  static async getExecutiveAnalytics(
    timeRange: string = "30D",
    categoryId?: string,
    organizationId: string = "demo-org"
  ): Promise<AnalyticsReport> {
    const weeklyUploads = [
      { week: "W1", uploads: 14 },
      { week: "W2", uploads: 22 },
      { week: "W3", uploads: 19 },
      { week: "W4", uploads: 28 },
      { week: "W5", uploads: 35 },
    ];

    const approvalRateTrend = [
      { week: "W1", rate: 78.5 },
      { week: "W2", rate: 82.0 },
      { week: "W3", rate: 86.4 },
      { week: "W4", rate: 91.2 },
      { week: "W5", rate: 94.0 },
    ];

    const courseHealthDistribution = [
      { range: "90-100% (Exceptional)", count: 18 },
      { range: "75-89% (Good)", count: 24 },
      { range: "60-74% (Needs Revision)", count: 6 },
      { range: "< 60% (Critical)", count: 2 },
    ];

    const aiUsageMetrics = {
      totalAudits: 142,
      totalEmbeddings: 1840,
      tokensProcessed: 1250000,
      monthlyTrend: [
        { month: "Jan", audits: 18 },
        { month: "Feb", audits: 26 },
        { month: "Mar", audits: 32 },
        { month: "Apr", audits: 41 },
        { month: "May", audits: 58 },
      ],
    };

    const instructorProductivity = [
      { authorId: "u-1", authorName: "Sarah Jenkins", totalCreated: 12, publishedCount: 10, avgScore: 94.2 },
      { authorId: "u-2", authorName: "David Chen", totalCreated: 9, publishedCount: 7, avgScore: 89.8 },
      { authorId: "u-3", authorName: "Amara Okezie", totalCreated: 8, publishedCount: 7, avgScore: 96.0 },
      { authorId: "u-4", authorName: "Marcus Vance", totalCreated: 6, publishedCount: 4, avgScore: 85.5 },
    ];

    const reviewerPerformance = [
      { reviewerId: "r-1", reviewerName: "Dr. Aris Thorne", avgTurnaroundDays: 1.8, pendingCount: 3, approvedCount: 24, rejectedCount: 2 },
      { reviewerId: "r-2", reviewerName: "Prof. Elena Rostova", avgTurnaroundDays: 2.1, pendingCount: 4, approvedCount: 19, rejectedCount: 1 },
      { reviewerId: "r-3", reviewerName: "Kaelen Voss", avgTurnaroundDays: 2.9, pendingCount: 5, approvedCount: 15, rejectedCount: 3 },
    ];

    return {
      weeklyUploads,
      approvalRateTrend,
      courseHealthDistribution,
      aiUsageMetrics,
      instructorProductivity,
      reviewerPerformance,
    };
  }
}
