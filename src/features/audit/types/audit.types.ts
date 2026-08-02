export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface BloomsTaxonomyRatio {
  remembering: number;
  understanding: number;
  applying: number;
  analyzing: number;
  evaluating: number;
  creating: number;
}

export interface PedagogyIssue {
  severity: AuditSeverity;
  issueTitle: string;
  description: string;
  remediationSuggestion: string;
}

export interface AuditReportData {
  id: string;
  courseId: string;
  qualityScore: number;
  clarityScore: number;
  bloomsCoverage: BloomsTaxonomyRatio;
  pedagogyIssues: PedagogyIssue[];
  aiSummary: string;
  createdAt: Date;
}
