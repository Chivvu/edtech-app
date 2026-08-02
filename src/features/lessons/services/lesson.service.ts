import { prisma } from "@/lib/prisma";
import { LessonFormInput, ResourceFormInput } from "../validations/lesson.schema";

export class LessonService {
  static async getLessonById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: { course: true },
        },
        resources: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
        assignments: {
          where: { deletedAt: null },
        },
        quizzes: {
          where: { deletedAt: null },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
    });
  }

  static async createLesson(moduleId: string, input: LessonFormInput, userId: string, organizationId: string) {
    const maxOrder = await prisma.lesson.aggregate({
      where: { moduleId },
      _max: { orderIndex: true },
    });

    const nextOrder = (maxOrder._max.orderIndex ?? -1) + 1;

    return prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.create({
        data: {
          moduleId,
          title: input.title,
          content: input.content,
          mediaUrl: input.mediaUrl,
          transcript: input.transcript,
          durationMinutes: input.durationMinutes,
          status: input.status,
          orderIndex: nextOrder,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId,
          userId,
          action: "LESSON_CREATED",
          entityType: "Lesson",
          entityId: lesson.id,
          metadata: { title: lesson.title, moduleId },
        },
      });

      return lesson;
    });
  }

  static async updateLesson(id: string, input: Partial<LessonFormInput>, userId: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.lesson.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.content !== undefined && { content: input.content }),
          ...(input.mediaUrl !== undefined && { mediaUrl: input.mediaUrl }),
          ...(input.transcript !== undefined && { transcript: input.transcript }),
          ...(input.durationMinutes !== undefined && { durationMinutes: input.durationMinutes }),
          ...(input.status && { status: input.status }),
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId,
          userId,
          action: "LESSON_UPDATED",
          entityType: "Lesson",
          entityId: id,
          metadata: { changes: input },
        },
      });

      return updated;
    });
  }

  static async addResource(lessonId: string, input: ResourceFormInput) {
    return prisma.resource.create({
      data: {
        lessonId,
        title: input.title,
        type: input.type,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize || 0,
      },
    });
  }

  static async softDeleteLesson(id: string, userId: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.lesson.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          organizationId,
          actorId: userId,
          action: "LESSON_SOFT_DELETED",
          targetResource: `Lesson:${id}`,
          severity: "WARNING",
        },
      });

      return deleted;
    });
  }
}
