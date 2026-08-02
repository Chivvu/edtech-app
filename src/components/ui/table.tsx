import React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className={cn("w-full text-left text-sm text-foreground", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-muted/30", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-medium", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3.5 text-sm", className)} {...props} />;
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    APPROVED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    DRAFT: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    REVIEW_PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    REVISION_REQUIRED: "bg-red-500/10 text-red-400 border-red-500/20",
    AI_AUDIT_PENDING: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const statusStyle = styles[status] || "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        statusStyle,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
