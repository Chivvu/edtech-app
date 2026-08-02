"use client";

import React from "react";
import { BookOpen, Clock, CheckCircle, Sparkles, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardsProps {
  totalCourses: number;
  pendingReviews: number;
  publishedCourses: number;
  avgHealthScore: number;
  aiReportsCount: number;
}

export function MetricCards({
  totalCourses,
  pendingReviews,
  publishedCourses,
  avgHealthScore,
  aiReportsCount,
}: MetricCardsProps) {
  const cards = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: <BookOpen className="h-5 w-5 text-indigo-400" />,
      trend: "+12.4% from last month",
      color: "border-indigo-500/20 bg-indigo-500/5",
    },
    {
      title: "Pending Reviews",
      value: pendingReviews,
      icon: <Clock className="h-5 w-5 text-amber-400" />,
      trend: "4 urgent assignments",
      color: "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Published Courses",
      value: publishedCourses,
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      trend: "+8 new this month",
      color: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Avg Health Score",
      value: `${avgHealthScore}%`,
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      trend: "+2.1% quality boost",
      color: "border-purple-500/20 bg-purple-500/5",
    },
    {
      title: "AI Audit Reports",
      value: aiReportsCount,
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      trend: "100% catalog coverage",
      color: "border-blue-500/20 bg-blue-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className={`p-5 transition-all hover:scale-[1.02] hover:shadow-md ${card.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {card.title}
            </span>
            <div className="rounded-lg p-2 bg-background/50 backdrop-blur-sm border border-border/40">
              {card.icon}
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {card.value}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>{card.trend}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
