"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { NotificationCenter } from "@/features/notifications/components/notification-center";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      {/* Quick Search Launcher */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 rounded-xl border border-input bg-background/50 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-indigo-500/50 hover:bg-background"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Search courses, lessons, resources...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Controls (Theme Toggle, Notification Center, User Profile) */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
        </Button>

        {/* Real-time Notification Center */}
        <NotificationCenter />

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 bg-black/60 shadow-md shadow-purple-500/20">
            <img src="/logo.jpg" alt="Shivam Kumar Logo" className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground">Shivam Kumar</span>
            <span className="text-[10px] text-muted-foreground">Org Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
