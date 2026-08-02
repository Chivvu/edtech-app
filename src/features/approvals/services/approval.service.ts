import { prisma } from "@/lib/prisma";
import { CourseStatus, NotificationType } from "@prisma/client";
import { TransitionStatusInput, AddReviewCommentInput } from "../validations/approval.schema";

export class ApprovalService {
  static async transitionCourseStatus(input: TransitionStatusInput, actorId: string, organizationId: string) {
    const { courseId, nextStatus, reviewerId, decision, feedback } = input;

    return prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId, organizationId },
      });

      if (!course) {
        throw new Error("Course not found for workflow transition.");
      }

      const prevStatus = course.status;

      // 1. Update Course Status
      const updatedCourse = await tx.course.update({
        where: { id: courseId },
        data: { status: nextStatus },
      });

      // 2. Create Review Log Entry
      const review = await tx.review.create({
        data: {
          courseId,
          reviewerId: reviewerId || actorId,
          status: nextStatus,
          decision: decision || `Transitioned from ${prevStatus} to ${nextStatus}`,
          feedback,
        },
      });

      // 3. Create Audit Log Entry
      await tx.auditLog.create({
        data: {
          organizationId,
          actorId,
          action: `WORKFLOW_TRANSITION_${nextStatus}`,
          targetResource: `Course:${courseId}`,
          changes: { prevStatus, nextStatus, feedback },
          severity: nextStatus === CourseStatus.PUBLISHED ? "INFO" : "WARNING",
        },
      });

      // 4. Create Notification for Course Author
      if (course.authorId !== actorId) {
        await tx.notification.create({
          data: {
            userId: course.authorId,
            type: NotificationType.REVIEW_DECISION,
            title: `Course Status Changed to ${nextStatus.replace(/_/g, " ")}`,
            message: `Your course '${course.title}' has been moved to ${nextStatus.replace(/_/g, " ")}. Feedback: ${feedback || "None"}`,
            linkUrl: `/courses/${courseId}/review`,
          },
        });
      }

      // 5. Create Notification for Assigned SME Reviewer
      if (reviewerId && reviewerId !== actorId) {
        await tx.notification.create({
          data: {
            userId: reviewerId,
            type: NotificationType.REVIEW_ASSIGNED,
            title: "New Quality Review Assignment",
            message: `You have been assigned to review '${course.title}'.`,
            linkUrl: `/courses/${courseId}/review`,
          },
        });
      }

      return { course: updatedCourse, review };
    });
  }

  static async getWorkflowTimeline(courseId: string) {
    const reviews = await prisma.review.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: { select: { name: true, email: true, avatarUrl: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
    });

    const auditLogs = await prisma.auditLog.findMany({
      where: { targetResource: `Course:${courseId}` },
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { name: true, email: true } },
      },
    });

    return { reviews, auditLogs };
  }

  static async addReviewComment(input: AddReviewCommentInput, userId: string) {
    return prisma.comment.create({
      data: {
        reviewId: input.reviewId,
        userId,
        lessonId: input.lessonId,
        lineNumber: input.lineNumber,
        comment: input.comment,
      },
    });
  }
}
