import { readFileSync } from "fs";
import { resolve } from "path";
import type { Source } from "@constituicao/shared";

const soulPath = resolve(import.meta.dirname, "../../../../SOUL.md");
const soulPrompt = readFileSync(soulPath, "utf-8");

export function buildSystemPrompt(sources: Source[]): string {
  const articlesContext = sources
    .map(
      (s) =>
        `--- Artigo ${s.articleNumber}.º - ${s.title} ---\n${s.hierarchy ? `[${s.hierarchy}]\n` : ""}${s.text}`
    )
    .join("\n\n");

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
