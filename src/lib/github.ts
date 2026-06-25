import type { RepoContext, FileTreeEntry } from "./types";

const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;

function ghHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;
  return headers;
}

async function ghFetch(path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: ghHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function reverseRepo(
  owner: string,
  repo: string
): Promise<RepoContext | null> {
  const [repoData, treeData, readmeData] = await Promise.allSettled([
    ghFetch(`/repos/${owner}/${repo}`),
    ghFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=0`),
    ghFetch(`/repos/${owner}/${repo}/readme`),
  ]);

  const meta = repoData.status === "fulfilled" ? repoData.value : null;
  if (!meta || meta.message === "Not Found") return null;

  const treeRaw = treeData.status === "fulfilled" ? treeData.value : null;
  const fileTree: FileTreeEntry[] = (treeRaw?.tree ?? [])
    .filter((f: { path: string }) => !f.path.includes("/"))
    .map((f: { path: string; type: string; size?: number }) => ({
      path: f.path,
      type: f.type as "blob" | "tree",
      size: f.size,
    }))
    .slice(0, 100);

  let readme: string | null = null;
  if (readmeData.status === "fulfilled" && readmeData.value?.content) {
    try {
      readme = Buffer.from(readmeData.value.content, "base64")
        .toString("utf-8")
        .slice(0, 8000);
    } catch {}
  }

  let packageJson: Record<string, unknown> | null = null;
  try {
    const pkgRes = await ghFetch(`/repos/${owner}/${repo}/contents/package.json`);
    if (pkgRes?.content) {
      packageJson = JSON.parse(
        Buffer.from(pkgRes.content, "base64").toString("utf-8")
      );
    }
  } catch {}

  const techStack = inferTechStack(meta, fileTree, packageJson);

  return {
    owner,
    repo,
    description: meta.description ?? null,
    language: meta.language ?? null,
    stars: meta.stargazers_count ?? 0,
    forks: meta.forks_count ?? 0,
    topics: meta.topics ?? [],
    readme,
    fileTree,
    packageJson,
    techStack,
  };
}

function inferTechStack(
  meta: Record<string, unknown>,
  tree: FileTreeEntry[],
  pkg: Record<string, unknown> | null
): string[] {
  const stack = new Set<string>();
  const files = tree.map((f) => f.path.toLowerCase());

  if (meta.language) stack.add(meta.language as string);
  if (files.includes("package.json")) stack.add("Node.js");
  if (files.some((f) => f.startsWith("next.config"))) stack.add("Next.js");
  if (files.some((f) => f.startsWith("vite.config"))) stack.add("Vite");
  if (files.some((f) => f.startsWith("tailwind.config"))) stack.add("Tailwind CSS");
  if (files.includes("drizzle.config.ts")) stack.add("Drizzle ORM");
  if (files.includes("dockerfile") || files.includes("docker-compose.yml")) stack.add("Docker");
  if (files.includes("requirements.txt") || files.includes("pyproject.toml")) stack.add("Python");
  if (files.includes("go.mod")) stack.add("Go");
  if (files.includes("cargo.toml")) stack.add("Rust");

  if (pkg?.dependencies) {
    const deps = Object.keys(pkg.dependencies as Record<string, string>);
    if (deps.some((d) => d.includes("react"))) stack.add("React");
    if (deps.some((d) => d.includes("vue"))) stack.add("Vue");
    if (deps.some((d) => d.includes("svelte"))) stack.add("Svelte");
    if (deps.some((d) => d.includes("express"))) stack.add("Express");
    if (deps.some((d) => d.includes("fastify"))) stack.add("Fastify");
    if (deps.some((d) => d.includes("supabase"))) stack.add("Supabase");
    if (deps.some((d) => d.includes("stripe"))) stack.add("Stripe");
    if (deps.some((d) => d.includes("drizzle"))) stack.add("Drizzle ORM");
    if (deps.some((d) => d.includes("prisma"))) stack.add("Prisma");
  }

  return Array.from(stack).slice(0, 12);
}

export async function searchRepos(query: string): Promise<Array<{
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}>> {
  const res = await ghFetch(
    `/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=12`
  );
  return res?.items ?? [];
}
