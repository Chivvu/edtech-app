"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { NotificationService } from "../services/notification.service";

export async function getUserNotificationsAction(unreadOnly: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const result = await NotificationService.getUserNotifications(session.user.id, unreadOnly);
  return { success: true, data: result };
}

export async function markAsReadAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  await NotificationService.markAsRead(id, session.user.id);
  revalidatePath("/");
  return { success: true };
}

export async function markAllAsReadAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  await NotificationService.markAllAsRead(session.user.id);
  revalidatePath("/");
  return { success: true };
}
