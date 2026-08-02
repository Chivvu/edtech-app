"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { TransitionStatusSchema, TransitionStatusInput, AddReviewCommentSchema, AddReviewCommentInput } from "../validations/approval.schema";
import { ApprovalService } from "../services/approval.service";

export async function transitionStatusAction(input: TransitionStatusInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = TransitionStatusSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid workflow transition parameters." };
  }

  const result = await ApprovalService.transitionCourseStatus(
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${input.courseId}`);
  revalidatePath(`/courses/${input.courseId}/review`);
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return { success: true, data: result };
}

export async function getTimelineAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const timeline = await ApprovalService.getWorkflowTimeline(courseId);
  return { success: true, data: timeline };
}

export async function addCommentAction(input: AddReviewCommentInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = AddReviewCommentSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Validation failed." };
  }

  const comment = await ApprovalService.addReviewComment(validated.data, session.user.id);
  return { success: true, data: comment };
}
