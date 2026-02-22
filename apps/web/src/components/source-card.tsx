import type { Source } from "@constituicao/shared";

export function SourceCard({ source }: { source: Source }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
      <p className="font-medium text-green-800">
        Artigo {source.articleNumber}.º — {source.title}
      </p>
      {source.hierarchy && (
        <p className="mt-0.5 text-xs text-gray-500">{source.hierarchy}</p>
      )}
    </div>
  );
}
