"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { globalSearchAction } from "@/features/search/actions/search.actions";
import { SearchResultItem } from "@/features/search/services/search.service";
import { Search, BookOpen, FileText, Paperclip, Tag, Folder, Clock, Sparkles } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load Recent Searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eduflow_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live Autocomplete Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await globalSearchAction(query, entityFilter);
        if (res.success && res.data) {
          setSearchResults(res.data.results);
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query, entityFilter]);

  const handleSelectResult = (url: string, title: string) => {
    // Persist to recent searches
    const updated = [title, ...recentSearches.filter((s) => s !== title)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("eduflow_recent_searches", JSON.stringify(updated));
    } catch {}

    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  const renderResultIcon = (type: string) => {
    switch (type) {
      case "COURSE":
        return <BookOpen className="h-4 w-4 text-indigo-400" />;
      case "LESSON":
        return <FileText className="h-4 w-4 text-purple-400" />;
      case "RESOURCE":
        return <Paperclip className="h-4 w-4 text-emerald-400" />;
      case "CATEGORY":
        return <Folder className="h-4 w-4 text-blue-400" />;
      case "TAG":
        return <Tag className="h-4 w-4 text-amber-400" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-md">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-10">
        <Command className="w-full">
          {/* Input & Filter Bar */}
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-3" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Type a command or search courses, lessons, resources, tags..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px]">
              {["ALL", "COURSE", "LESSON", "RESOURCE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setEntityFilter(f)}
                  className={`rounded px-2 py-0.5 font-semibold transition-colors ${
                    entityFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 space-y-2">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
              {query ? "No matching course intelligence assets found." : "Start typing to search..."}
            </Command.Empty>

            {/* Live Autocomplete Results */}
            {searchResults.length > 0 && (
              <Command.Group heading="Global Intelligence Results" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {searchResults.map((res) => (
                  <Command.Item
                    key={res.id}
                    onSelect={() => handleSelectResult(res.url, res.title)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {renderResultIcon(res.type)}
                      <div className="truncate">
                        <span className="font-bold text-foreground block truncate">{res.title}</span>
                        {res.subtitle && <span className="text-[11px] text-muted-foreground block truncate">{res.subtitle}</span>}
                      </div>
                    </div>

                    {res.badge && (
                      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase border border-border">
                        {res.badge}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <Command.Group heading="Recent Searches" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {recentSearches.map((s, idx) => (
                  <Command.Item
                    key={idx}
                    onSelect={() => setQuery(s)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-accent cursor-pointer transition-colors text-muted-foreground"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{s}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation Quick Shortcuts */}
            {!query && (
              <Command.Group heading="Quick Navigation Shortcuts" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Command.Item
                  onSelect={() => handleSelectResult("/dashboard", "Dashboard")}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-accent cursor-pointer transition-colors text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Go to Executive Dashboard</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelectResult("/courses", "Courses")}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-accent cursor-pointer transition-colors text-foreground"
                >
                  <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                  <span>Go to Course Repository</span>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            <span>Use ↑↓ keys to navigate, ESC to dismiss</span>
            <span className="font-mono">⌘K Launcher</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
