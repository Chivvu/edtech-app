"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { AIReviewService } from "../services/ai-review.service";

export async function runCourseAuditAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const audit = await AIReviewService.auditCourseContent(courseId);

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/audit`);
  revalidatePath("/dashboard");

  return { success: true, data: audit };
}
