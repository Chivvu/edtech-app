"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { CurriculumAnalyzerService } from "../services/curriculum-analyzer.service";

export async function analyzeCurriculumAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const analysis = await CurriculumAnalyzerService.analyzeCourseCurriculum(courseId);

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/curriculum-analyzer`);

  return { success: true, data: analysis };
}
