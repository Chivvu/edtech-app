import React from "react";
import Link from "next/link";
import { AlertTriangle, Lock, FileQuestion } from "lucide-react";
import { Button } from "./button";

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section.",
  retryAction,
}: {
  title?: string;
  message?: string;
  retryAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{message}</p>
      {retryAction && (
        <Button variant="outline" size="sm" onClick={retryAction} className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}

export function Forbidden403() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="mb-4 rounded-full bg-amber-500/10 p-4">
        <Lock className="h-10 w-10 text-amber-500" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">403 - Access Denied</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You do not have the required permissions or role to view this page. Contact your Organization Administrator.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
}

export function NotFound404() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="mb-4 rounded-full bg-muted/60 p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">404 - Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The course, page, or resource you are looking for does not exist or has been removed.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button variant="primary">Back to Safety</Button>
      </Link>
    </div>
  );
}
