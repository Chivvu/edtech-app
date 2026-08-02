"use client";

import React, { useState, useEffect, useCallback } from "react";
import { updateLessonAction, addResourceAction } from "../actions/lesson.actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/table";
import { CourseStatus, ResourceType } from "@prisma/client";
import {
  FileText,
  Video,
  Eye,
  Edit3,
  Save,
  CheckCircle,
  Clock,
  Plus,
  Paperclip,
  Sparkles,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface LessonEditorProps {
  lessonId: string;
  courseId: string;
  initialTitle: string;
  initialContent: string;
  initialMediaUrl?: string | null;
  initialTranscript?: string | null;
  initialDuration: number;
  initialStatus: CourseStatus;
  resources: { id: string; title: string; type: ResourceType; fileUrl: string; fileSize?: number | null }[];
}

export function LessonEditor({
  lessonId,
  courseId,
  initialTitle,
  initialContent,
  initialMediaUrl,
  initialTranscript,
  initialDuration,
  initialStatus,
  resources: initialResources,
}: LessonEditorProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || "");
  const [mediaUrl, setMediaUrl] = useState(initialMediaUrl || "");
  const [transcript, setTranscript] = useState(initialTranscript || "");
  const [duration, setDuration] = useState(initialDuration || 0);
  const [status, setStatus] = useState<CourseStatus>(initialStatus);
  const [resources, setResources] = useState(initialResources);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"SAVED" | "SAVING" | "UNSAVED">("SAVED");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<ResourceType>(ResourceType.PDF_DOCUMENT);
  const [resUrl, setResUrl] = useState("");

  const handleSave = useCallback(
    async (isManual = false) => {
      setAutosaveStatus("SAVING");
      try {
        const res = await updateLessonAction(lessonId, courseId, {
          title,
          content,
          mediaUrl,
          transcript,
          durationMinutes: Number(duration),
          status,
        });

        if (res.success) {
          setAutosaveStatus("SAVED");
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          if (isManual) {
            toast({ type: "success", title: "Lesson Saved", description: "Changes persisted successfully." });
          }
        }
      } catch {
        setAutosaveStatus("UNSAVED");
      }
    },
    [lessonId, courseId, title, content, mediaUrl, transcript, duration, status, toast]
  );

  // Debounced Autosave Effect
  useEffect(() => {
    setAutosaveStatus("UNSAVED");
    const timer = setTimeout(() => {
      handleSave(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [content, mediaUrl, transcript, title, handleSave]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle || !resUrl) return;

    const res = await addResourceAction(lessonId, courseId, {
      title: resTitle,
      type: resType,
      fileUrl: resUrl,
    });

    if (res.success && res.data) {
      toast({ type: "success", title: "Resource Added", description: `Attached ${res.data.title}` });
      setResources((prev) => [res.data, ...prev]);
      setIsResourceModalOpen(false);
      setResTitle("");
      setResUrl("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                autosaveStatus === "SAVED"
                  ? "bg-emerald-500"
                  : autosaveStatus === "SAVING"
                  ? "bg-amber-500 animate-ping"
                  : "bg-red-500"
              }`}
            />
            <span>
              {autosaveStatus === "SAVED"
                ? `Autosaved ${lastSavedAt ? `at ${lastSavedAt}` : ""}`
                : autosaveStatus === "SAVING"
                ? "Autosaving changes..."
                : "Unsaved changes"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`flex items-center gap-1 rounded px-3 py-1 font-medium transition-colors ${
                !isPreviewMode ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Mode
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={`flex items-center gap-1 rounded px-3 py-1 font-medium transition-colors ${
                isPreviewMode ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Student Preview
            </button>
          </div>

          <Button variant="glow" size="sm" leftIcon={<Save className="h-4 w-4" />} onClick={() => handleSave(true)}>
            Save Now
          </Button>
        </div>
      </div>

      {!isPreviewMode ? (
        /* Edit Mode Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content & Video Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  <span>Lesson Title & Rich Text Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Lesson Title
                  </label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson Title..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Content (Supports Markdown & HTML)
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write detailed lesson content, code blocks, and pedagogical explanations here..."
                    rows={12}
                    className="font-mono text-xs leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media & Video Stream */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-400" />
                  <span>Video & Media Stream</span>
                </CardTitle>
                <CardDescription>Embed MP4, Cloudinary stream, or YouTube/Vimeo video links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/demo/video/upload/sample.mp4"
                />

                {mediaUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-border">
                    <video src={mediaUrl} controls className="h-full w-full object-contain" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Video Audio Transcript
                  </label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste spoken audio transcript for AI duplicate detection and search index..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings & Attachments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publishing & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Lesson Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CourseStatus)}
                    className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Duration (Minutes)
                  </label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    leftIcon={<Clock className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resource Attachments Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-emerald-400" />
                  <span>Attachments</span>
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setIsResourceModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {resources.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center">No PDFs or slide decks attached.</p>
                ) : (
                  resources.map((res) => (
                    <div key={res.id} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 text-xs bg-muted/20">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="font-semibold text-foreground truncate">{res.title}</span>
                      </div>
                      <a href={res.fileUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Student Preview Mode */
        <Card className="p-8 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-border pb-4">
            <h1 className="text-3xl font-extrabold text-foreground">{title}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" /> {duration} Minutes
              </span>
              <StatusBadge status={status} />
            </div>
          </div>

          {mediaUrl && (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-border">
              <video src={mediaUrl} controls className="h-full w-full object-contain" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {content}
          </div>

          {resources.length > 0 && (
            <div className="pt-6 border-t border-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Lesson Resource Attachments
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-foreground">{r.title}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Add Resource Modal */}
      <Modal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        title="Attach Lesson Resource"
        description="Upload or link PDF documents, slide decks, or code repositories"
      >
        <form onSubmit={handleAddResource} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Resource Title *
            </label>
            <Input value={resTitle} onChange={(e) => setResTitle(e.target.value)} placeholder="e.g. Lecture Slides PDF" required />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Resource Type
            </label>
            <select
              value={resType}
              onChange={(e) => setResType(e.target.value as ResourceType)}
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none"
            >
              {Object.values(ResourceType).map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Document URL *
            </label>
            <Input value={resUrl} onChange={(e) => setResUrl(e.target.value)} placeholder="https://res.cloudinary.com/..." required />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsResourceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Attach Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
