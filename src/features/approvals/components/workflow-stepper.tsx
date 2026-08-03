"use client";

import React, { useState, useTransition } from "react";
import { CourseStatus } from "@prisma/client";
import { transitionStatusAction } from "../actions/approval.actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/table";
import { CheckCircle2, Clock, AlertTriangle, Sparkles, Send, ShieldCheck, Globe, Archive } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface WorkflowStepperProps {
  courseId: string;
  currentStatus: CourseStatus;
  userRole?: string;
}

const WorkflowStages: { status: CourseStatus; label: string; icon: React.ReactNode }[] = [
  { status: CourseStatus.DRAFT, label: "Drafting", icon: <Clock className="h-4 w-4" /> },
  { status: CourseStatus.AI_AUDIT_PENDING, label: "AI Audit", icon: <Sparkles className="h-4 w-4" /> },
  { status: CourseStatus.REVIEW_PENDING, label: "SME Review", icon: <ShieldCheck className="h-4 w-4" /> },
  { status: CourseStatus.APPROVED, label: "Approved", icon: <CheckCircle2 className="h-4 w-4" /> },
  { status: CourseStatus.PUBLISHED, label: "Published", icon: <Globe className="h-4 w-4" /> },
];

export function WorkflowStepper({ courseId, currentStatus, userRole = "ADMIN" }: WorkflowStepperProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isRoleAuthorized = userRole !== "VIEWER";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<CourseStatus | null>(null);
  const [feedback, setFeedback] = useState("");

  const currentStageIndex = WorkflowStages.findIndex((s) => s.status === currentStatus);

  const openTransitionModal = (status: CourseStatus) => {
    if (!isRoleAuthorized) {
      toast({ type: "error", title: "Access Restricted", description: "Viewer role cannot transition workflow status." });
      return;
    }
    setTargetStatus(status);
    setIsModalOpen(true);
  };

  const handleTransitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) return;

    startTransition(async () => {
      const res = await transitionStatusAction({
        courseId,
        nextStatus: targetStatus,
        feedback,
      });

      if (res.success) {
        toast({
          type: "success",
          title: "Workflow Transition Applied",
          description: `Course moved to ${targetStatus.replace(/_/g, " ")}.`,
        });
        setIsModalOpen(false);
        setFeedback("");
      } else {
        toast({ type: "error", title: "Transition Failed", description: res.error || "Failed to update status." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current State:</span>
            <StatusBadge status={currentStatus} />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {currentStatus === CourseStatus.DRAFT && (
              <Button size="sm" variant="glow" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={() => openTransitionModal(CourseStatus.REVIEW_PENDING)}>
                Submit for SME Review
              </Button>
            )}

            {currentStatus === CourseStatus.REVIEW_PENDING && (
              <>
                <Button size="sm" variant="danger" leftIcon={<AlertTriangle className="h-3.5 w-3.5" />} onClick={() => openTransitionModal(CourseStatus.REVISION_REQUIRED)}>
                  Request Changes
                </Button>
                <Button size="sm" variant="glow" leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => openTransitionModal(CourseStatus.APPROVED)}>
                  Approve Course
                </Button>
              </>
            )}

            {currentStatus === CourseStatus.APPROVED && (
              <Button size="sm" variant="glow" leftIcon={<Globe className="h-3.5 w-3.5" />} onClick={() => openTransitionModal(CourseStatus.PUBLISHED)}>
                Publish Course
              </Button>
            )}

            {currentStatus === CourseStatus.PUBLISHED && (
              <Button size="sm" variant="secondary" leftIcon={<Archive className="h-3.5 w-3.5" />} onClick={() => openTransitionModal(CourseStatus.ARCHIVED)}>
                Archive Course
              </Button>
            )}
          </div>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-border pt-6">
          {WorkflowStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.status}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold ring-2 ring-indigo-500/20"
                    : isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : "border-border/60 bg-muted/20 text-muted-foreground opacity-60"
                }`}
              >
                <div className="mb-1">{stage.icon}</div>
                <span className="text-xs font-semibold">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Transition Status to ${targetStatus?.replace(/_/g, " ")}`}
        description="Provide optional reviewer feedback and decision notes for the author"
      >
        <form onSubmit={handleTransitionSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Reviewer Notes / Feedback
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter pedagogical comments, revision requirements, or approval sign-off details..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" isLoading={isPending}>
              Confirm Transition
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
