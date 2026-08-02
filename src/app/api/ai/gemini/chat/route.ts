import { NextResponse } from "next/server";
import { chatWithGeminiCurriculum, streamGeminiContent } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { prompt, contextPath, stream } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Handle SSE Streaming Response if requested
    if (stream) {
      const streamByteResponse = await streamGeminiContent(prompt, contextPath);
      return new NextResponse(streamByteResponse, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Standard Grounded RAG JSON Response
    const reply = await chatWithGeminiCurriculum(prompt, contextPath);
    return NextResponse.json({
      reply,
      model: "gemini-2.0-flash",
      groundedRAG: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini Chat Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process Gemini AI request" }, { status: 500 });
  }
}
