import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/eduflow_db"),
  NEXTAUTH_SECRET: z.string().min(16).default("super-secret-production-nextauth-key-32-chars!"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional().default("demo-key"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional().default("eduflow-ai"),
  CLOUDINARY_API_KEY: z.string().optional().default("demo_key"),
  CLOUDINARY_API_SECRET: z.string().optional().default("demo_secret"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = EnvSchema.parse(process.env);
