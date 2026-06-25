import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/llm";
import { RateLimiter } from "@/lib/rate-limiter";

const limiter = new RateLimiter({ windowMs: 60_000, max: 15 });

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!limiter.check(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before analyzing more code." },
      { status: 429 }
    );
  }

  try {
    const { code, filename } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }
    if (code.length > 200_000) {
      return NextResponse.json(
        { error: "Code exceeds maximum size (200KB). Please split into smaller pieces." },
        { status: 413 }
      );
    }

    const stream = await analyzeCode(code, filename);
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("[/api/analyze] error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
