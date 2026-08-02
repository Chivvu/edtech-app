import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, ShieldCheck, FileText, Sparkles } from "lucide-react";

interface RecentActivityProps {
  activities: {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    createdAt: Date;
    userEmail?: string;
  }[];
}

export function RecentActivityWidget({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Real-time Organization Activity Audit Stream</span>
        </CardTitle>
        <CardDescription>Live log of course creation, AI audits, and SME review approvals</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No recent organization activity recorded.</p>
        ) : (
          <div className="relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3 pl-7">
                <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border">
                  {act.action.includes("AUDIT") ? (
                    <Sparkles className="h-3 w-3 text-purple-400" />
                  ) : act.action.includes("REVIEW") ? (
                    <ShieldCheck className="h-3 w-3 text-indigo-400" />
                  ) : (
                    <FileText className="h-3 w-3 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground truncate">{act.action.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {act.userEmail ? `By ${act.userEmail}` : "System Process"} • {act.entityType} ID: {act.entityId.slice(0, 8)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
