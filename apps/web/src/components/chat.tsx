"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import type { Source } from "@constituicao/shared";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

export function Chat() {
  const [sourcesMap, setSourcesMap] = useState<Record<string, Source[]>>({});
  const pendingSources = useRef<Source[] | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      onResponse: async (response) => {
        const sourcesHeader = response.headers.get("X-Sources");
        if (sourcesHeader) {
          try {
            const sources: Source[] = JSON.parse(
              decodeURIComponent(sourcesHeader)
            );
            pendingSources.current = sources;
          } catch {
            // Ignore parse errors
          }
        }
      },
      onFinish: (message) => {
        if (pendingSources.current) {
          setSourcesMap((prev) => ({
            ...prev,
            [message.id]: pendingSources.current!,
          }));
          pendingSources.current = null;
        }
      },
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList
        messages={messages}
        sourcesMap={sourcesMap}
        isLoading={isLoading}
      />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
