import type { Source } from "@constituicao/shared";
import { SourceCard } from "./source-card";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-green-700 text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
            <p className="text-xs font-medium text-gray-500">
              Fontes consultadas:
            </p>
            {sources.map((source) => (
              <SourceCard
                key={source.articleNumber}
                source={source}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
