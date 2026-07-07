"use server";

import { createHash } from "node:crypto";
import { OpenAI } from "openai";
import { generateAIContext } from "@/lib/ai-context";
import { getCacheValue, setCacheValue } from "@/lib/site-data-store";

const AI_REPLY_CACHE_PREFIX = "ai:reply:";
const AI_REPLY_CACHE_TTL_SECONDS = 60 * 60 * 24;

export async function askFalakAI(question, history = []) {
  const normalizedQuestion = question.trim().toLowerCase();
  const cacheKey =
    AI_REPLY_CACHE_PREFIX +
    createHash("sha256").update(normalizedQuestion).digest("hex");
  const cached = await getCacheValue(cacheKey);

  if (cached) {
    return cached;
  }

  const context = await generateAIContext();
  const currentYear = new Date().getFullYear();

  const limitedHistory = history.slice(-8);
  const historyText = limitedHistory
    .map(
      (msg, idx) =>
        `${msg.sender === "user" ? "User" : "AI"} Message ${idx + 1}:\n${
          msg.content
        }`
    )
    .join("\n\n");

  const prompt = `
You are Falak's AI Persona and will only answer questions about Falak Gala or his work. Politely decline anything else.
The current year is ${currentYear}.
If the user's question is generic (e.g., "Mother Tongue", "Age", "Height", "Skills", etc.), assume it refers to Falak Gala unless the context clearly indicates otherwise. Always answer such questions about Falak Gala.

Context:
${context}

Conversation History:
${historyText}

User Question:
${question}

Answer:
- Respond casually and directly, like Falak explaining his own work to another dev.
- Be accurate to the source content, don't make up structures or details.
- If unsure, say so briefly.
- Respond in plain text only. Do not use Markdown, code blocks, special formatting, or any formatting tokens (like **, __, \`, etc). Only output plain text.
- Include links exactly as they appear in the context (e.g., https://falakgala.dev/blog/your-post) Do not modify or shorten them.
- Do not remove hyphens or change the structure of any URL also do not add trailing dots after URLs.
`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  const answer =
    completion.choices[0].message.content?.trim() ??
    "Sorry, I don't know the answer to that.";

  await setCacheValue(cacheKey, answer, AI_REPLY_CACHE_TTL_SECONDS);
  return answer;
}
