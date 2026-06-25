"use client";

import Link from "next/link";
import { formatStars } from "@/lib/utils";

const FEATURED = [
  { owner: "vercel", repo: "next.js", stars: 132000, lang: "TypeScript", desc: "The React Framework for the Web" },
  { owner: "supabase", repo: "supabase", stars: 80000, lang: "TypeScript", desc: "Open source Firebase alternative" },
  { owner: "shadcn-ui", repo: "ui", stars: 92000, lang: "TypeScript", desc: "Beautifully designed components built with Radix UI and Tailwind" },
  { owner: "tiangolo", repo: "fastapi", stars: 85000, lang: "Python", desc: "Modern, fast Python web framework for building APIs" },
  { owner: "facebook", repo: "react", stars: 234000, lang: "JavaScript", desc: "The library for web and native user interfaces" },
  { owner: "microsoft", repo: "vscode", stars: 168000, lang: "TypeScript", desc: "Visual Studio Code — Code editing. Redefined." },
  { owner: "ollama", repo: "ollama", stars: 107000, lang: "Go", desc: "Get up and running with large language models locally" },
  { owner: "astral-sh", repo: "uv", stars: 52000, lang: "Rust", desc: "An extremely fast Python package manager and resolver" },
  { owner: "trpc", repo: "trpc", stars: 38000, lang: "TypeScript", desc: "End-to-end typesafe APIs made easy" },
  { owner: "biomejs", repo: "biome", stars: 17000, lang: "Rust", desc: "One toolchain for your web project" },
  { owner: "drizzle-team", repo: "drizzle-orm", stars: 27000, lang: "TypeScript", desc: "Headless TypeScript ORM with a head" },
  { owner: "elysiajs", repo: "elysia", stars: 12000, lang: "TypeScript", desc: "Ergonomic Framework for Humans" },
];

export function LibraryView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Prompt Library</h1>
        <p className="mt-2 text-sm text-gray-400">
          Browse popular GitHub repos. Click any card to generate a build prompt instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED.map(({ owner, repo, stars, lang, desc }) => (
          <Link
            key={`${owner}/${repo}`}
            href={`/${owner}/${repo}`}
            className="group rounded-xl border border-[#2a2a3e] bg-[#16161f] p-5 hover:border-indigo-500/50 hover:bg-[#1a1a27] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {owner}/{repo}
                </div>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{desc}</p>
              </div>
              <span className="shrink-0 rounded-full border border-[#2a2a3e] px-2 py-0.5 text-xs text-gray-500">
                {lang}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>⭐ {formatStars(stars)}</span>
              <span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">
                Reverse →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
