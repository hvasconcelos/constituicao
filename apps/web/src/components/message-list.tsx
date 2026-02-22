"use client";

import { useEffect, useRef } from "react";
import type { Message } from "ai";
import type { Source } from "@constituicao/shared";
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
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={message.content}
            sources={
              message.role === "assistant" ? sourcesMap[message.id] : undefined
            }
          />
        ))}
        {isLoading &&
          messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-950">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <div className="flex items-center gap-1 pt-1">
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neutral-400"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neutral-400"
                  style={{ animationDelay: "200ms" }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neutral-400"
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
