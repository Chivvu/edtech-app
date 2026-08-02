"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  User,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface ApprovalItem {
  id: string;
  courseId: string;
  title: string;
  author: string;
  reviewer: string;
  status: "REVIEW_PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
  qualityScore: number;
  submittedAt: string;
  modulesCount: number;
  category: string;
}

export default function ApprovalsQueuePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: "app-101",
      courseId: "c-102",
      title: "System Design Essentials & Distributed AI Infrastructure",
      author: "Dr. Aris Thorne",
      reviewer: "Shivam Kumar",
      status: "REVIEW_PENDING",
      qualityScore: 94.8,
      submittedAt: "Today, 10:30 AM",
      modulesCount: 4,
      category: "Software Engineering",
    },
    {
      id: "app-102",
      courseId: "c-103",
      title: "Full-Stack Microservices with Go & Redis HNSW Vector Search",
      author: "Prof. Sarah Jenkins",
      reviewer: "Shivam Kumar",
      status: "REVIEW_PENDING",
      qualityScore: 91.2,
      submittedAt: "Yesterday, 4:15 PM",
      modulesCount: 6,
      category: "Backend Architecture",
    },
    {
      id: "app-103",
      courseId: "c-101",
      title: "Advanced React 19 & Next.js 16 Enterprise Architecture",
      author: "Shivam Kumar",
      reviewer: "Dr. Aris Thorne",
      status: "APPROVED",
      qualityScore: 98.4,
      submittedAt: "2 days ago",
      modulesCount: 6,
      category: "Frontend Engineering",
    },
    {
      id: "app-104",
      courseId: "c-104",
      title: "Legacy Webpack to Turbopack Migration Guide",
      author: "Alex Rivera",
      reviewer: "Shivam Kumar",
      status: "CHANGES_REQUESTED",
      qualityScore: 82.5,
      submittedAt: "3 days ago",
      modulesCount: 3,
      category: "DevOps & Tooling",
    },
  ]);

  const handleAction = (id: string, newStatus: ApprovalItem["status"], title: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    const actionText =
      newStatus === "APPROVED"
        ? "APPROVED & PUBLISHED"
        : newStatus === "CHANGES_REQUESTED"
        ? "REVISIONS REQUESTED"
        : "REJECTED";

    toast({
      type: newStatus === "APPROVED" ? "success" : "info",
      title: `Course Status Updated`,
      description: `"${title}" was marked as ${actionText}.`,
    });
  };

  const filteredApprovals = approvals.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === "REVIEW_PENDING").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Enterprise Approvals Queue
            </h1>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-mono text-amber-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Multi-tier SME governance, peer reviews, and automated AI quality sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setSearch("")} className="text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh Queue
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by course title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          {["ALL", "REVIEW_PENDING", "APPROVED", "CHANGES_REQUESTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {st === "ALL" ? "All" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Course Title & Category</th>
                <th className="p-4">Author / Reviewer</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredApprovals.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-foreground text-sm hover:text-primary transition-colors">
                      <Link href={`/courses/${item.courseId}`}>{item.title}</Link>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.modulesCount} Modules</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <User className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{item.author}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        <span>Rev: {item.reviewer}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-400 text-sm">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{item.qualityScore}%</span>
                    </div>
                  </td>

                  <td className="p-4">
                    {item.status === "REVIEW_PENDING" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                        <Clock className="h-3 w-3 animate-spin" /> Pending Review
                      </span>
                    )}
                    {item.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Approved & Published
                      </span>
                    )}
                    {item.status === "CHANGES_REQUESTED" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 text-[11px] font-semibold text-purple-400">
                        <AlertCircle className="h-3 w-3" /> Revisions Requested
                      </span>
                    )}
                    {item.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-rose-400">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-muted-foreground text-[11px]">{item.submittedAt}</td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/courses/${item.courseId}/review`}
                        className="p-1.5 rounded-lg border border-border hover:bg-accent text-foreground transition-colors"
                        title="View Audit Details"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      {item.status === "REVIEW_PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction(item.id, "APPROVED", item.title)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(item.id, "CHANGES_REQUESTED", item.title)}
                            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs px-2.5"
                          >
                            Revisions
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
