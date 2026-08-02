import { z } from "zod";
import { CourseStatus } from "@prisma/client";

export const TransitionStatusSchema = z.object({
  courseId: z.string().uuid(),
  nextStatus: z.nativeEnum(CourseStatus),
  reviewerId: z.string().uuid().optional(),
  decision: z.string().optional(),
  feedback: z.string().optional(),
});

export const AddReviewCommentSchema = z.object({
  reviewId: z.string().uuid(),
  comment: z.string().min(2, "Comment must be at least 2 characters."),
  lessonId: z.string().uuid().optional(),
  lineNumber: z.number().int().optional(),
});

export type TransitionStatusInput = z.infer<typeof TransitionStatusSchema>;
export type AddReviewCommentInput = z.infer<typeof AddReviewCommentSchema>;
