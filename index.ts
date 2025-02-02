import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import {
  ContentSegmentationAgent,
  VectraDatabase,
  ContentProcessor,
  EmbeddingsGenerator,
  QueryURLTool,
  IContentChunker,
  IContentProcessor,
  IEmbeddingsGenerator,
  IVectorDatabase,
} from "@sammyl/ai-url-query";

// Load environment variables from .env file
dotenv.config();

// Determine current directory since ES modules do not have __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store the vectra index locally; you can change as needed.
const INDEX_PATH = path.join(__dirname, "vectra_index");
// Initialize the vector database using vectra.
const vectorDatabase: IVectorDatabase = await VectraDatabase.From(INDEX_PATH);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of the content segmentation agent.
const textSegmentationAgent: IContentChunker = new ContentSegmentationAgent(
  openai
);

// Wrap OpenAI embeddings API.
const embeddingsGenerator: IEmbeddingsGenerator = new EmbeddingsGenerator(
  openai
);

// Initialize the content processor that handles fetching, segmentation, and storage of embeddings.
const contentProcessor: IContentProcessor = new ContentProcessor(
  embeddingsGenerator,
  textSegmentationAgent,
  vectorDatabase
);

// Create the high-level URL query tool.
const queryUrlTool = new QueryURLTool(contentProcessor, openai);

// Set up terminal input using readline.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify question asking.
const askQuestion = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

try {
  // Prompt the user for a URL and a question.
  const url = await askQuestion("Enter URL: ");
  const question = await askQuestion(
    "Enter your question about the URL content: "
  );
  const answer = await queryUrlTool.queryUrl(url, question);

  console.log("\nAnswer:");
  console.log(answer);
} catch (err) {
  console.error("An error occurred:", err);
} finally {
  rl.close();
}
