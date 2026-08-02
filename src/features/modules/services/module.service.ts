import { prisma } from "@/lib/prisma";
import { ModuleFormInput, ReorderModulesInput } from "../validations/module.schema";

export class ModuleService {
  static async getModulesByCourse(courseId: string) {
    return prisma.module.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          where: { deletedAt: null },
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            title: true,
            orderIndex: true,
            _count: { select: { resources: true, assignments: true, quizzes: true } },
          },
        },
      },
    });
  }

  static async createModule(courseId: string, input: ModuleFormInput, userId: string, organizationId: string) {
    const maxOrder = await prisma.module.aggregate({
      where: { courseId },
      _max: { orderIndex: true },
    });

    const nextOrder = (maxOrder._max.orderIndex ?? -1) + 1;

    return prisma.$transaction(async (tx) => {
      const moduleItem = await tx.module.create({
        data: {
          courseId,
          title: input.title,
          description: input.description,
          orderIndex: nextOrder,
          durationMinutes: input.durationMinutes,
          status: input.status,
          objectives: input.objectives,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId,
          userId,
          action: "MODULE_CREATED",
          entityType: "Module",
          entityId: moduleItem.id,
          metadata: { courseId, title: moduleItem.title },
        },
      });

      return moduleItem;
    });
  }

  static async updateModule(id: string, input: Partial<ModuleFormInput>, userId: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.module.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.durationMinutes !== undefined && { durationMinutes: input.durationMinutes }),
          ...(input.status && { status: input.status }),
          ...(input.objectives && { objectives: input.objectives }),
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId,
          userId,
          action: "MODULE_UPDATED",
          entityType: "Module",
          entityId: id,
          metadata: { changes: input },
        },
      });

      return updated;
    });
  }

  static async reorderModules(input: ReorderModulesInput, userId: string, organizationId: string) {
    const { courseId, moduleOrders } = input;

    return prisma.$transaction(async (tx) => {
      const updatePromises = moduleOrders.map((item) =>
        tx.module.update({
          where: { id: item.id, courseId },
          data: { orderIndex: item.orderIndex },
        })
      );

      await Promise.all(updatePromises);

      await tx.activityLog.create({
        data: {
          organizationId,
          userId,
          action: "MODULES_REORDERED",
          entityType: "Course",
          entityId: courseId,
          metadata: { count: moduleOrders.length },
        },
      });

      return { success: true };
    });
  }

  static async softDeleteModule(id: string, userId: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.module.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          organizationId,
          actorId: userId,
          action: "MODULE_SOFT_DELETED",
          targetResource: `Module:${id}`,
          severity: "WARNING",
        },
      });

      return deleted;
    });
  }
}
