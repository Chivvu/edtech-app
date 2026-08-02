export interface ExecutiveAnalyticsData {
  totalCourses: number;
  publishedCourses: number;
  avgQualityScore: number;
  duplicateContentPercentage: number;
  pendingReviewsCount: number;
  qualityDistribution: {
    excellent: number;
    good: number;
    needsImprovement: number;
  };
}
