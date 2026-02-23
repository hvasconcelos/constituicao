"use client";

import type { Source } from "@constituicao/shared";
import type { Message } from "ai";
import { useEffect, useRef } from "react";
import { Logo } from "./logo";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  sourcesMap: Record<string, Source[]>;
  isLoading: boolean;
}

export function MessageList({
  messages,
  sourcesMap,
  isLoading,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <MessageBubble
              role={message.role as "user" | "assistant"}
              content={message.content}
              sources={
                message.role === "assistant"
                  ? sourcesMap[message.id]
                  : undefined
              }
            />
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-start gap-3">
            <Logo size={24} className="shrink-0" />
            <div className="flex items-center gap-1 pt-1">
              <span
                className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground"
                style={{ animationDelay: "200ms" }}
              />
              <span
                className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground"
                style={{ animationDelay: "400ms" }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
