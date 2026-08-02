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
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();

  const navigation: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
    { label: "AI Quality Audit", href: "/courses/audit", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Approvals", href: "/courses/review", icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: "Executive Analytics", href: "/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card/60 px-4 py-6 backdrop-blur-md">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md shadow-indigo-500/20">
          EF
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">EduFlow AI</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Internal Intelligence</p>
        </div>
      </div>

      {/* Organization Switcher Pill */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs text-foreground">
        <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
        <div className="flex-1 truncate font-medium">Acme Academy Labs</div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
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
      <div className="border-t border-border/80 pt-4 space-y-3">
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
            <Github className="h-3.5 w-3.5 text-foreground group-hover:scale-110 transition-transform" />
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
            <Linkedin className="h-3.5 w-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </aside>
  );
}
