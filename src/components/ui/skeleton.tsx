import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted/60", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <Skeleton className="h-5 w-1/4" />
      <div className="flex h-48 items-end gap-2 pt-4">
        {Array.from({ length: 7 }).map((_, i) => {
          const heights = [45, 65, 35, 75, 50, 60, 40];
          return (
            <Skeleton
              key={i}
              className="w-full"
              style={{ height: `${heights[i % 7]}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
