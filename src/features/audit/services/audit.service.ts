import { prisma } from "@/lib/prisma";

export class AuditService {
  static async getLatestAuditReport(courseId: string) {
    return prisma.aIReport.findFirst({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async runCourseAudit(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found for audit.");
    }

    const stubReport = {
      qualityScore: 88,
      clarityScore: 92,
      bloomsCoverage: {
        remembering: 20,
        understanding: 30,
        applying: 25,
        analyzing: 15,
        evaluating: 5,
        creating: 5,
      },
      pedagogyIssues: [
        {
          severity: "WARNING" as const,
          issueTitle: "Missing Prerequisite Overview",
          description: "Module 2 assumes advanced JavaScript knowledge without introductory refresher.",
          remediationSuggestion: "Add a 5-minute refresher lesson on ES6 syntax prior to Module 2.",
        },
      ],
      aiSummary: "The course exhibits strong clarity and structure. Recommended additions include practical exercises for evaluating and creating concepts.",
    };

    return prisma.aIReport.create({
      data: {
        courseId,
        qualityScore: stubReport.qualityScore,
        clarityScore: stubReport.clarityScore,
        bloomsCoverage: stubReport.bloomsCoverage,
        pedagogyIssues: stubReport.pedagogyIssues,
        aiSummary: stubReport.aiSummary,
      },
    });
  }
}
