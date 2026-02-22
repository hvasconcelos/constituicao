"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Source } from "@constituicao/shared";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

const suggestions = [
  "O que diz a Constituição sobre a liberdade de expressão?",
  "Quais são os direitos fundamentais dos trabalhadores?",
  "Como funciona a revisão constitucional?",
  "Quais os poderes do Presidente da República?",
];

export function Chat() {
  const [sourcesMap, setSourcesMap] = useState<Record<string, Source[]>>({});
  const pendingSources = useRef<Source[] | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
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

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          {/* Logo + title */}
          <div
            className="animate-fade-in-up mb-8 flex flex-col items-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h2 className="mb-1.5 text-lg font-semibold tracking-tight text-neutral-950">
              Constituição Portuguesa
            </h2>
            <p className="max-w-sm text-center text-[13px] leading-relaxed text-neutral-500">
              Faça uma pergunta sobre a Constituição da República Portuguesa.
            </p>
          </div>

          {/* Centered input */}
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up w-full max-w-2xl opacity-0"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm transition-colors focus-within:border-neutral-400">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte algo sobre a Constituição..."
                disabled={isLoading}
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] text-neutral-950 outline-none placeholder:text-neutral-400 disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-neutral-950 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div
            className="animate-fade-in-up mt-4 flex max-w-2xl flex-wrap justify-center gap-2 opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            {suggestions.map((q) => (
              <button
                key={q}
                onClick={() => append({ role: "user", content: q })}
                className="cursor-pointer rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[12px] text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="animate-fade-in border-t border-neutral-100 px-4 py-4 opacity-0" style={{ animationDelay: "300ms" }}>
          <div className="mx-auto flex max-w-2xl items-center justify-center gap-1.5 text-[12px] text-neutral-400">
            <a
              href="https://www.parlamento.pt/Legislacao/Paginas/ConstituicaoRepublicaPortuguesa.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-600"
            >
              Constituição da República Portuguesa
            </a>
            <span>·</span>
            <span>Projeto open source</span>
          </div>
        </footer>
      </div>
    );
  }

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
