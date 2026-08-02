"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  CourseFormSchema,
  CourseFormInput,
  CourseFilterSchema,
  CourseFilterInput,
  BulkCourseActionSchema,
  BulkCourseActionInput,
} from "../validations/course.schema";
import { CourseService } from "../services/course.service";

export async function getCoursesAction(filter: CourseFilterInput) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = CourseFilterSchema.safeParse(filter);
  if (!validated.success) {
    return { success: false, error: "Invalid filter parameters." };
  }

  const result = await CourseService.getCourses(session.user.organizationId, validated.data);
  return { success: true, data: result };
}

export async function createCourseAction(data: CourseFormInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = CourseFormSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: "Validation failed.",
      validationErrors: validated.error.flatten().fieldErrors,
    };
  }

  const course = await CourseService.createCourse(
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath("/courses");
  revalidatePath("/dashboard");
  return { success: true, data: course };
}

export async function updateCourseAction(id: string, data: Partial<CourseFormInput>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const updated = await CourseService.updateCourse(
    id,
    data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${id}`);
  revalidatePath("/courses");
  return { success: true, data: updated };
}

export async function softDeleteCourseAction(id: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  await CourseService.softDeleteCourse(id, session.user.id, session.user.organizationId);

  revalidatePath("/courses");
  return { success: true, message: "Course moved to soft delete trash." };
}

export async function restoreCourseAction(id: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  await CourseService.restoreCourse(id, session.user.id, session.user.organizationId);

  revalidatePath("/courses");
  return { success: true, message: "Course restored successfully." };
}

export async function bulkCourseAction(input: BulkCourseActionInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = BulkCourseActionSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid bulk action parameters." };
  }

  const result = await CourseService.bulkExecuteCourseActions(
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath("/courses");
  return { success: true, data: result };
}

export async function createCourseVersionAction(courseId: string, changelog?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const version = await CourseService.createVersionSnapshot(courseId, session.user.id, changelog);

  revalidatePath(`/courses/${courseId}`);
  return { success: true, data: version };
}
