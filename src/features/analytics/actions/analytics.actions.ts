"use server";

import { auth } from "@/lib/auth";
import { generateExecutiveReportWithGemini } from "@/lib/ai/gemini";
import { AnalyticsService } from "../services/analytics.service";

export async function getAnalyticsDataAction(timeRange: string = "30D", categoryId?: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const data = await AnalyticsService.getExecutiveAnalytics(timeRange, categoryId, session.user.organizationId);
  return { success: true, data };
}

export async function generateExecutiveReportAction(timeRange: string = "30D") {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const stats = await AnalyticsService.getExecutiveAnalytics(timeRange, undefined, session.user.organizationId);
  const report = await generateExecutiveReportWithGemini(timeRange, stats);
  return { success: true, data: report };
}
