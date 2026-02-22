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
    <div className="border-t border-gray-200 bg-white px-4 py-3">
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
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:opacity-50"
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
          className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
