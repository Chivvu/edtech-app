import { z } from "zod";
import { CourseStatus, ResourceType } from "@prisma/client";

export const LessonFormSchema = z.object({
  title: z.string().min(2, "Lesson title must be at least 2 characters.").max(120),
  content: z.string().default(""),
  mediaUrl: z.string().url("Please enter a valid media URL.").optional().or(z.literal("")),
  transcript: z.string().default(""),
  durationMinutes: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
});

export const ResourceFormSchema = z.object({
  title: z.string().min(2, "Resource title is required."),
  type: z.nativeEnum(ResourceType).default(ResourceType.PDF_DOCUMENT),
  fileUrl: z.string().url("Please provide a valid document URL."),
  fileSize: z.coerce.number().int().optional(),
});

export type LessonFormInput = z.infer<typeof LessonFormSchema>;
export type ResourceFormInput = z.infer<typeof ResourceFormSchema>;
