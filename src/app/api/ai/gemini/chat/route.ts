import { NextResponse } from "next/server";
import { chatWithGeminiCurriculum } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { prompt, contextPath } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const reply = await chatWithGeminiCurriculum(prompt, contextPath);
    return NextResponse.json({ reply, model: "gemini-2.0-flash", timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Gemini Chat Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process Gemini AI request" }, { status: 500 });
  }
}
