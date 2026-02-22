import { ChromaClient, type Collection } from "chromadb";
import OpenAI from "openai";
import type { Source } from "@constituicao/shared";
import { config } from "./config";

const COLLECTION_NAME = "constituicao";

let client: ChromaClient | null = null;
let collection: Collection | null = null;
let openai: OpenAI | null = null;

function getClient(): ChromaClient {
  if (!client) {
    client = new ChromaClient({
      path: `http://${config.chromaHost}:${config.chromaPort}`,
    });
  }
  return client;
}

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return openai;
}

async function getCollection(): Promise<Collection> {
  if (!collection) {
    collection = await getClient().getCollection({ name: COLLECTION_NAME });
  }
  return collection;
}

export async function queryRelevantArticles(
  query: string,
  topK: number = config.ragTopK
): Promise<Source[]> {
  const embeddingResponse = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;
  const col = await getCollection();

  const results = await col.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  if (!results.documents?.[0]) return [];

  return results.documents[0].map((doc, i) => {
    const meta = results.metadatas?.[0]?.[i] as Record<string, string> | undefined;
    const distance = results.distances?.[0]?.[i] ?? 1;
    return {
      articleNumber: meta?.articleNumber || "",
      title: meta?.title || "",
      hierarchy: meta?.hierarchy || "",
      text: doc || "",
      score: 1 - distance,
    };
  });
}

export async function checkConnection(): Promise<boolean> {
  try {
    await getClient().heartbeat();
    return true;
  } catch {
    return false;
  }
}
