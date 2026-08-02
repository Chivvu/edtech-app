import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 1, className, children, ...props }: HeadingProps) {
  const Component = `h${level}` as React.ElementType;
  const styles = {
    1: "text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground",
    2: "text-2xl font-bold tracking-tight text-foreground",
    3: "text-xl font-semibold tracking-tight text-foreground",
    4: "text-lg font-semibold tracking-tight text-foreground",
    5: "text-base font-medium text-foreground",
    6: "text-sm font-medium text-foreground",
  };

  return (
    <Component className={cn(styles[level], className)} {...props}>
      {children}
    </Component>
  );
}

export function Text({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-foreground/90 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function Lead({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-base sm:text-lg text-muted-foreground leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function Muted({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-xs text-muted-foreground", className)} {...props}>
      {children}
    </span>
  );
}

export function Code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground border border-border",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
