"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/header";
import { Chat } from "@/components/chat";

export function ChatPage() {
  const [showNewChat, setShowNewChat] = useState(false);
  const [resetFn, setResetFn] = useState<(() => void) | null>(null);

  const handleConversationChange = useCallback(
    (hasMessages: boolean, reset: () => void) => {
      setShowNewChat(hasMessages);
      setResetFn(() => reset);
    },
    []
  );

  return (
    <div className="flex h-dvh flex-col">
      <Header
        showNewChat={showNewChat}
        onNewChat={resetFn ?? undefined}
      />
      <Chat onConversationChange={handleConversationChange} />
    </div>
  );
}
