import type { Source } from "@constituicao/shared";
import { readFileSync } from "fs";
import { resolve } from "path";

// Resolve the absolute path to the SOUL.md file, located at the project root.
// This file contains the base system prompt for the assistant.
const soulPath = resolve(import.meta.dirname, "../../../../SOUL.md");

// Read and load the entire contents of SOUL.md synchronously into a string.
// This provides the foundational system prompt context.
const soulPrompt = readFileSync(soulPath, "utf-8");

/**
 * Builds the full system prompt to send to the LLM for a chat turn.
 * - Incorporates the core system prompt from SOUL.md.
 * - Appends explicit behavioral rules in European Portuguese.
 * - Injects the most relevant articles from the Constitution as context.
 * - Instructs the model on strict citation and evidence-based answering.
 *
 * @param sources Array of relevant articles (as Source objects) to be included in context.
 * @returns The system prompt string to be used for this LLM interaction.
 */
export function buildSystemPrompt(sources: Source[]): string {
  // Format each source article for injection: show article number, title, hierarchy (if present), and text.
  const articlesContext = sources
    .map(
      (s) =>
        `--- Artigo ${s.articleNumber}.º - ${s.title} ---\n${s.hierarchy ? `[${s.hierarchy}]\n` : ""}${s.text}`,
    )
    .join("\n\n");

  // Compose the final system prompt:
  // - The foundational "soul" from SOUL.md
  // - Portuguese rules for behavior and citation
  // - The block of relevant articles as input context for RAG
  // - Special instructions to answer only with evidence found in the supplied articles
  return `${soulPrompt}

REGRAS:
- Responde SEMPRE em português europeu.
- Baseia as tuas respostas EXCLUSIVAMENTE nos artigos da Constituição fornecidos abaixo.
- Cita sempre os artigos relevantes (ex: "Artigo 25.º").
- Se a informação não estiver nos artigos fornecidos, diz honestamente que não encontraste informação relevante nos artigos consultados.
- Nunca inventes ou fabrique informação constitucional.

ARTIGOS DA CONSTITUIÇÃO RELEVANTES:
${articlesContext}

Usa os artigos acima para fundamentar a tua resposta. Cita sempre os números dos artigos que utilizas.`;
}
