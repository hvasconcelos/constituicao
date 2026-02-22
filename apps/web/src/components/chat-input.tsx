"use client";

import type { FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon } from "./icons";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={onInputChange}
          placeholder="Faça uma pergunta sobre a Constituição..."
          disabled={isLoading}
          rows={1}
          className="min-h-0 flex-1 resize-none text-[14px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                onSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
        >
          <ArrowUpIcon size={16} />
        </Button>
      </form>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        As respostas são geradas com base nos artigos da Constituição da
        República Portuguesa.
      </p>
    </div>
  );
}
