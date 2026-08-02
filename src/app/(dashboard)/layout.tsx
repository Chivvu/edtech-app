"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { CommandPalette } from "@/components/ui/command-palette";
import { GeminiAssistantDrawer } from "@/components/ui/gemini-assistant-drawer";
import { Github, Linkedin, Heart, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Main Navigation Sidebar */}
          <Sidebar />

          {/* Core App Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between">
              <div>{children}</div>

              {/* Attractive Dashboard Footer */}
              <footer className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    EduFlow AI
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-blue-500/20">
                      <Sparkles className="h-2.5 w-2.5" />
                      v1.0
                    </span>
                  </span>
                  <span>•</span>
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
                    <Github className="h-3.5 w-3.5" />
                    <span>@Chivvu</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/shivam-kumar-006393315?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" />
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

        {/* Global Google Gemini AI Assistant Floating Drawer */}
        <GeminiAssistantDrawer />
      </ToastProvider>
    </ThemeProvider>
  );
}
