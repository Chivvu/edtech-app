"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface AnalyticsFilterBarProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onExportCSV: () => void;
}

export function AnalyticsFilterBar({
  timeRange,
  onTimeRangeChange,
  onExportCSV,
}: AnalyticsFilterBarProps) {
  const { toast } = useToast();

  const handlePrintPDF = () => {
    window.print();
    toast({ type: "info", title: "Generating PDF Report", description: "Preparing print report..." });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Time Range Pills */}
      <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60 text-xs">
        <Calendar className="h-4 w-4 text-muted-foreground ml-2 mr-1" />
        {["7D", "30D", "90D", "1Y"].map((r) => (
          <button
            key={r}
            onClick={() => onTimeRangeChange(r)}
            className={`rounded-md px-3 py-1 font-semibold transition-colors ${
              timeRange === r
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Export Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={onExportCSV}>
          Export CSV
        </Button>
        <Button variant="glow" size="sm" leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrintPDF}>
          Export PDF Report
        </Button>
      </div>
    </div>
  );
}
