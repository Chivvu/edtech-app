"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { CommandPalette } from "@/components/ui/command-palette";
import { CopilotSidePanel } from "@/components/ui/copilot-side-panel";
import { Heart, Sparkles } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Main Navigation Sidebar (Desktop persistent + Mobile drawer) */}
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Core App Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <Navbar
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between overflow-x-hidden">
              <div>{children}</div>

              {/* Responsive Dashboard Footer */}
              <footer className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    EduFlow AI
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-blue-500/20">
                      <Sparkles className="h-2.5 w-2.5" />
                      v1.0
                    </span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> by{" "}
                    <strong className="text-foreground font-medium">Shivam Kumar</strong>
                  </span>
                </div>

                {/* Social Connect Badges */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Chivvu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>@Chivvu</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/shivam-kumar-006393315?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5 text-blue-400" />
                    <span>Shivam Kumar</span>
                  </a>
                </div>
              </footer>
            </main>
          </div>
        </div>

        {/* Global Command Palette Modal */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />

        {/* Premium AI Copilot Glass Side Panel (Inspired by GitHub Copilot & Cursor AI) */}
        <CopilotSidePanel />
      </ToastProvider>
    </ThemeProvider>
  );
}
