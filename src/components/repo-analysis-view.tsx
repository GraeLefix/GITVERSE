"use client";

import { useEffect, useRef, useState } from "react";
import { AnalysisDashboard } from "./analysis-dashboard";

interface Props {
  owner: string;
  repo: string;
}

export function RepoAnalysisView({ owner, repo }: Props) {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"quick" | "deep">("quick");
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;

    async function run() {
      setIsLoading(true);
      setResult("");
      setError("");

      try {
        const res = await fetch("/api/reverse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo, mode }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error((json as { error?: string }).error ?? `Request failed (${res.status})`);
        }

        if (!res.body) throw new Error("No response stream.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelRef.current) break;
          full += decoder.decode(value, { stream: true });
          setResult(full);
        }
      } catch (err) {
        if (!cancelRef.current)
          setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!cancelRef.current) setIsLoading(false);
      }
    }

    run();
    return () => { cancelRef.current = true; };
  }, [owner, repo, mode]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xl font-bold text-white hover:text-indigo-300 transition-colors"
          >
            {owner}/{repo}
          </a>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading ? "Reverse-engineering in progress..." : "Analysis complete"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["quick", "deep"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={isLoading}
              className={`rounded-md px-3 py-1.5 text-xs font-medium border transition-colors disabled:opacity-50 ${
                mode === m
                  ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                  : "border-[#2a2a3e] text-gray-400 hover:text-white"
              }`}
            >
              {m === "quick" ? "⚡ Quick" : "🔬 Deep"}
            </button>
          ))}
        </div>
      </div>

      {isLoading && !result && (
        <div className="space-y-3 animate-pulse">
          {[80, 65, 90, 55, 75].map((w, i) => (
            <div key={i} className="h-4 rounded bg-[#1a1a27]" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && <AnalysisDashboard markdown={result} isStreaming={isLoading} />}
    </div>
  );
}
