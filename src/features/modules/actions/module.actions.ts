"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ModuleFormSchema, ModuleFormInput, ReorderModulesSchema, ReorderModulesInput } from "../validations/module.schema";
import { ModuleService } from "../services/module.service";

export async function getModulesAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const modules = await ModuleService.getModulesByCourse(courseId);
  return { success: true, data: modules };
}

export async function createModuleAction(courseId: string, data: ModuleFormInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = ModuleFormSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Validation failed.", validationErrors: validated.error.flatten().fieldErrors };
  }

  const moduleItem = await ModuleService.createModule(
    courseId,
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${courseId}`);
  return { success: true, data: moduleItem };
}

export async function updateModuleAction(id: string, courseId: string, data: Partial<ModuleFormInput>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const updated = await ModuleService.updateModule(
    id,
    data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${courseId}`);
  return { success: true, data: updated };
}

export async function reorderModulesAction(data: ReorderModulesInput) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = ReorderModulesSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid reorder payload." };
  }

  const result = await ModuleService.reorderModules(
    validated.data,
    session.user.id,
    session.user.organizationId
  );

  revalidatePath(`/courses/${data.courseId}`);
  return { success: true, data: result };
}

export async function deleteModuleAction(id: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  await ModuleService.softDeleteModule(id, session.user.id, session.user.organizationId);

  revalidatePath(`/courses/${courseId}`);
  return { success: true, message: "Module moved to trash." };
}
