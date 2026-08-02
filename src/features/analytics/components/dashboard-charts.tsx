"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

interface DashboardChartsProps {
  monthlyUploads: { month: string; uploads: number }[];
  approvalRateTrend: { month: string; rate: number }[];
  reviewTimeTurnaround: { month: string; avgDays: number }[];
}

export function DashboardCharts({
  monthlyUploads,
  approvalRateTrend,
  reviewTimeTurnaround,
}: DashboardChartsProps) {
  const [timeRange, setTimeRange] = useState<"6M" | "1Y">("6M");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Uploads Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>Monthly Course Content Ingestion</span>
            </CardTitle>
            <CardDescription>New course and lesson volume uploaded per month</CardDescription>
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              onClick={() => setTimeRange("6M")}
              className={`rounded px-2 py-0.5 font-medium transition-colors ${
                timeRange === "6M" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              6M
            </button>
            <button
              onClick={() => setTimeRange("1Y")}
              className={`rounded px-2 py-0.5 font-medium transition-colors ${
                timeRange === "1Y" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              1Y
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUploads}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.12)" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="uploads" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Approval Rate & Review Time Turnaround */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Approval Rate & Quality Velocity</span>
            </CardTitle>
            <CardDescription>Percentage of courses passing quality audit on first review</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={approvalRateTrend}>
                <defs>
                  <linearGradient id="approvalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.12)" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#approvalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Review Time Turnaround */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Average Review Turnaround Time (Days)</span>
          </CardTitle>
          <CardDescription>SME review duration from submission to final decision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewTimeTurnaround}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.12)" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} unit=" days" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="avgDays" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
