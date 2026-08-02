import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Sparkles } from "lucide-react";

interface InstructorProductivityProps {
  instructors: {
    authorName: string;
    totalCreated: number;
    publishedCount: number;
    avgScore: number;
  }[];
}

export function InstructorProductivityWidget({ instructors }: InstructorProductivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-4 w-4 text-purple-400" />
          <span>Designed by Shivam Kumar Productivity</span>
        </CardTitle>
        <CardDescription>Top content authors, published output, and average quality scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {instructors.map((ins, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{ins.authorName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {ins.totalCreated} Created
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{ins.publishedCount} Published</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="h-3 w-3" />
                <span>{ins.avgScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
