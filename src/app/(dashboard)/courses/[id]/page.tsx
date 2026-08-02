import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { CourseService } from "@/features/courses/services/course.service";
import { ModuleList } from "@/features/modules/components/module-list";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Edit3, Sparkles, Clock, Globe, Award, Layers, User } from "lucide-react";

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.organizationId) {
    notFound();
  }

  const course = await CourseService.getCourseById(id, session.user.organizationId);

  if (!course) {
    notFound();
  }

  const formattedModules = course.modules.map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description || "",
    orderIndex: m.orderIndex,
    status: m.status,
    durationMinutes: m.durationMinutes,
    lessons: (m.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      orderIndex: l.orderIndex,
      _count: { resources: 0, assignments: 0, quizzes: 0 },
    })),
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <Breadcrumb items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {course.title}
            </h1>
            <StatusBadge status={course.status} />
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
              <Layers className="h-3 w-3" /> v{course.version}.0
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {course.description || "No course description provided."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/courses/${course.id}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="h-4 w-4" />}>
              Edit Course
            </Button>
          </Link>
          <Link href={`/courses/${course.id}/audit`}>
            <Button variant="glow" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
              Run AI Quality Audit
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Metadata Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">Difficulty</span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground text-sm">
            <Award className="h-4 w-4 text-purple-400" />
            <span>{course.difficulty}</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">Language</span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground text-sm">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>{course.language}</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">Estimated Duration</span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground text-sm">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>{course.durationMinutes || 0} Minutes</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase text-muted-foreground">Author</span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground text-sm truncate">
            <User className="h-4 w-4 text-indigo-400" />
            <span className="truncate">{course.author?.name || "Unknown"}</span>
          </div>
        </Card>
      </div>

      {/* Module Hierarchy Section */}
      <Card className="p-6">
        <ModuleList courseId={course.id} initialModules={formattedModules} />
      </Card>
    </div>
  );
}
