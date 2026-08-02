"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Archive, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseBulkBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: "PUBLISH" | "ARCHIVE" | "DELETE" | "RESTORE") => void;
  isTrashView?: boolean;
}

export function CourseBulkBar({
  selectedCount,
  onClearSelection,
  onBulkAction,
  isTrashView = false,
}: CourseBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-indigo-500/30 bg-card/95 px-6 py-3 shadow-2xl backdrop-blur-md"
      >
        <span className="text-xs font-semibold text-foreground">
          {selectedCount} {selectedCount === 1 ? "course" : "courses"} selected
        </span>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          {!isTrashView ? (
            <>
              <Button
                size="sm"
                variant="glow"
                leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                onClick={() => onBulkAction("PUBLISH")}
              >
                Bulk Publish
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Archive className="h-3.5 w-3.5" />}
                onClick={() => onBulkAction("ARCHIVE")}
              >
                Bulk Archive
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => onBulkAction("DELETE")}
              >
                Soft Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => onBulkAction("RESTORE")}
              >
                Bulk Restore
              </Button>
            </>
          )}

          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
