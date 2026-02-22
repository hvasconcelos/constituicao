import type { Source } from "@constituicao/shared";
import { Badge } from "@/components/ui/badge";

export function SourceCard({ source }: { source: Source }) {
  return (
    <Badge variant="outline" className="gap-1.5 rounded-md font-normal">
      <span className="font-mono text-[11px] font-semibold">
        Art. {source.articleNumber}.º
      </span>
      <span className="text-[11px] text-muted-foreground">{source.title}</span>
    </Badge>
  );
}
