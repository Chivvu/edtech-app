"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { reorderModulesAction, createModuleAction, deleteModuleAction } from "../actions/module.actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/table";
import { GripVertical, Plus, Clock, FileText, Trash2, Edit3, ChevronRight, Layers } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface ModuleItemData {
  id: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  status: string;
  durationMinutes?: number | null;
  lessons: {
    id: string;
    title: string;
    orderIndex: number;
    _count: { resources: number; assignments: number; quizzes: number };
  }[];
}

interface ModuleListProps {
  courseId: string;
  initialModules: ModuleItemData[];
}

export function ModuleList({ courseId, initialModules }: ModuleListProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [modules, setModules] = useState<ModuleItemData[]>(initialModules);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState(30);

  // Optimistic UI updates for drag-and-drop reordering
  const [optimisticModules, setOptimisticModules] = useOptimistic(
    modules,
    (state, newOrder: ModuleItemData[]) => newOrder
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const reordered = Array.from(optimisticModules);
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(destIndex, 0, removed);

    const updatedOrders = reordered.map((mod, idx) => ({
      ...mod,
      orderIndex: idx,
    }));

    startTransition(async () => {
      setOptimisticModules(updatedOrders);
      setModules(updatedOrders);

      const res = await reorderModulesAction({
        courseId,
        moduleOrders: updatedOrders.map((m) => ({ id: m.id, orderIndex: m.orderIndex })),
      });

      if (!res.success) {
        toast({ type: "error", title: "Reorder Error", description: "Failed to persist new module order." });
        setModules(initialModules);
      } else {
        toast({ type: "success", title: "Modules Reordered", description: "Module hierarchy updated." });
      }
    });
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    startTransition(async () => {
      const res = await createModuleAction(courseId, {
        title: newTitle,
        description: newDescription,
        durationMinutes: Number(newDuration),
        status: "DRAFT" as any,
        objectives: [],
      });

      if (res.success && res.data) {
        toast({ type: "success", title: "Module Created", description: `Added ${res.data.title}` });
        setModules((prev) => [
          ...prev,
          {
            id: res.data.id,
            title: res.data.title,
            description: res.data.description,
            orderIndex: res.data.orderIndex,
            status: res.data.status,
            durationMinutes: res.data.durationMinutes,
            lessons: [],
          },
        ]);
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewDescription("");
      }
    });
  };

  const handleDeleteModule = async (moduleId: string) => {
    startTransition(async () => {
      const res = await deleteModuleAction(moduleId, courseId);
      if (res.success) {
        toast({ type: "warning", title: "Module Deleted", description: "Module moved to trash." });
        setModules((prev) => prev.filter((m) => m.id !== moduleId));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Curriculum Modules ({optimisticModules.length})</span>
        </h3>

        <Button
          size="sm"
          variant="glow"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Module
        </Button>
      </div>

      {optimisticModules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
          <p className="text-xs text-muted-foreground">No modules created yet. Add your first module to begin structuring lessons.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules-droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {optimisticModules.map((mod, index) => (
                  <Draggable key={mod.id} draggableId={mod.id} index={index}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={`group rounded-xl border border-border bg-card p-4 transition-all ${
                          snapshot.isDragging ? "shadow-2xl border-indigo-500 scale-[1.01] bg-card/95" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Drag Handle */}
                          <div
                            {...dragProvided.dragHandleProps}
                            className="mt-1 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-indigo-400">
                                  Module {index + 1}:
                                </span>
                                <h4 className="text-sm font-bold text-foreground truncate">{mod.title}</h4>
                                <StatusBadge status={mod.status} />
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteModule(mod.id)}
                                  title="Delete Module"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            </div>

                            {mod.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/60">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-purple-400" /> {mod.durationMinutes || 0} mins
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-emerald-400" /> {mod.lessons.length} Lessons
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add Module Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Curriculum Module"
        description="Insert a new module into the course hierarchy"
      >
        <form onSubmit={handleCreateModule} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Module Title *
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Module 1: Architectural Foundations"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Description / Learning Outcomes
            </label>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe what learners will achieve in this module..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Estimated Duration (Minutes)
            </label>
            <Input
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" isLoading={isPending}>
              Create Module
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
