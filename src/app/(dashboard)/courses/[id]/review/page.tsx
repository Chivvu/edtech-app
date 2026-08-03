import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { CourseService } from "@/features/courses/services/course.service";
import { ApprovalService } from "@/features/approvals/services/approval.service";
import { WorkflowStepper } from "@/features/approvals/components/workflow-stepper";
import { WorkflowTimeline } from "@/features/approvals/components/workflow-timeline";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface CourseReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseReviewPage({ params }: CourseReviewPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.organizationId) {
    notFound();
  }

  const course: any = await CourseService.getCourseById(id, session.user.organizationId);

  if (!course) {
    notFound();
  }

  const timelineData = await ApprovalService.getWorkflowTimeline(id);

  const formattedReviews = timelineData.reviews.map((r) => ({
    id: r.id,
    status: r.status,
    decision: r.decision,
    feedback: r.feedback,
    createdAt: r.createdAt,
    reviewerName: r.reviewer?.name,
    comments: r.comments.map((c) => ({
      id: c.id,
      comment: c.comment,
      createdAt: c.createdAt,
      userName: c.user?.name,
    })),
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.title, href: `/courses/${course.id}` },
          { label: "Quality Review & Approval Center" },
        ]}
      />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Course Quality Review & Approval Center
          </h1>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Institutional Approval Pipeline
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage state transitions for '{course.title}', record SME auditor sign-offs, and track compliance audit logs.
        </p>
      </div>

      {/* Stepper Pipeline Control */}
      <WorkflowStepper
        courseId={course.id}
        currentStatus={course.status}
        userRole={session.user.role}
      />

      {/* Chronological Audit Log & Reviewer Notes Timeline */}
      <WorkflowTimeline reviews={formattedReviews} />
    </div>
  );
}
