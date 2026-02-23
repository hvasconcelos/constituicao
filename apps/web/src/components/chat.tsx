"use client";

import { useChat } from "@ai-sdk/react";
import type { Source } from "@constituicao/shared";
import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInput } from "./chat-input";
import { ArrowUpIcon } from "./icons";
import { Logo } from "./logo";
import { MessageList } from "./message-list";
import { PortugueseFlag } from "./portuguese-flag";

const suggestions = [
  "O que diz a Constituição sobre a liberdade de expressão?",
  "Quais são os direitos fundamentais dos trabalhadores?",
  "Como funciona a revisão constitucional?",
  "Quais os poderes do Presidente da República?",
];

interface ChatProps {
  onConversationChange?: (hasMessages: boolean, resetFn: () => void) => void;
}

export function Chat({ onConversationChange }: ChatProps) {
  const [sourcesMap, setSourcesMap] = useState<Record<string, Source[]>>({});
  const pendingSources = useRef<Source[] | null>(null);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
    onResponse: async (response) => {
      const sourcesHeader = response.headers.get("X-Sources");
      if (sourcesHeader) {
        try {
          const sources: Source[] = JSON.parse(
            decodeURIComponent(sourcesHeader),
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
          [message.id]: pendingSources.current as Source[],
        }));
        pendingSources.current = null;
      }
    },
  });

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setSourcesMap({});
    pendingSources.current = null;
  }, [setMessages]);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    onConversationChange?.(hasMessages, handleNewChat);
  }, [hasMessages, onConversationChange, handleNewChat]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          {/* Logo + title */}
          <div className="animate-fade-in-up mb-8 flex flex-col items-center">
            <Logo size={48} className="mb-4" />
            <div className="mb-1.5 flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Constituição da República Portuguesa
              </h2>
              <PortugueseFlag size={22} />
            </div>
            <p className="max-w-sm text-center text-[13px] leading-relaxed text-muted-foreground">
              Faça uma pergunta sobre a Constituição da República Portuguesa.
            </p>
          </div>

          {/* Centered input */}
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up w-full max-w-2xl opacity-0"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 shadow-sm transition-colors focus-within:border-ring">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte algo sobre a Constituição..."
                disabled={isLoading}
                rows={3}
                className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-[14px] shadow-none outline-none [field-sizing:fixed] focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }
                  }
                }}
              />
              <Button
                type="submit"
                size="icon-sm"
                disabled={isLoading || !input.trim()}
              >
                <ArrowUpIcon size={14} />
              </Button>
            </div>
          </form>

          {/* Suggestions */}
          <div
            className="animate-fade-in-up mt-4 flex max-w-2xl flex-wrap justify-center gap-2 opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            {suggestions.map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                onClick={() => append({ role: "user", content: q })}
                className="h-auto rounded-full px-3.5 py-1.5 text-[12px] font-normal text-muted-foreground hover:text-foreground"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="animate-fade-in border-t border-border px-4 py-4 opacity-0"
          style={{ animationDelay: "300ms" }}
        >
          <div className="relative flex items-center text-[12px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                Sponsors
              </span>
              <a
                href="https://layerx.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 transition-opacity hover:opacity-100"
              >
                <img
                  src="/sponsors/layerx.svg"
                  alt="LayerX"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://luzia.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 transition-opacity hover:opacity-100"
              >
                <img
                  src="/sponsors/luzia-logo.jpg"
                  alt="Luzia"
                  className="h-5 w-5 rounded"
                />
              </a>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
              <PortugueseFlag size={14} />
              <a
                href="https://www.parlamento.pt/Legislacao/Paginas/ConstituicaoRepublicaPortuguesa.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
              >
                Constituição da República Portuguesa
              </a>
              <a
                href="https://github.com/hvasconcelos/constituicao"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
              >
                Projeto Open Source
              </a>
              <span>·</span>
              <span>&copy; 2026</span>
            </div>
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
