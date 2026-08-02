import { CourseStatus } from "@prisma/client";

export interface ReviewCommentData {
  id: string;
  approvalReviewId: string;
  userId: string;
  userName: string;
  lessonId?: string | null;
  lineNumber?: number | null;
  comment: string;
  resolved: boolean;
  createdAt: Date;
}

export interface ApprovalReviewData {
  id: string;
  courseId: string;
  reviewerId: string;
  reviewerName: string;
  status: CourseStatus;
  decision?: string | null;
  feedback?: string | null;
  comments: ReviewCommentData[];
  createdAt: Date;
}
