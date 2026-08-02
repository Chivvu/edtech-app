"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { DuplicateDetectionService } from "../services/duplicate-detection.service";

export async function scanDuplicatesAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const report = await DuplicateDetectionService.scanCourseDuplicates(courseId);

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/duplicates`);

  return { success: true, data: report };
}
