import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}>
      <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
