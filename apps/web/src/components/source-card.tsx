import type { Source } from "@constituicao/shared";

export function SourceCard({ source }: { source: Source }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 transition-colors hover:bg-neutral-100">
      <span className="font-mono text-[11px] font-semibold text-neutral-950">
        Art. {source.articleNumber}.º
      </span>
      <span className="text-[11px] text-neutral-500">{source.title}</span>
    </div>
  );
}
