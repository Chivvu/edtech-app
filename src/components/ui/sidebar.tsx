"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
    { label: "AI Quality Audit", href: "/courses/audit", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Approvals", href: "/courses/review", icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: "Executive Analytics", href: "/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/95 px-4 py-6 backdrop-blur-md">
      {/* Brand Header */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-purple-500/30 bg-black/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform duration-300 hover:scale-105">
            <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1">
              EduFlow <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Course Intelligence</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Organization Switcher Pill */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs text-foreground">
        <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
        <div className="flex-1 truncate font-medium">Acme Academy Labs</div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onMobileClose?.()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Role Status & Social Links */}
      <div className="border-t border-border/80 pt-4 space-y-3 shrink-0">
        <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="block font-medium text-foreground text-xs">Designed by Shivam Kumar</span>
            <span className="text-[10px] text-muted-foreground opacity-80">Tenant Verified</span>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <a
            href="https://github.com/Chivvu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:border-indigo-500/40 transition-all duration-200 group"
            title="GitHub Profile"
          >
            <GithubIcon className="h-3.5 w-3.5 text-foreground group-hover:scale-110 transition-transform" />
            <span>GitHub</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
          </a>

          <a
            href="https://www.linkedin.com/in/shivam-kumar-006393315?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200 group"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="h-3.5 w-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onMobileClose}
          />
          {/* Drawer Content */}
          <div className="relative z-10 flex h-full animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
