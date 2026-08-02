"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CourseFormInput, CourseFormSchema, DifficultyLevels, Languages, Visibilities } from "@/features/courses/validations/course.schema";
import { createCourseAction } from "@/features/courses/actions/course.actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/toast";
import { BookOpen, Sparkles, Image, Clock, Shield, ArrowLeft } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAudience: "",
      thumbnailUrl: "",
      difficulty: "INTERMEDIATE",
      language: "ENGLISH",
      durationMinutes: 60,
      objectives: [],
      prerequisites: [],
      visibility: "INTERNAL_ONLY",
      tagIds: [],
    },
  });

  const onSubmit = async (data: CourseFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await createCourseAction(data);
      if (res.success && res.data) {
        toast({
          type: "success",
          title: "Course Created Successfully",
          description: `Created ${res.data.title}. You can now add modules & lessons.`,
        });
        router.push(`/courses/${res.data.id}`);
      } else {
        toast({
          type: "error",
          title: "Failed to Create Course",
          description: res.error || "Please check form inputs.",
        });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "An unexpected network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <Breadcrumb items={[{ label: "Courses", href: "/courses" }, { label: "Create Course" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create New Educational Course
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Initialize course metadata, pedagogical targets, and access permissions.
          </p>
        </div>

        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>General Details & Title</span>
            </CardTitle>
            <CardDescription>Primary identification for institutional learning management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Course Title *
              </label>
              <Input
                {...register("title")}
                placeholder="e.g. Advanced Distributed Systems Engineering"
                error={errors.title?.message as string}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Course Summary / Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Provide a comprehensive summary of curriculum content and outcomes..."
                rows={4}
                error={errors.description?.message as string}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Target Audience
              </label>
              <Input
                {...register("targetAudience")}
                placeholder="e.g. Senior Software Engineers, DevOps Engineers"
                error={errors.targetAudience?.message as string}
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Metadata & Attributes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Pedagogical Attributes & Specifications</span>
            </CardTitle>
            <CardDescription>Configure difficulty level, language, and estimated completion duration</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Difficulty Level
              </label>
              <select
                {...register("difficulty")}
                className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none"
              >
                {DifficultyLevels.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Primary Language
              </label>
              <select
                {...register("language")}
                className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none"
              >
                {Languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Duration (Minutes)
              </label>
              <Input
                type="number"
                {...register("durationMinutes")}
                leftIcon={<Clock className="h-4 w-4" />}
                error={errors.durationMinutes?.message as string}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Thumbnail Image URL (Cloudinary / CDN)
              </label>
              <Input
                {...register("thumbnailUrl")}
                placeholder="https://res.cloudinary.com/..."
                leftIcon={<Image className="h-4 w-4" />}
                error={errors.thumbnailUrl?.message as string}
              />
            </div>
          </CardContent>
        </Card>

        {/* Governance & Access Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Governance & Visibility Scope</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Visibility Scope
              </label>
              <select
                {...register("visibility")}
                className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none"
              >
                {Visibilities.map((v) => (
                  <option key={v} value={v}>
                    {v.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="glow" isLoading={isSubmitting}>
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
