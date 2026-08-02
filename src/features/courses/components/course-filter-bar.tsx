"use client";

import React from "react";
import { Search, Filter, Trash2, ArrowUpDown } from "lucide-react";
import { CourseStatus } from "@prisma/client";
import { DifficultyLevels, Languages } from "../validations/course.schema";

interface CourseFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status?: CourseStatus;
  onStatusChange: (val?: CourseStatus) => void;
  difficulty?: string;
  onDifficultyChange: (val?: string) => void;
  language?: string;
  onLanguageChange: (val?: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (val: "asc" | "desc") => void;
  showDeleted: boolean;
  onShowDeletedToggle: () => void;
}

export function CourseFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showDeleted,
  onShowDeletedToggle,
}: CourseFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by course title or description..."
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <select
          value={status || ""}
          onChange={(e) => onStatusChange(e.target.value ? (e.target.value as CourseStatus) : undefined)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.values(CourseStatus).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={difficulty || ""}
          onChange={(e) => onDifficultyChange(e.target.value || undefined)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
        >
          <option value="">All Difficulties</option>
          {DifficultyLevels.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Language Filter */}
        <select
          value={language || ""}
          onChange={(e) => onLanguageChange(e.target.value || undefined)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
        >
          <option value="">All Languages</option>
          {Languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="updatedAt">Sort by Date Updated</option>
            <option value="createdAt">Sort by Date Created</option>
            <option value="title">Sort by Title</option>
            <option value="overallScore">Sort by Quality Score</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded-lg border border-input p-2 text-muted-foreground hover:text-foreground"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Trash Toggle */}
        <button
          onClick={onShowDeletedToggle}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            showDeleted
              ? "border-red-500/40 bg-red-500/10 text-red-400"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{showDeleted ? "Trash View" : "Active View"}</span>
        </button>
      </div>
    </div>
  );
}
