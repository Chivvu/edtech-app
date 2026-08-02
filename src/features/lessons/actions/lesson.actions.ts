"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { LessonFormSchema, LessonFormInput, ResourceFormSchema, ResourceFormInput } from "../validations/lesson.schema";
import { LessonService } from "../services/lesson.service";

export async function getLessonAction(id: string) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const lesson = await LessonService.getLessonById(id);
  return { success: true, data: lesson };
}

export async function createLessonAction(moduleId: string, courseId: string, data: LessonFormInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = LessonFormSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Validation failed.", validationErrors: validated.error.flatten().fieldErrors };
  }

  const lesson = await LessonService.createLesson(
    moduleId,
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${courseId}`);
  return { success: true, data: lesson };
}

export async function updateLessonAction(id: string, courseId: string, data: Partial<LessonFormInput>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const updated = await LessonService.updateLesson(
    id,
    data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/lessons/${id}`);
  return { success: true, data: updated };
}

export async function addResourceAction(lessonId: string, courseId: string, data: ResourceFormInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = ResourceFormSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Validation failed." };
  }

  const resource = await LessonService.addResource(lessonId, validated.data);

  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath(`/courses/${courseId}`);
  return { success: true, data: resource };
}

export async function deleteLessonAction(id: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  await LessonService.softDeleteLesson(id, session.user.id, session.user.organizationId);

  revalidatePath(`/courses/${courseId}`);
  return { success: true, message: "Lesson moved to trash." };
}
