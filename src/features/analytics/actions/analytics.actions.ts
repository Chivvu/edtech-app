"use server";

import { auth } from "@/lib/auth";
import { AnalyticsService } from "../services/analytics.service";

export async function getAnalyticsDataAction(timeRange: string = "30D", categoryId?: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const data = await AnalyticsService.getExecutiveAnalytics(timeRange, categoryId, session.user.organizationId);
  return { success: true, data };
}
