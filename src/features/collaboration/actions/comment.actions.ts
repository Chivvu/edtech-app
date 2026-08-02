"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { CreateCommentSchema, CreateCommentInput, ToggleResolveSchema, ToggleResolveInput } from "../validations/comment.schema";
import { CommentService } from "../services/comment.service";

export async function getCommentsAction(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const comments = await CommentService.getCommentsByReview(reviewId);
  return { success: true, data: comments };
}

export async function createCommentAction(input: CreateCommentInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = CreateCommentSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Validation failed." };
  }

  const comment = await CommentService.createComment(
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath("/courses");
  return { success: true, data: comment };
}

export async function toggleResolveAction(commentId: string, resolved: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const updated = await CommentService.toggleResolveComment(commentId, resolved);
  revalidatePath("/courses");
  return { success: true, data: updated };
}
