"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/table";
import { Clock, ShieldCheck, MessageSquare } from "lucide-react";

export interface ReviewTimelineItem {
  id: string;
  status: string;
  decision?: string | null;
  feedback?: string | null;
  createdAt: Date;
  reviewerName?: string;
  comments: {
    id: string;
    comment: string;
    createdAt: Date;
    userName?: string;
  }[];
}

interface WorkflowTimelineProps {
  reviews: ReviewTimelineItem[];
}

export function WorkflowTimeline({ reviews }: WorkflowTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          <span>Workflow Transition & Audit History</span>
        </CardTitle>
        <CardDescription>Chronological log of SME reviewer sign-offs, feedback, and inline comments</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No workflow transitions logged yet.</p>
        ) : (
          <div className="relative space-y-6 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
            {reviews.map((rev) => (
              <div key={rev.id} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-indigo-500/40">
                  <ShieldCheck className="h-3 w-3 text-indigo-400" />
                </div>

                <div className="flex-1 rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={rev.status} />
                      <span className="text-xs font-semibold text-foreground">
                        {rev.reviewerName ? `By ${rev.reviewerName}` : "System Audit"}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {rev.feedback && (
                    <p className="text-xs text-foreground bg-background p-3 rounded-lg border border-border/60 font-medium">
                      &quot;{rev.feedback}&quot;
                    </p>
                  )}

                  {/* Threaded Comments */}
                  {rev.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-indigo-400" /> Threaded Review Comments ({rev.comments.length})
                      </span>

                      {rev.comments.map((c) => (
                        <div key={c.id} className="text-xs bg-muted/30 p-2.5 rounded-lg border border-border/40 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-indigo-400">{c.userName || "Reviewer"}</span>
                            <span className="text-[9px] text-muted-foreground">{new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <p className="text-foreground">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
