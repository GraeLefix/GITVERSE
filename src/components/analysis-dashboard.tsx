"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  markdown: string;
  isStreaming?: boolean;
}

export function AnalysisDashboard({ markdown, isStreaming }: Props) {
  const [view, setView] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // Extract just the reconstruction prompt section if it exists
    const promptSection =
      markdown.split("## 📋 Reconstruction Prompt")[1]?.split("\n## ")[0]?.trim() ?? markdown;
    await navigator.clipboard.writeText(promptSection);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[#2a2a3e] bg-[#111120] overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[#1e1e2e] px-4 py-2.5 gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {(["rendered", "raw"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                view === t ? "bg-[#1e1e2e] text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "rendered" ? "Preview" : "Raw"}
            </button>
          ))}
          {isStreaming && (
            <span className="ml-2 flex items-center gap-1.5 text-xs text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Generating...
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="rounded-md border border-[#2a2a3e] px-3 py-1 text-xs font-medium text-gray-400 hover:border-indigo-500/50 hover:text-white transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy Prompt"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {view === "rendered" ? (
          <div className="prose prose-invert prose-sm max-w-none prose-dark">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
            {markdown}
          </pre>
        )}
      </div>
    </div>
  );
}
