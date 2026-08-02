import { z } from "zod";

export const CreateCommentSchema = z.object({
  reviewId: z.string().uuid(),
  comment: z.string().min(1, "Comment text is required.").max(2000),
  parentId: z.string().uuid().optional().nullable(),
  lessonId: z.string().uuid().optional().nullable(),
  lineNumber: z.number().int().optional().nullable(),
  mentions: z.array(z.string().uuid()).default([]),
});

export const ToggleResolveSchema = z.object({
  commentId: z.string().uuid(),
  resolved: z.boolean(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type ToggleResolveInput = z.infer<typeof ToggleResolveSchema>;
