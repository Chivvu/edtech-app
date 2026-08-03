"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getUserNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
} from "../actions/notification.actions";
import { NotificationType } from "@prisma/client";
import { Bell, Sparkles, ShieldCheck, MessageSquare, CheckCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string | null;
  createdAt: Date;
}

export function NotificationCenter() {
  const router = useRouter();
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(() => {
    startTransition(async () => {
      const res = await getUserNotificationsAction(false);
      if (res.success && res.data) {
        setUnreadCount(res.data.unreadCount);
        setNotifications(res.data.notifications);
      }
    });
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    await markAsReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    if (linkUrl) {
      setIsOpen(false);
      router.push(linkUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({ type: "success", title: "Notifications Cleared", description: "All notifications marked as read." });
  };

  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case "COURSE_AUDIT_COMPLETE":
        return <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />;
      case "REVIEW_ASSIGNED":
      case "REVIEW_DECISION":
        return <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "COMMENT_ADDED":
        return <MessageSquare className="h-4 w-4 text-indigo-400 shrink-0" />;
      case "QUALITY_ALERT":
        return <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />;
      default:
        return <Bell className="h-4 w-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      {/* Navbar Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="Notification Center"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-foreground">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/60 p-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.linkUrl)}
                    className={`flex items-start gap-3 p-3 transition-colors cursor-pointer rounded-lg hover:bg-accent ${
                      !notif.isRead ? "bg-indigo-500/5 font-medium" : "opacity-75"
                    }`}
                  >
                    <div className="mt-0.5">{renderIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground truncate">{notif.title}</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
