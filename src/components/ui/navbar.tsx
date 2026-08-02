"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Menu } from "lucide-react";
import { Button } from "./button";
import { NotificationCenter } from "@/features/notifications/components/notification-center";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenMobileSidebar?: () => void;
}

export function Navbar({ onOpenCommandPalette, onOpenMobileSidebar }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile Menu Toggle & Quick Search Launcher */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="md:hidden text-foreground hover:bg-accent"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 rounded-xl border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-indigo-500/50 hover:bg-background"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Search courses, lessons, resources...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Controls (Theme Toggle, Notification Center, User Profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
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

        <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 bg-black/60 shadow-md shadow-purple-500/20">
            <img src="/logo.jpg" alt="Shivam Kumar Logo" className="h-full w-full object-cover" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground">Shivam Kumar</span>
            <span className="text-[10px] text-muted-foreground">Org Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
