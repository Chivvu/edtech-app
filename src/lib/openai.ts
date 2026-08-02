import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development",
});

export const AI_MODELS = {
  AUDIT: "gpt-4o",
  EMBEDDING: "text-embedding-3-small",
  FAST: "gpt-4o-mini",
} as const;

export default openai;
