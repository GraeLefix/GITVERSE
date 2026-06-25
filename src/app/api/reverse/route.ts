import { NextRequest, NextResponse } from "next/server";
import { reverseRepo } from "@/lib/github";
import { generateBuildPrompt } from "@/lib/llm";
import { RateLimiter } from "@/lib/rate-limiter";

const limiter = new RateLimiter({ windowMs: 60_000, max: 20 });

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!limiter.check(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const { owner, repo, mode = "quick" } = await req.json();
    if (!owner || !repo) {
      return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
    }

    const cleanOwner = owner.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 64);
    const cleanRepo = repo.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 128);

    const context = await reverseRepo(cleanOwner, cleanRepo);
    if (!context) {
      return NextResponse.json(
        { error: "Repository not found or is private." },
        { status: 404 }
      );
    }

    const stream = await generateBuildPrompt(context, mode);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[/api/reverse] error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
