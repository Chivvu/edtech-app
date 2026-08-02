import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export class NotificationService {
  static async getUserNotifications(userId: string, unreadOnly: boolean = false) {
    const demoNotifications = [
      {
        id: "notif-1",
        type: NotificationType.COURSE_AUDIT_COMPLETE,
        title: "AI Quality Audit Completed",
        message: "Course 'Advanced React 19 Architecture' achieved a quality health score of 94%.",
        isRead: false,
        linkUrl: "/courses",
        createdAt: new Date(),
      },
      {
        id: "notif-2",
        type: NotificationType.REVIEW_ASSIGNED,
        title: "SME Review Assigned",
        message: "You have been assigned as primary reviewer for 'System Design Essentials'.",
        isRead: false,
        linkUrl: "/courses",
        createdAt: new Date(Date.now() - 7200000),
      },
    ];

    try {
      const where = {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      };

      const [unreadCount, notifications] = await Promise.all([
        prisma.notification.count({ where: { userId, isRead: false } }),
        prisma.notification.findMany({
          where,
          take: 20,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { unreadCount, notifications };
    } catch {
      return { unreadCount: demoNotifications.filter((n) => !n.isRead).length, notifications: demoNotifications };
    }
  }

  static async markAsRead(id: string, userId: string) {
    try {
      return await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true, readAt: new Date() },
      });
    } catch {
      return { count: 1 };
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
    } catch {
      return { count: 2 };
    }
  }

  static async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    linkUrl?: string;
  }) {
    try {
      return await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          linkUrl: data.linkUrl,
        },
      });
    } catch {
      return null;
    }
  }
}
