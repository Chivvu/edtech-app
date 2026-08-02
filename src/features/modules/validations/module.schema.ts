import { z } from "zod";
import { CourseStatus } from "@prisma/client";

export const ModuleFormSchema = z.object({
  title: z.string().min(2, "Module title must be at least 2 characters.").max(120),
  description: z.string().default(""),
  durationMinutes: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
  objectives: z.array(z.string()).default([]),
});

export const ReorderModulesSchema = z.object({
  courseId: z.string().uuid(),
  moduleOrders: z.array(
    z.object({
      id: z.string().uuid(),
      orderIndex: z.number().int().min(0),
    })
  ).min(1),
});

export type ModuleFormInput = z.infer<typeof ModuleFormSchema>;
export type ReorderModulesInput = z.infer<typeof ReorderModulesSchema>;
