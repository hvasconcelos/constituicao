import type { Source } from "@constituicao/shared";
import { SourceCard } from "./source-card";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] rounded-2xl bg-neutral-950 px-4 py-2.5 text-[14px] leading-relaxed text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-950 mt-0.5">
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
      <div className="min-w-0 flex-1 space-y-3">
        <div className="text-[14px] leading-relaxed text-neutral-800 whitespace-pre-wrap">
          {content}
        </div>
        {sources && sources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
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
}
