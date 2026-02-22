import { memo } from "react";
import type { Source } from "@constituicao/shared";
import { MarkdownRenderer } from "./markdown-renderer";
import { SourceCard } from "./source-card";
import { Logo } from "./logo";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export const MessageBubble = memo(function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex animate-fade-in justify-end">
        <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-[14px] leading-relaxed text-primary-foreground">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-in items-start gap-3">
      <Logo size={24} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="prose-assistant text-[14px] leading-[1.8] text-foreground/80">
          <MarkdownRenderer content={content} sources={sources} />
        </div>
        {sources && sources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Fontes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sources.map((source) => (
                <SourceCard key={source.articleNumber} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
