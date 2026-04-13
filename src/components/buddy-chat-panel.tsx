"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Relation } from "@/lib/types";

type ChatMessage = {
  id: string;
  buddyId: string;
  sender: "me" | "buddy" | "system";
  content: string;
  createdAt: string;
};

type InviteStatus = "idle" | "pending" | "accepted";

export function BuddyChatPanel({ relations }: { relations: Relation[] }) {
  const [activeBuddyId, setActiveBuddyId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [inviteStatus, setInviteStatus] = useState<Record<string, InviteStatus>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed-1",
      buddyId: relations[0]?.id ?? "",
      sender: "buddy",
      content: "晚上一起做个番茄牛腩吗？",
      createdAt: "18:40"
    },
    {
      id: "seed-2",
      buddyId: relations[1]?.id ?? "",
      sender: "buddy",
      content: "你周末有空一起视频做饭吗？",
      createdAt: "16:12"
    }
  ]);

  const activeBuddy = relations.find((buddy) => buddy.id === activeBuddyId) ?? null;

  const chatMessages = useMemo(() => {
    if (!activeBuddy) return [];
    return messages.filter((message) => message.buddyId === activeBuddy.id);
  }, [messages, activeBuddy]);

  const sendMessage = () => {
    if (!draft.trim() || !activeBuddy) return;
    const now = new Date();
    const createdAt = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        buddyId: activeBuddy.id,
        sender: "me",
        content: draft.trim(),
        createdAt
      }
    ]);
    setDraft("");
  };

  const inviteVideoCook = () => {
    if (!activeBuddy) return;

    setInviteStatus((prev) => ({ ...prev, [activeBuddy.id]: "pending" }));
    setMessages((prev) => [
      ...prev,
      {
        id: `invite-${Date.now()}`,
        buddyId: activeBuddy.id,
        sender: "system",
        content: "你发起了视频做饭邀请，等待对方加入...",
        createdAt: "刚刚"
      }
    ]);

    window.setTimeout(() => {
      setInviteStatus((prev) => ({ ...prev, [activeBuddy.id]: "accepted" }));
      setMessages((prev) => [
        ...prev,
        {
          id: `accept-${Date.now()}`,
          buddyId: activeBuddy.id,
          sender: "system",
          content: `${activeBuddy.name} 已接受邀请，视频做饭已开始。`,
          createdAt: "刚刚"
        }
      ]);
    }, 1200);
  };

  const getLastMessage = (buddyId: string) => {
    const chat = messages.filter((message) => message.buddyId === buddyId);
    return chat[chat.length - 1];
  };

  if (!activeBuddy) {
    return (
      <section className="space-y-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">聊天会话</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {relations.map((buddy) => {
              const lastMessage = getLastMessage(buddy.id);
              return (
                <button
                  key={buddy.id}
                  type="button"
                  onClick={() => setActiveBuddyId(buddy.id)}
                  className="w-full rounded-xl border bg-white p-3 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{buddy.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{buddy.identity}</p>
                    </div>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{lastMessage?.createdAt ?? ""}</span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm text-[hsl(var(--muted-foreground))]">
                    {lastMessage?.content ?? buddy.note ?? "点击开始聊天"}
                  </p>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </section>
    );
  }

  const status = inviteStatus[activeBuddy.id] ?? "idle";

  return (
    <section className="space-y-3">
      <Card className="overflow-hidden">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveBuddyId(null)}
              className="inline-flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]"
            >
              <ArrowLeft className="h-4 w-4" /> 返回
            </button>
            <CardTitle className="text-base">{activeBuddy.name}</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={inviteVideoCook}>
              <Video className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {status === "idle" && (activeBuddy.note ?? `${activeBuddy.identity} · 关联好友`)}
            {status === "pending" && "邀请已发送，等待对方加入"}
            {status === "accepted" && "视频做饭进行中"}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 p-0">
          <div className="max-h-[52vh] space-y-2 overflow-y-auto bg-[hsl(var(--secondary))] p-3">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">还没有聊天内容，发条消息开始吧。</p>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    message.sender === "me"
                      ? "ml-10 bg-[hsl(var(--primary))] text-white"
                      : message.sender === "system"
                        ? "mx-6 bg-white text-[hsl(var(--muted-foreground))]"
                        : "mr-10 bg-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-[10px] opacity-70">{message.createdAt}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 border-t bg-white p-3">
            <Input
              placeholder="发消息..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
            />
            <Button type="button" size="sm" onClick={sendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
