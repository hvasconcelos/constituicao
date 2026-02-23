import type { Source } from "@constituicao/shared";
import { ChromaClient, type Collection } from "chromadb";
import OpenAI from "openai";
import { config } from "./config";

// Name of the Chroma collection to be used for storing articles
const COLLECTION_NAME = "constituicao";

// LRU cache configuration: max size and entry time-to-live (TTL)
const CACHE_MAX_SIZE = 200;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Structure for each cache entry: stores sources and the timestamp
interface CacheEntry {
  sources: Source[];
  timestamp: number;
}

// In-memory LRU cache for query results
// Keyed by a normalized query string + topK value
const queryCache = new Map<string, CacheEntry>();

/**
 * Builds a consistent cache key based on query text and topK.
 * Query is normalized (trimmed and lowercased) to reduce duplicates.
 */
function getCacheKey(query: string, topK: number): string {
  return `${query.trim().toLowerCase()}:${topK}`;
}

/**
 * Attempt to fetch a cached result for the given key.
 * If the entry is expired, evict it and return null.
 * If found and fresh, move to end of LRU order.
 */
function getCached(key: string): Source[] | null {
  const entry = queryCache.get(key);
  if (!entry) return null;
  // If cache entry is expired, remove it
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  // LRU: move accessed entry to end to mark as recently used
  queryCache.delete(key);
  queryCache.set(key, entry);
  return entry.sources;
}

/**
 * Add a new result set to the cache.
 * Evict the least recently used entry if max cache size is exceeded.
 */
function setCache(key: string, sources: Source[]): void {
  // If at capacity, remove the oldest entry (first inserted key)
  if (queryCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = queryCache.keys().next().value as string;
    queryCache.delete(oldestKey);
  }
  // Add new entry with current timestamp
  queryCache.set(key, { sources, timestamp: Date.now() });
}

// Singleton instances for Chroma client, article collection, and OpenAI client
let client: ChromaClient | null = null;
let collection: Collection | null = null;
let openai: OpenAI | null = null;

/**
 * Lazily instantiate and return a singleton ChromaClient.
 * Uses the host/port configuration.
 */
function getClient(): ChromaClient {
  if (!client) {
    client = new ChromaClient({
      path: `http://${config.chromaHost}:${config.chromaPort}`,
    });
  }
  return client;
}

/**
 * Lazily instantiate and return a singleton OpenAI client (for embeddings).
 */
function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return openai;
}

/**
 * Obtain (and cache) a reference to the Chroma collection for constitution articles.
 */
async function getCollection(): Promise<Collection> {
  if (!collection) {
    // NOTE: Argument lint warning may be suppressed if your chromadb types expect embeddingFunction
    collection = await getClient().getCollection({ name: COLLECTION_NAME });
  }
  return collection;
}

/**
 * Main semantic search pipeline:
 *  - Embeds the query using OpenAI's API
 *  - Searches the Chroma vector DB for the closest-matching articles
 *  - Returns ranked article sources (with score)
 *  - Results are cached per query/topK to avoid repeated computation
 * @param query - The natural language search query
 * @param topK - The max number of results to return (default configured)
 */
export async function queryRelevantArticles(
  query: string,
  topK: number = config.ragTopK,
): Promise<Source[]> {
  // Check cache first
  const cacheKey = getCacheKey(query, topK);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Generate embedding for user query using OpenAI
  const embeddingResponse = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  // Use first returned embedding (should be only one since input is a single query)
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Get Chroma collection
  const col = await getCollection();

  // Query ChromaDB for nearest articles (vector search)
  const results = await col.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  // If no results/documents are found, return an empty array
  if (!results.documents?.[0]) return [];

  // Build array of Source objects, extracting metadata and similarity score
  const sources = results.documents[0].map((doc, i) => {
    const meta = results.metadatas?.[0]?.[i] as
      | Record<string, string>
      | undefined;
    const distance = results.distances?.[0]?.[i] ?? 1;
    return {
      articleNumber: meta?.articleNumber || "",
      title: meta?.title || "",
      hierarchy: meta?.hierarchy || "",
      text: doc || "",
      // Convert distance to a normalized similarity score (higher is better)
      score: 1 - distance,
    };
  });

  // Cache this result for future identical queries/topK
  setCache(cacheKey, sources);
  return sources;
}

/**
 * Check health/connectivity to the ChromaDB vector database.
 * Returns true if heartbeat passes, false otherwise.
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await getClient().heartbeat();
    return true;
  } catch {
    return false;
  }
}
