import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock } from "lucide-react";

interface ReviewerWorkloadProps {
  reviewers: {
    reviewerName: string;
    pendingCount: number;
    approvedCount: number;
  }[];
}

export function ReviewerWorkloadWidget({ reviewers }: ReviewerWorkloadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-indigo-400" />
          <span>SME Reviewer Workload & Capacity</span>
        </CardTitle>
        <CardDescription>Pending vs completed quality reviews per assigned auditor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviewers.map((rev, idx) => {
          const total = rev.pendingCount + rev.approvedCount;
          const pendingPct = total > 0 ? (rev.pendingCount / total) * 100 : 0;

          return (
            <div key={idx} className="space-y-2 rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{rev.reviewerName}</span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="h-3 w-3" /> {rev.pendingCount} Pending
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> {rev.approvedCount} Approved
                  </span>
                </div>
              </div>

              {/* Progress Capacity Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${pendingPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
