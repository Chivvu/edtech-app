import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { LessonService } from "@/features/lessons/services/lesson.service";
import { LessonEditor } from "@/features/lessons/components/lesson-editor";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface LessonDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.organizationId) {
    notFound();
  }

  const lesson = await LessonService.getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const courseId = lesson.module.courseId;
  const courseTitle = lesson.module.course.title;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseId}` },
          { label: lesson.title },
        ]}
      />

      <LessonEditor
        lessonId={lesson.id}
        courseId={courseId}
        initialTitle={lesson.title}
        initialContent={lesson.content || ""}
        initialMediaUrl={lesson.mediaUrl}
        initialTranscript={lesson.transcript}
        initialDuration={lesson.durationMinutes || 0}
        initialStatus={lesson.status}
        resources={lesson.resources}
      />
    </div>
  );
}
