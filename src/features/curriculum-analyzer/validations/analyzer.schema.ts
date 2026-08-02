import { z } from "zod";

export const CurriculumAnalysisSchema = z.object({
  curriculumHealthScore: z.number().min(0).max(100),
  learningFlowScore: z.number().min(0).max(100),
  difficultyProgressionScore: z.number().min(0).max(100),
  learningFlowAnalysis: z.string(),
  prerequisitesAnalysis: z.string(),
  missingTopics: z.array(z.string()).min(1),
  weakModules: z.array(
    z.object({
      moduleTitle: z.string(),
      reason: z.string(),
      recommendation: z.string(),
    })
  ),
  recommendations: z.array(z.string()).min(1),
  graphNodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["prerequisite", "module", "lesson"]),
      difficulty: z.string(),
    })
  ),
  graphEdges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      relationship: z.enum(["requires", "leads_to"]),
    })
  ),
});

export type CurriculumAnalysisResult = z.infer<typeof CurriculumAnalysisSchema>;
