import type { Source } from "@constituicao/shared";
import { ArticleCitation } from "@/components/article-citation";

// Matches "Artigo 103.º", "Artigo 103.°", and optionally "n.º 1" / "n.os 1 e 2"
const ARTICLE_REGEX = /Artigo\s+(\d+[A-Z]?)\.[ºª°](?:,?\s*n\.[ºª°s]\s*\d+(?:\s*(?:e|a)\s*\d+)*)?/g;

/**
 * Takes a plain text string and replaces "Artigo N.º" patterns
 * with interactive ArticleCitation components.
 */
export function parseTextWithCitations(
  text: string,
  sourceMap: Map<string, Source>
): React.ReactNode[] {

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(ARTICLE_REGEX)) {
    const articleNumber = match[1];
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <ArticleCitation
        key={`${articleNumber}-${matchIndex}`}
        label={match[0]}
        source={sourceMap.get(articleNumber) ?? null}
      />
    );

    lastIndex = end;
    matchIndex++;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
