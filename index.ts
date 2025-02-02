import { VectraBasedUrlQueryFactory } from "@sammyl/ai-url-query";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

// Load environment variables from .env file
dotenv.config();

// Determine current directory since ES modules do not have __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store the vectra index locally; you can change as needed.
const INDEX_PATH = path.join(__dirname, "vectra_index");

// Initialize a factory for creating assistant using vectra database for embeddings.
const factory = new VectraBasedUrlQueryFactory(
  process.env.OPENAI_API_KEY!,
  INDEX_PATH
);

const { assistant } = await factory.Create();

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
  const answer = await assistant.Ask(url, question);

  console.log("\nAnswer:");
  console.log(answer);
} catch (err) {
  console.error("An error occurred:", err);
} finally {
  rl.close();
}
