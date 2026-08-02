import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY && process.env.NODE_ENV === "production") {
  console.warn("[WARN] OPENAI_API_KEY is not defined in environment variables.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development",
});

export const AI_MODELS = {
  AUDIT: "gpt-4o",
  EMBEDDING: "text-embedding-3-small",
  FAST: "gpt-4o-mini",
} as const;

export default openai;
