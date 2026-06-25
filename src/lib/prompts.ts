import type { RepoContext } from "./types";

export function buildSystemPrompt(): string {
  return `You are GITVERSE — an expert code archaeologist and AI prompt engineer.
Your job is to deeply analyze a GitHub repository and produce a comprehensive,
structured "build prompt" that an AI coding agent (Cursor, Claude Code, Codex)
can use to recreate the project from scratch.

Your output MUST follow this exact structure:

## Analysis Dashboard
Summary of what the project does and who it is for.

## Tech Stack
Bullet list of all technologies, frameworks, libraries, and tools detected.

## File Structure
Key directories and files with a one-line purpose for each.

## API Routes / Endpoints
Table of all routes/endpoints if applicable.

## Environment Variables
Table of all required and optional env vars with descriptions and examples.

## ASCII Architecture Blueprint
ASCII diagram showing the system architecture with components, data flows, and dependencies.

## Reconstruction Prompt
A complete, exhaustive prompt in plain language that someone could paste directly into
Cursor, Claude Code, or Codex to rebuild this project from scratch.
Include: tech stack with versions, file structure, all dependencies, database schema,
API routes, auth flow, environment variables, and deployment steps.

Be precise, complete, and opinionated. No fluff.`;
}

export function buildUserPrompt(ctx: RepoContext, mode: string): string {
  const tree = ctx.fileTree
    .map((f) => `  ${f.type === "tree" ? "[dir]" : "[file]"} ${f.path}`)
    .join("\n");

  const deps = ctx.packageJson
    ? Object.entries({
        ...(ctx.packageJson.dependencies as Record<string, string> ?? {}),
        ...(ctx.packageJson.devDependencies as Record<string, string> ?? {}),
      })
        .slice(0, 40)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join("\n")
    : "Not available";

  return `Repository: ${ctx.owner}/${ctx.repo}
Description: ${ctx.description ?? "No description"}
Primary Language: ${ctx.language ?? "Unknown"}
Stars: ${ctx.stars.toLocaleString()} | Forks: ${ctx.forks.toLocaleString()}
Topics: ${ctx.topics.join(", ") || "none"}
Detected Stack: ${ctx.techStack.join(", ") || "unknown"}
Mode: ${mode === "deep" ? "DEEP (exhaustive analysis)" : "QUICK (concise analysis)"}

--- Root File Tree ---
${tree || "  (empty)"}

--- Dependencies ---
${deps}

--- README (first 6000 chars) ---
${ctx.readme ? ctx.readme.slice(0, 6000) : "(no README)"}

Analyze this repository and produce the full GITVERSE output.
Be thorough. Include everything needed to reconstruct this project from scratch.`;
}

export function buildAnalyzePrompt(code: string, filename?: string): string {
  return `Analyze the following code${filename ? ` from file: ${filename}` : ""} and produce a GITVERSE analysis.

Follow the system prompt structure. Focus on:
1. What this code does and its role in the larger system
2. Dependencies and imports used
3. Architectural patterns detected
4. A reconstruction prompt for this specific file/component

--- CODE ---
${code.slice(0, 80_000)}`;
}
