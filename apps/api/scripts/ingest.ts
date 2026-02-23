import { ChromaClient } from "chromadb";
import OpenAI from "openai";
import path from "path";
import { parseConstitution } from "./parse-constitution";

const COLLECTION_NAME = "constituicao";
const BATCH_SIZE = 50;

async function main() {
  const dataPath = path.resolve(
    import.meta.dir,
    "../../../data/constituicao.txt",
  );
  const file = Bun.file(dataPath);

  if (!(await file.exists())) {
    console.error(`File not found: ${dataPath}`);
    console.error("Place the constitution text file at data/constituicao.txt");
    process.exit(1);
  }

  const text = await file.text();
  console.log("Parsing constitution...");
  const articles = parseConstitution(text);
  console.log(`Parsed ${articles.length} articles`);

  if (articles.length === 0) {
    console.error("No articles parsed. Check the format of constituicao.txt");
    process.exit(1);
  }

  // Initialize clients
  const chromaHost = process.env.CHROMA_HOST || "localhost";
  const chromaPort = process.env.CHROMA_PORT || "8000";
  const chroma = new ChromaClient({
    path: `http://${chromaHost}:${chromaPort}`,
  });
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Delete existing collection if it exists
  try {
    await chroma.deleteCollection({ name: COLLECTION_NAME });
    console.log("Deleted existing collection");
  } catch {
    // Collection doesn't exist, that's fine
  }

  const collection = await chroma.createCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });
  console.log(`Created collection: ${COLLECTION_NAME}`);

  // Process in batches
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const texts = batch.map((a) => a.text);

    console.log(
      `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(articles.length / BATCH_SIZE)}...`,
    );

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    const embeddings = embeddingResponse.data.map((e) => e.embedding);

    await collection.add({
      ids: batch.map((a) => a.id),
      documents: texts,
      embeddings,
      metadatas: batch.map((a) => ({
        articleNumber: a.metadata.articleNumber,
        title: a.metadata.title,
        hierarchy: a.metadata.hierarchy,
        part: a.metadata.part || "",
        partTitle: a.metadata.partTitle || "",
        chapter: a.metadata.chapter || "",
        chapterTitle: a.metadata.chapterTitle || "",
        section: a.metadata.section || "",
        sectionTitle: a.metadata.sectionTitle || "",
      })),
    });
  }

  const count = await collection.count();
  console.log(`Ingestion complete. ${count} documents stored in ChromaDB.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
