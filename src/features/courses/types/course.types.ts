import { CourseStatus } from "@prisma/client";

export interface CourseSummary {
  id: string;
  organizationId: string;
  authorId: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  status: CourseStatus;
  version: number;
  overallScore?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleSummary {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  title: string;
  content?: string | null;
  mediaUrl?: string | null;
  orderIndex: number;
}
