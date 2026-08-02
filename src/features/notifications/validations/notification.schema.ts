import { z } from "zod";
import { NotificationType } from "@prisma/client";

export const NotificationFilterSchema = z.object({
  unreadOnly: z.boolean().default(false),
  type: z.nativeEnum(NotificationType).optional(),
});

export type NotificationFilterInput = z.infer<typeof NotificationFilterSchema>;
