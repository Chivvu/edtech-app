import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { CreateCommentInput } from "../validations/comment.schema";

export class CommentService {
  static async getCommentsByReview(reviewId: string) {
    return prisma.comment.findMany({
      where: { reviewId, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  static async createComment(input: CreateCommentInput, userId: string, organizationId: string) {
    const { reviewId, comment, parentId, lessonId, lineNumber, mentions } = input;
    if (!organizationId) throw new Error("Organization ID required.");

    return prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          reviewId,
          userId,
          parentId: parentId || null,
          lessonId: lessonId || null,
          lineNumber: lineNumber || null,
          comment,
        },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      });

      // Notify parent thread author if this is a reply
      if (parentId) {
        const parentComment = await tx.comment.findUnique({
          where: { id: parentId },
        });

        if (parentComment && parentComment.userId !== userId) {
          await tx.notification.create({
            data: {
              userId: parentComment.userId,
              type: NotificationType.COMMENT_ADDED,
              title: "New Reply to Your Review Comment",
              message: `${newComment.user.name} replied: "${comment.slice(0, 80)}..."`,
              linkUrl: `/courses`,
            },
          });
        }
      }

      // Notify mentioned users
      if (mentions && mentions.length > 0) {
        const notifPromises = mentions
          .filter((mId) => mId !== userId)
          .map((mId) =>
            tx.notification.create({
              data: {
                userId: mId,
                type: NotificationType.COMMENT_ADDED,
                title: "You were mentioned in a review comment",
                message: `${newComment.user.name} mentioned you: "${comment.slice(0, 80)}..."`,
                linkUrl: `/courses`,
              },
            })
          );
        await Promise.all(notifPromises);
      }

      return newComment;
    });
  }

  static async toggleResolveComment(commentId: string, resolved: boolean) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { resolved },
    });
  }
}
