import type { RepoContext, LLMProvider } from "./types";
import { buildSystemPrompt, buildUserPrompt, buildAnalyzePrompt } from "./prompts";

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function getProvider(): LLMProvider {
  const pinned = process.env.GITREVERSE_QUICK_LLM as LLMProvider | undefined;
  if (pinned && pinned !== "auto") return pinned;
  if (process.env.XAI_API_KEY) return "grok";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.AZURE_OPENAI_API_KEY) return "azure";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google";
  throw new Error("No LLM provider configured. Set at least one API key in .env.local.");
}

async function callOpenAICompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: LLMMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: true, max_tokens: 8192 }),
  });
  if (!res.ok || !res.body) throw new Error(`LLM request failed: ${res.status}`);
  return streamSSEContent(res.body);
}

async function callAzure(messages: LLMMessage[]): Promise<ReadableStream<Uint8Array>> {
  const baseUrl = process.env.AZURE_OPENAI_BASE_URL!;
  const model = process.env.AZURE_OPENAI_MODEL ?? "gpt-4o";
  const url = `${baseUrl}/openai/deployments/${model}/chat/completions?api-version=2024-08-01-preview`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": process.env.AZURE_OPENAI_API_KEY! },
    body: JSON.stringify({ messages, stream: true, max_tokens: 8192 }),
  });
  if (!res.ok || !res.body) throw new Error(`Azure request failed: ${res.status}`);
  return streamSSEContent(res.body);
}

async function callGoogle(messages: LLMMessage[]): Promise<ReadableStream<Uint8Array>> {
  const model = process.env.GOOGLE_AI_STUDIO_MODEL ?? "gemini-2.5-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));
  const systemInstruction = messages.find((m) => m.role === "system");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(systemInstruction && {
        systemInstruction: { parts: [{ text: systemInstruction.content }] },
      }),
      generationConfig: { maxOutputTokens: 8192 },
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Google request failed: ${res.status}`);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.match(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
        if (parts) {
          for (const part of parts) {
            const text = part.replace(/^"text":\s*"/, "").replace(/"$/, "")
              .replace(/\\n/g, "\n").replace(/\\"/g, '"');
            controller.enqueue(encoder.encode(text));
          }
          buf = "";
        }
      }
      controller.close();
    },
  });
}

function streamSSEContent(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {}
        }
      }
      controller.close();
    },
  });
}

async function callLLM(messages: LLMMessage[]): Promise<ReadableStream<Uint8Array>> {
  const provider = getProvider();
  switch (provider) {
    case "grok":
      return callOpenAICompat("https://api.x.ai/v1/chat/completions", process.env.XAI_API_KEY!, process.env.XAI_MODEL ?? "grok-3", messages);
    case "openrouter":
      return callOpenAICompat("https://openrouter.ai/api/v1/chat/completions", process.env.OPENROUTER_API_KEY!, process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-pro", messages);
    case "azure":
      return callAzure(messages);
    case "google":
      return callGoogle(messages);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function generateBuildPrompt(
  context: RepoContext,
  mode: string
): Promise<ReadableStream<Uint8Array>> {
  return callLLM([
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildUserPrompt(context, mode) },
  ]);
}

export async function analyzeCode(
  code: string,
  filename?: string
): Promise<ReadableStream<Uint8Array>> {
  return callLLM([
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildAnalyzePrompt(code, filename) },
  ]);
}
