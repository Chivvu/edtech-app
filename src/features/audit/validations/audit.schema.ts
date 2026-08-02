import { z } from "zod";

export const AIAuditResultSchema = z.object({
  summary: z.string().min(10, "Summary must be detailed."),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  learningObjectives: z.array(z.string()).min(1),
  targetAudience: z.string(),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()).min(1),
  healthScore: z.number().min(0).max(100),
  industryRelevanceScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  accessibilityScore: z.number().min(0).max(100),
  prerequisites: z.array(z.string()),
  bloomsCoverage: z.object({
    remembering: z.number().min(0).max(100),
    understanding: z.number().min(0).max(100),
    applying: z.number().min(0).max(100),
    analyzing: z.number().min(0).max(100),
    evaluating: z.number().min(0).max(100),
    creating: z.number().min(0).max(100),
  }),
});

export type AIAuditResult = z.infer<typeof AIAuditResultSchema>;
