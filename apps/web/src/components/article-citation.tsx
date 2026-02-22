"use client";

import type { Source } from "@constituicao/shared";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ArticleCitationProps {
  label: string;
  source: Source | null;
}

export function ArticleCitation({ label, source }: ArticleCitationProps) {
  if (!source) {
    return (
      <span className="font-semibold text-foreground underline underline-offset-2">
        {label}
      </span>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70">
          {label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80 p-0">
        <div className="space-y-2 p-4">
          <div className="space-y-1">
            <p className="font-mono text-[12px] font-semibold">
              Artigo {source.articleNumber}.º
            </p>
            <p className="text-[13px] font-medium text-foreground">
              {source.title}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {source.hierarchy}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto border-t border-border pt-2">
            <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground/80">
              {source.text}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
