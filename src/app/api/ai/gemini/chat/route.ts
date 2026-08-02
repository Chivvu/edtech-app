import { NextResponse } from "next/server";
import { chatWithGeminiCurriculum } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const reply = await chatWithGeminiCurriculum(prompt, context);
    return NextResponse.json({ reply, model: "gemini-2.0-flash" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to query Gemini AI" }, { status: 500 });
  }
}
