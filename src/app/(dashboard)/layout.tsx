"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { CommandPalette } from "@/components/ui/command-palette";
import { GeminiAssistantDrawer } from "@/components/ui/gemini-assistant-drawer";

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
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {children}
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
