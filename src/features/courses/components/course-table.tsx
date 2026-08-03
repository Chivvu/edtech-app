"use client";

import React from "react";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit3, Sparkles, Trash2, RefreshCw, Layers } from "lucide-react";

export interface CourseTableItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  version: number;
  overallScore?: number | null;
  authorName?: string;
  categoryName?: string;
  modulesCount: number;
  updatedAt: Date;
  deletedAt?: Date | null;
}

interface CourseTableProps {
  courses: CourseTableItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string) => void;
  onSoftDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function CourseTable({
  courses,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onSoftDelete,
  onRestore,
}: CourseTableProps) {
  const isAllSelected = courses.length > 0 && selectedIds.length === courses.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-background text-primary"
            />
          </TableHead>
          <TableHead>Course Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Modules</TableHead>
          <TableHead>AI Score</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => {
          const isSelected = selectedIds.includes(course.id);
          const isDeleted = Boolean(course.deletedAt);

          return (
            <TableRow key={course.id} className={isDeleted ? "opacity-60 bg-red-500/5" : undefined}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectOne(course.id)}
                  className="h-4 w-4 rounded border-border bg-background text-primary"
                />
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  {course.categoryName && (
                    <span className="text-[10px] text-muted-foreground">{course.categoryName}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={course.status} />
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
                  <Layers className="h-3 w-3" /> v{course.version}.0
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{course.modulesCount} modules</TableCell>
              <TableCell>
                {course.overallScore ? (
                  <span className="flex items-center gap-1 font-semibold text-indigo-400 text-xs">
                    <Sparkles className="h-3 w-3" /> {Math.round(course.overallScore)}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{course.authorName || "Unknown"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(course.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-1">
                {!isDeleted ? (
                  <>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        Inspect
                      </Button>
                    </Link>
                    <Link href={`/courses/${course.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit Course">
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Move to Trash"
                      onClick={() => onSoftDelete(course.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RefreshCw className="h-3 w-3" />}
                    onClick={() => onRestore(course.id)}
                  >
                    Restore
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
