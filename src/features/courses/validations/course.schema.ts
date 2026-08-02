import { z } from "zod";
import { CourseStatus } from "@prisma/client";

export const DifficultyLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;
export const Languages = ["ENGLISH", "SPANISH", "FRENCH", "GERMAN", "MANDARIN", "JAPANESE"] as const;
export const Visibilities = ["PUBLIC", "INTERNAL_ONLY", "RESTRICTED"] as const;

export const CourseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(120),
  description: z.string().default(""),
  targetAudience: z.string().default(""),
  categoryId: z.string().default(""),
  thumbnailUrl: z.string().default(""),
  difficulty: z.enum(DifficultyLevels).default("INTERMEDIATE"),
  language: z.enum(Languages).default("ENGLISH"),
  durationMinutes: z.coerce.number().int().min(0, "Duration cannot be negative.").default(0),
  objectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  visibility: z.enum(Visibilities).default("INTERNAL_ONLY"),
  scheduledPublishAt: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
  tagIds: z.array(z.string()).default([]),
});

export const UpdateCourseSchema = CourseFormSchema.partial().extend({
  id: z.string().uuid(),
});

export const CourseFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(CourseStatus).optional(),
  categoryId: z.string().optional(),
  difficulty: z.enum(DifficultyLevels).optional(),
  language: z.enum(Languages).optional(),
  tagId: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "overallScore"]).default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  showDeleted: z.coerce.boolean().default(false),
});

export const BulkCourseActionSchema = z.object({
  courseIds: z.array(z.string().uuid()).min(1, "Select at least one course."),
  action: z.enum(["PUBLISH", "ARCHIVE", "DELETE", "RESTORE"]),
});

export type CourseFormInput = z.infer<typeof CourseFormSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type CourseFilterInput = z.infer<typeof CourseFilterSchema>;
export type BulkCourseActionInput = z.infer<typeof BulkCourseActionSchema>;
