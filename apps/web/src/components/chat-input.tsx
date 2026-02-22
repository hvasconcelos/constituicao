"use client";

import type { FormEvent, ChangeEvent } from "react";

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
    <div className="border-t border-neutral-200 bg-white px-4 py-3">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2"
      >
        <textarea
          value={input}
          onChange={onInputChange}
          placeholder="Faça uma pergunta sobre a Constituição..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                onSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-neutral-950 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            width="16"
            height="16"
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
      </form>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-neutral-400">
        As respostas são geradas com base nos artigos da Constituição da
        República Portuguesa.
      </p>
    </div>
  );
}
