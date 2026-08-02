export interface DuplicateResult {
  id: string;
  sourceLessonId: string;
  targetLessonId: string;
  targetLessonTitle: string;
  targetCourseTitle: string;
  similarity: number;
  matchedExcerpt?: string | null;
  createdAt: Date;
}
