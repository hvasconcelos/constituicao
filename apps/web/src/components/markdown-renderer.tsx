"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Source } from "@constituicao/shared";
import { parseTextWithCitations } from "@/lib/parse-citations";

interface MarkdownRendererProps {
  content: string;
  sources?: Source[];
}

export function MarkdownRenderer({ content, sources }: MarkdownRendererProps) {
  const components = useMemo(() => {
    if (!sources || sources.length === 0) return {};

    // Override text rendering inside paragraphs, list items, headings, etc.
    // to inject interactive article citations
    const withCitations = (text: string) =>
      parseTextWithCitations(text, sources);

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
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

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
