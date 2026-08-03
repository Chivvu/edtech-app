import { prisma } from "@/lib/prisma";
import { openai, AI_MODELS } from "@/lib/openai";

export class DuplicateService {
  static async findDuplicatesForLesson(lessonId: string, organizationId: string) {
    return prisma.duplicateMatch.findMany({
      where: {
        sourceLessonId: lessonId,
        targetLesson: { module: { course: { organizationId } } },
      },
      include: {
        targetLesson: {
          include: {
            module: {
              include: { course: true },
            },
          },
        },
      },
      orderBy: { similarity: "desc" },
    });
  }

  static async generateLessonEmbedding(content: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: AI_MODELS.EMBEDDING,
      input: content,
    });
    return response.data[0].embedding;
  }
}
