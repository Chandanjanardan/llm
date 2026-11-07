import "dotenv/config";
import OpenAI from "openai";
import { fetchWebsiteContents } from "./scraper.js";

// ============================================================
// Day 1 - Your First LLM Project (Node.js version)
// A website summarizer using OpenAI (or OpenRouter)
// ============================================================

// --- Check API Key ---
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey || apiKey === "your-openrouter-key-here") {
  console.error("No API key found! Please set OPENROUTER_API_KEY in .env file.");
  process.exit(1);
}
console.log("API key found and loaded!\n");

// --- Initialize OpenAI client with OpenRouter ---
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
});

// ============================================================
// Quick test - say hello to GPT!
// ============================================================

async function quickTest() {
  const message = "Hello, GPT! This is my first ever message to you! Hi!";
  const messages = [{ role: "user", content: message }];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  console.log("Quick test response:");
  console.log(response.choices[0].message.content);
  console.log();
}

// ============================================================
// Prompts
// ============================================================

const systemPrompt = `
You are a snarky assistant that analyzes the contents of a website,
and provides a short, snarky, humorous summary, ignoring text that might be navigation related.
Respond in markdown.
`;

const userPromptPrefix = `
Here are the contents of a website.
Provide a short summary of this website.
If it includes news or announcements, then summarize these too.

`;

// ============================================================
// Build messages for the API
// ============================================================

function messagesFor(websiteContent) {
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPromptPrefix + websiteContent },
  ];
}

// ============================================================
// Summarize a website
// ============================================================

async function summarize(url) {
  console.log(`Fetching ${url}...`);
  const website = await fetchWebsiteContents(url);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messagesFor(website),
  });
  return response.choices[0].message.content;
}

async function displaySummary(url) {
  const summary = await summarize(url);
  console.log(`\n--- Summary of ${url} ---\n`);
  console.log(summary);
  console.log();
}

// ============================================================
// Main - run everything
// ============================================================

async function main() {
  // Step 1: Quick hello test
  await quickTest();

  // Step 2: Test the scraper
  console.log("--- Testing scraper ---");
  const ed = await fetchWebsiteContents("https://edwarddonner.com");
  console.log(ed.slice(0, 500) + "...\n");

  // Step 3: Summarize websites
  await displaySummary("https://edwarddonner.com");
  await displaySummary("https://cnn.com");
  await displaySummary("https://anthropic.com");
}

main().catch(console.error);
