"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { parseGitHubUrl } from "@/lib/utils";
import { AnalysisDashboard } from "./analysis-dashboard";

type Mode = "repo" | "paste";

const EXAMPLE_REPOS = [
  { label: "vercel/next.js", value: "vercel/next.js" },
  { label: "supabase/supabase", value: "supabase/supabase" },
  { label: "shadcn-ui/ui", value: "shadcn-ui/ui" },
  { label: "tiangolo/fastapi", value: "tiangolo/fastapi" },
];

export function ReversePromptHome() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("repo");
  const [input, setInput] = useState("");
  const [pastedCode, setPastedCode] = useState("");
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleRepoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = parseGitHubUrl(input.trim());
    if (!parsed) {
      setError("Please enter a valid GitHub URL or owner/repo format.");
      return;
    }
    router.push(`/${parsed.owner}/${parsed.repo}`);
  }

  async function handleCodeAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = pastedCode.trim();
    if (!code) { setError("Please paste some code to analyze."); return; }
    setIsLoading(true);
    setAnalysisResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok || !res.body) throw new Error("Analysis failed.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setAnalysisResult(full);
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24 sm:px-6">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-medium text-indigo-300">Powered by gitverse.id</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Reverse engineer{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            any codebase
          </span>
          <br />
          into a build prompt.
        </h1>
        <p className="mt-4 text-base text-gray-400 sm:text-lg max-w-2xl mx-auto">
          Paste code or a GitHub URL → AI analyzes architecture, dependencies, and APIs
          → get a reconstruction prompt for Cursor, Claude, or Codex.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="mb-6 flex rounded-lg border border-[#2a2a3e] bg-[#16161f] p-1 w-fit mx-auto">
        {(["repo", "paste"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === m ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            {m === "repo" ? "GitHub URL" : "Paste Code"}
          </button>
        ))}
      </div>

      {mode === "repo" && (
        <form onSubmit={handleRepoSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              placeholder="https://github.com/vercel/next.js  or  vercel/next.js"
              className="w-full rounded-xl border border-[#2a2a3e] bg-[#16161f] px-4 py-4 pr-36 font-mono text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Reverse →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_REPOS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setInput(value)}
                className="rounded-md border border-[#2a2a3e] bg-[#16161f] px-3 py-1 font-mono text-xs text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </form>
      )}

      {mode === "paste" && (
        <form onSubmit={handleCodeAnalysis} className="space-y-3">
          <div className="relative rounded-xl border border-[#2a2a3e] bg-[#111120] overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-[#1e1e2e] px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 font-mono text-xs text-gray-600">paste code here</span>
            </div>
            <textarea
              value={pastedCode}
              onChange={(e) => { setPastedCode(e.target.value); setError(""); }}
              rows={14}
              className="w-full bg-transparent px-4 py-4 font-mono text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none resize-none"
              placeholder="// Paste any code here — JavaScript, Python, Go, Rust, anything."
            />
          </div>
          <p className="text-xs text-gray-600 text-center">
            Paste multiple files, then type{" "}
            <code className="text-indigo-400">GITVERSE_DONE</code> to trigger batch analysis.
          </p>
          <button
            type="submit"
            disabled={isLoading || !pastedCode.trim()}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Analyzing..." : "Get Build Prompt"}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}

      {analysisResult && (
        <div ref={resultRef} className="mt-10">
          <AnalysisDashboard markdown={analysisResult} isStreaming={isLoading} />
        </div>
      )}

      {!analysisResult && (
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Paste your files", desc: "Drop any code files or GitHub URLs." },
            { step: "02", title: "AI Analyzes", desc: "Architecture, dependencies, APIs, and business logic extracted." },
            { step: "03", title: "Get Build Prompt", desc: "Copy a complete reconstruction prompt into Cursor, Claude, or Codex." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-xl border border-[#2a2a3e] bg-[#16161f] p-5">
              <div className="mb-3 font-mono text-3xl font-bold text-[#2a2a3e]">{step}</div>
              <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
