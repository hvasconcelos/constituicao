import type { ConstitutionArticle, ArticleMetadata } from "@constituicao/shared";

interface HierarchyState {
  part?: string;
  partTitle?: string;
  chapter?: string;
  chapterTitle?: string;
  section?: string;
  sectionTitle?: string;
}

function buildHierarchy(state: HierarchyState): string {
  const parts: string[] = [];
  if (state.part && state.partTitle) parts.push(`${state.part} - ${state.partTitle}`);
  if (state.chapter && state.chapterTitle) parts.push(`${state.chapter} - ${state.chapterTitle}`);
  if (state.section && state.sectionTitle) parts.push(`${state.section} - ${state.sectionTitle}`);
  return parts.join(" > ");
}

export function parseConstitution(text: string): ConstitutionArticle[] {
  const lines = text.split("\n");
  const articles: ConstitutionArticle[] = [];
  const state: HierarchyState = {};

  let currentArticleNumber: string | null = null;
  let currentArticleTitle: string | null = null;
  let currentArticleLines: string[] = [];
  let currentHierarchy: string = "";

  const partRegex = /^PARTE\s+(.+)$/i;
  const partTitleRegex = /^(?!PARTE|TITULO|TÍTULO|CAPÍTULO|CAPITULO|SECCAO|SECÇÃO|Artigo)([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s,]+)$/;
  const titleRegex = /^T[IÍ]TULO\s+(.+)$/i;
  const chapterRegex = /^CAP[IÍ]TULO\s+(.+)$/i;
  const sectionRegex = /^SEC[CÇ][AÃ]O\s+(.+)$/i;
  const articleRegex = /^Artigo\s+(\d+)\.º$/i;

  function flushArticle() {
    if (currentArticleNumber && currentArticleTitle) {
      const text = currentArticleLines.join("\n").trim();
      if (text) {
        const metadata: ArticleMetadata = {
          articleNumber: currentArticleNumber,
          title: currentArticleTitle,
          hierarchy: currentHierarchy,
        };
        if (state.part) {
          metadata.part = state.part;
          metadata.partTitle = state.partTitle;
        }
        if (state.chapter) {
          metadata.chapter = state.chapter;
          metadata.chapterTitle = state.chapterTitle;
        }
        if (state.section) {
          metadata.section = state.section;
          metadata.sectionTitle = state.sectionTitle;
        }
        articles.push({
          id: `artigo-${currentArticleNumber}`,
          text: `Artigo ${currentArticleNumber}.º\n${currentArticleTitle}\n\n${text}`,
          metadata,
        });
      }
    }
    currentArticleNumber = null;
    currentArticleTitle = null;
    currentArticleLines = [];
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect PARTE
    const partMatch = line.match(partRegex);
    if (partMatch) {
      flushArticle();
      state.part = `Parte ${partMatch[1].trim()}`;
      state.chapter = undefined;
      state.chapterTitle = undefined;
      state.section = undefined;
      state.sectionTitle = undefined;
      // Next non-empty line is the part title
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        state.partTitle = lines[j].trim();
        i = j + 1;
        continue;
      }
    }

    // Detect TITULO
    const titleMatch = line.match(titleRegex);
    if (titleMatch) {
      flushArticle();
      state.chapter = `Título ${titleMatch[1].trim()}`;
      state.section = undefined;
      state.sectionTitle = undefined;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        state.chapterTitle = lines[j].trim();
        i = j + 1;
        continue;
      }
    }

    // Detect CAPITULO
    const chapterMatch = line.match(chapterRegex);
    if (chapterMatch) {
      flushArticle();
      state.chapter = `Capítulo ${chapterMatch[1].trim()}`;
      state.section = undefined;
      state.sectionTitle = undefined;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        state.chapterTitle = lines[j].trim();
        i = j + 1;
        continue;
      }
    }

    // Detect SECCAO
    const sectionMatch = line.match(sectionRegex);
    if (sectionMatch) {
      flushArticle();
      state.section = `Secção ${sectionMatch[1].trim()}`;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        state.sectionTitle = lines[j].trim();
        i = j + 1;
        continue;
      }
    }

    // Detect Artigo
    const articleMatch = line.match(articleRegex);
    if (articleMatch) {
      flushArticle();
      currentArticleNumber = articleMatch[1];
      currentHierarchy = buildHierarchy(state);
      // Next non-empty line is the article title
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length) {
        currentArticleTitle = lines[j].trim();
        i = j + 1;
        continue;
      }
    }

    // Accumulate article body
    if (currentArticleNumber && currentArticleTitle) {
      currentArticleLines.push(line);
    }

    i++;
  }

  // Flush last article
  flushArticle();

  return articles;
}
