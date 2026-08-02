"use client";

import React, { useState, useTransition } from "react";
import { createCommentAction, toggleResolveAction } from "../actions/comment.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, CheckCircle, Reply, AtSign, Smile, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface CommentItemData {
  id: string;
  comment: string;
  resolved: boolean;
  createdAt: Date;
  user: { id: string; name: string; email: string; avatarUrl?: string | null };
  replies: {
    id: string;
    comment: string;
    resolved: boolean;
    createdAt: Date;
    user: { id: string; name: string; email: string; avatarUrl?: string | null };
  }[];
}

interface ThreadedCommentsProps {
  reviewId: string;
  initialComments: CommentItemData[];
}

export function ThreadedComments({ reviewId, initialComments }: ThreadedCommentsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [comments, setComments] = useState<CommentItemData[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleCreateTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    startTransition(async () => {
      const res = await createCommentAction({
        reviewId,
        comment: newComment,
        mentions: [],
      });

      if (res.success && res.data) {
        toast({ type: "success", title: "Comment Posted", description: "Feedback recorded in review thread." });
        setComments((prev) => [
          ...prev,
          {
            id: res.data.id,
            comment: res.data.comment,
            resolved: res.data.resolved,
            createdAt: res.data.createdAt,
            user: res.data.user,
            replies: [],
          },
        ]);
        setNewComment("");
      }
    });
  };

  const handleCreateReply = (parentId: string) => {
    if (!replyText.trim()) return;

    startTransition(async () => {
      const res = await createCommentAction({
        reviewId,
        comment: replyText,
        parentId,
        mentions: [],
      });

      if (res.success && res.data) {
        toast({ type: "success", title: "Reply Added", description: "Thread reply posted." });
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? {
                  ...c,
                  replies: [...c.replies, res.data],
                }
              : c
          )
        );
        setActiveReplyId(null);
        setReplyText("");
      }
    });
  };

  const handleToggleResolve = async (commentId: string, currentResolved: boolean) => {
    const nextResolved = !currentResolved;
    const res = await toggleResolveAction(commentId, nextResolved);

    if (res.success) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, resolved: nextResolved } : c))
      );
      toast({
        type: "success",
        title: nextResolved ? "Comment Resolved" : "Comment Re-opened",
        description: nextResolved ? "Thread marked as resolved." : "Thread reopened for discussion.",
      });
    }
  };

  const addEmoji = (emoji: string, isReply = false) => {
    if (isReply) {
      setReplyText((prev) => prev + " " + emoji);
    } else {
      setNewComment((prev) => prev + " " + emoji);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <span>Real-time Threaded Review Collaboration ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top-Level Comment Form */}
        <form onSubmit={handleCreateTopComment} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Post a review comment or tag team members with @username..."
            rows={3}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {["👍", "❤️", "💡", "🎉", "⚠️"].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => addEmoji(e)}
                  className="rounded p-1 text-sm hover:bg-accent hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>

            <Button type="submit" variant="glow" size="sm" isLoading={isPending} leftIcon={<Send className="h-3.5 w-3.5" />}>
              Post Comment
            </Button>
          </div>
        </form>

        {/* Thread List */}
        <div className="space-y-4 pt-4 border-t border-border">
          {comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No review comments yet. Start the conversation!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-xl border p-4 transition-all ${
                  comment.resolved ? "border-border bg-card/40 opacity-70" : "border-border bg-card"
                }`}
              >
                {/* Main Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                      {comment.user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-foreground">{comment.user.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleResolve(comment.id, comment.resolved)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                      comment.resolved
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{comment.resolved ? "Resolved" : "Resolve"}</span>
                  </button>
                </div>

                <p className="text-xs text-foreground mt-2 pl-9">{comment.comment}</p>

                {/* Reply Trigger */}
                <div className="mt-2 pl-9">
                  <button
                    onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:underline"
                  >
                    <Reply className="h-3 w-3" /> Reply ({comment.replies.length})
                  </button>
                </div>

                {/* Nested Replies List */}
                {comment.replies.length > 0 && (
                  <div className="mt-3 pl-9 space-y-2 border-l-2 border-border/60 ml-9 pt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="rounded-lg bg-muted/30 p-2.5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-foreground">{reply.user.name}</span>
                          <span className="text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-foreground">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Reply Drawer Form */}
                {activeReplyId === comment.id && (
                  <div className="mt-3 pl-9 space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.user.name}...`}
                      rows={2}
                      className="text-xs"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {["👍", "❤️", "💡"].map((e) => (
                          <button key={e} type="button" onClick={() => addEmoji(e, true)} className="text-xs hover:scale-125 transition-transform">
                            {e}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setActiveReplyId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" variant="glow" isLoading={isPending} onClick={() => handleCreateReply(comment.id)}>
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
