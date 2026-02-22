"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import type { Source } from "@constituicao/shared";
import { parseTextWithCitations } from "@/lib/parse-citations";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const remarkGfm = import("remark-gfm").then((m) => m.default);
let resolvedRemarkGfm: typeof import("remark-gfm").default | null = null;
remarkGfm.then((plugin) => { resolvedRemarkGfm = plugin; });

const REMARK_PLUGINS_EMPTY: [] = [];

interface MarkdownRendererProps {
  content: string;
  sources?: Source[];
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  sources,
}: MarkdownRendererProps) {
  const remarkPlugins = useMemo(
    () => (resolvedRemarkGfm ? [resolvedRemarkGfm] : REMARK_PLUGINS_EMPTY),
    []
  );

  const components = useMemo(() => {
    if (!sources || sources.length === 0) return {};

    const sourceMap = new Map(
      sources.map((s) => [s.articleNumber, s])
    );
    const withCitations = (text: string) =>
      parseTextWithCitations(text, sourceMap);

    const wrap =
      (Tag: string) =>
      ({ children }: { children?: React.ReactNode }) => {
        const El = Tag as React.ElementType;
        return <El>{processChildren(children, withCitations)}</El>;
      };

    return {
      p: wrap("p"),
      li: wrap("li"),
      strong: wrap("strong"),
      em: wrap("em"),
      h1: wrap("h1"),
      h2: wrap("h2"),
      h3: wrap("h3"),
      h4: wrap("h4"),
      blockquote: wrap("blockquote"),
      td: wrap("td"),
      th: wrap("th"),
    };
  }, [sources]);

  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {content}
    </ReactMarkdown>
  );
});

/**
 * Recursively processes children, replacing plain text strings
 * with citation-aware nodes.
 */
function processChildren(
  children: React.ReactNode,
  withCitations: (text: string) => React.ReactNode[]
): React.ReactNode {
  if (children == null) return children;

  if (typeof children === "string") {
    return withCitations(children);
  }

  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <span key={i}>{withCitations(child)}</span>
      ) : (
        child
      )
    );
  }

  return children;
}
