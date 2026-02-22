import { ChromaClient, type Collection } from "chromadb";
import OpenAI from "openai";
import type { Source } from "@constituicao/shared";
import { config } from "./config";

const COLLECTION_NAME = "constituicao";
const CACHE_MAX_SIZE = 200;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  sources: Source[];
  timestamp: number;
}

// LRU cache for query results — avoids repeated embedding + vector search calls
const queryCache = new Map<string, CacheEntry>();

function getCacheKey(query: string, topK: number): string {
  return `${query.trim().toLowerCase()}:${topK}`;
}

function getCached(key: string): Source[] | null {
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  // Move to end (most recently used)
  queryCache.delete(key);
  queryCache.set(key, entry);
  return entry.sources;
}

function setCache(key: string, sources: Source[]): void {
  // Evict oldest entry if at capacity
  if (queryCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = queryCache.keys().next().value!;
    queryCache.delete(oldestKey);
  }
  queryCache.set(key, { sources, timestamp: Date.now() });
}

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
  const cacheKey = getCacheKey(query, topK);
  const cached = getCached(cacheKey);
  if (cached) return cached;

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

  const sources = results.documents[0].map((doc, i) => {
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

  setCache(cacheKey, sources);
  return sources;
}

export async function checkConnection(): Promise<boolean> {
  try {
    await getClient().heartbeat();
    return true;
  } catch {
    return false;
  }
}
