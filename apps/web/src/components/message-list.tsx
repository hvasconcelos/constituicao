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

const exampleQuestions = [
  "O que diz a Constituição sobre a liberdade de expressão?",
  "Quais são os direitos fundamentais dos trabalhadores?",
  "O que é o direito à vida segundo a Constituição?",
  "Como funciona a revisão constitucional?",
];

export function MessageList({
  messages,
  sourcesMap,
  isLoading,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-2xl font-bold text-white">
          CRP
        </div>
        <h2 className="mb-2 text-xl font-semibold">
          Constituição da República Portuguesa
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Faça uma pergunta sobre a Constituição Portuguesa e receba uma
          resposta fundamentada nos artigos constitucionais.
        </p>
        <div className="grid w-full max-w-md gap-2">
          {exampleQuestions.map((q) => (
            <div
              key={q}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-700"
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-3xl space-y-4">
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
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-400">
                A pensar...
              </div>
            </div>
          )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
