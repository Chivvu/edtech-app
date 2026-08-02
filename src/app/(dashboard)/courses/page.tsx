"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { CourseStatus } from "@prisma/client";
import {
  getCoursesAction,
  softDeleteCourseAction,
  restoreCourseAction,
  bulkCourseAction,
} from "@/features/courses/actions/course.actions";
import { CourseFilterBar } from "@/features/courses/components/course-filter-bar";
import { CourseTable, CourseTableItem } from "@/features/courses/components/course-table";
import { CourseBulkBar } from "@/features/courses/components/course-bulk-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CoursesPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CourseStatus | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);

  const [courses, setCourses] = useState<CourseTableItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const fetchCourses = () => {
    startTransition(async () => {
      const res = await getCoursesAction({
        search,
        status,
        difficulty: difficulty as any,
        language: language as any,
        sortBy: sortBy as any,
        sortOrder,
        page,
        pageSize: 10,
        showDeleted,
      });

      if (res.success && res.data) {
        setCourses(
          res.data.courses.map((c) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            status: c.status,
            version: c.version,
            overallScore: c.overallScore,
            authorName: c.author?.name,
            categoryName: c.category?.name,
            modulesCount: c._count.modules,
            updatedAt: c.updatedAt,
            deletedAt: c.deletedAt,
          }))
        );
        setPagination(res.data.pagination);
      }
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [search, status, difficulty, language, sortBy, sortOrder, page, showDeleted]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(courses.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSoftDelete = async (id: string) => {
    const res = await softDeleteCourseAction(id);
    if (res.success) {
      toast({ type: "warning", title: "Course Moved to Trash", description: res.message });
      fetchCourses();
    }
  };

  const handleRestore = async (id: string) => {
    const res = await restoreCourseAction(id);
    if (res.success) {
      toast({ type: "success", title: "Course Restored", description: res.message });
      fetchCourses();
    }
  };

  const handleBulkAction = async (action: "PUBLISH" | "ARCHIVE" | "DELETE" | "RESTORE") => {
    const res = await bulkCourseAction({ courseIds: selectedIds, action });
    if (res.success) {
      toast({
        type: "success",
        title: "Bulk Action Applied",
        description: `Applied ${action} action to ${selectedIds.length} courses.`,
      });
      setSelectedIds([]);
      fetchCourses();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Course Repository
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage curriculum structure, quality audit status, and publishing workflows.
          </p>
        </div>

        <Link href="/courses/new">
          <Button variant="glow" leftIcon={<Plus className="h-4 w-4" />}>
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <CourseFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        language={language}
        onLanguageChange={setLanguage}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        showDeleted={showDeleted}
        onShowDeletedToggle={() => setShowDeleted(!showDeleted)}
      />

      {/* Course Data Table / Skeleton */}
      {isPending ? (
        <SkeletonTable rows={6} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10 text-muted-foreground/60" />}
          title={showDeleted ? "Trash Bin is Empty" : "No Courses Found"}
          description={
            showDeleted
              ? "There are no soft-deleted courses in the repository trash."
              : "No educational courses match your active search and filter criteria."
          }
          action={
            !showDeleted ? (
              <Link href="/courses/new">
                <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  Create First Course
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <CourseTable
            courses={courses}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onSoftDelete={handleSoftDelete}
            onRestore={handleRestore}
          />

          {/* Pagination Footer */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{courses.length}</span> of{" "}
              <span className="font-semibold text-foreground">{pagination.totalCount}</span> courses
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="px-2 font-medium text-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Floating Bulk Actions Bar */}
      <CourseBulkBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkAction={handleBulkAction}
        isTrashView={showDeleted}
      />
    </div>
  );
}
