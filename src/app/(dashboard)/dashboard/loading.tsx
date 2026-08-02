import React from "react";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-64 rounded-lg bg-muted/60 animate-pulse" />
        <div className="mt-2 h-4 w-96 rounded-lg bg-muted/40 animate-pulse" />
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Widgets Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonTable rows={4} />
        <SkeletonTable rows={4} />
        <SkeletonTable rows={4} />
      </div>
    </div>
  );
}
