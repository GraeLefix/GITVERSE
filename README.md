<div align="center">

# GITVERSE

**Reverse engineer any codebase into a build prompt.**

Paste code → AI analyzes → Get a copy-paste-ready reconstruction prompt for Cursor, Claude, Codex, or any AI coding agent.

[![Live Demo](https://img.shields.io/badge/Live_Demo-gitverse.id-6366f1?style=flat-square)](http://gitverse.id/)
[![Stars](https://img.shields.io/github/stars/GraeLefix/GITVERSE?style=flat-square&color=6366f1)](https://github.com/GraeLefix/GITVERSE/stargazers)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

</div>

---

## What is GITVERSE?

**GITVERSE** is an AI-powered reverse engineering tool that turns any codebase into a structured build prompt you can hand directly to an AI coding agent.

Inspired by [gitverse.id](http://gitverse.id/) — the simplest way to understand and rebuild any code.

---

## How it works

```
01 — Paste your files   →   02 — AI Analyzes   →   03 — Get Build Prompt
```

1. **Paste code** — drop any files or GitHub URLs
2. **AI analyzes** — full breakdown of architecture, dependencies, APIs, and business logic
3. **Get prompt** — one exhaustive, copy-paste-ready reconstruction prompt

---

## Features

| Feature | Description |
|---|---|
| 🧠 AI Analysis | Full breakdown of tech stack, files, APIs, and business logic |
| 📐 ASCII Blueprint | System architecture as ASCII diagram with components and data flows |
| 📋 Build Prompt | One exhaustive prompt with every file, exact dependencies, env vars, and deployment steps |
| 🔗 GitHub Integration | Paste any public GitHub URL and reverse engineer the entire repo |
| ⚡ Incremental Mode | Type `GITVERSE_DONE` after pasting multiple files to trigger batch analysis |
| 🌐 Multi-LLM Support | Works with Grok, OpenRouter, Azure OpenAI, Google AI Studio |
| 🔒 Privacy First | Your code is never stored permanently |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI Providers**: Grok (xAI), OpenRouter, Azure OpenAI, Google AI Studio
- **Database**: Supabase (optional — for prompt caching)
- **Payments**: Stripe (optional — for premium features)
- **Analytics**: Vercel Analytics

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- At least one LLM API key (see [Configuration](#configuration))

### Installation

```bash
git clone https://github.com/GraeLefix/GITVERSE.git
cd GITVERSE
pnpm install
cp .env.example .env.local
# Fill in your LLM API key
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start reversing code.

---

## Configuration

Copy `.env.example` to `.env.local` and fill in at least one LLM API key.

### LLM Providers (at least one required)

| Provider | Env Key | Default Model |
|---|---|---|
| Grok (xAI) | `XAI_API_KEY` | grok-3 |
| OpenRouter | `OPENROUTER_API_KEY` | google/gemini-2.5-pro |
| Azure OpenAI | `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_BASE_URL` | gpt-5.4 |
| Google AI Studio | `GOOGLE_GENERATIVE_AI_API_KEY` | gemini-2.5-pro |

Set `GITREVERSE_QUICK_LLM` to pin a provider, or leave unset for `auto` mode (Grok → OpenRouter → Azure → Google).

### Optional Services

```env
# GitHub — increases API rate limits
GITHUB_TOKEN=ghp_...

# Supabase — prompt caching & /library search
SUPABASE_URL=https://...supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJ...

# Stripe — premium features
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Project Structure

```
GITVERSE/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — paste code, get prompt
│   ├── [owner]/[repo]/         # GitHub URL routing (/vercel/next.js)
│   ├── api/                    # API routes (reverse, analyze, stripe)
│   └── library/                # Saved prompt library
├── components/                 # React components
│   ├── reverse-prompt-home.tsx # Main UI
│   ├── analysis-dashboard.tsx  # Results display
│   └── ui/                     # shadcn/ui components
├── lib/                        # Core utilities
│   ├── llm.ts                  # Multi-provider LLM abstraction
│   ├── github.ts               # GitHub API helpers
│   └── prompts.ts              # Prompt engineering
├── .env.example                # Environment template
└── package.json
```

---

## Usage Examples

### Reverse a GitHub repo

Visit directly in browser:
```
http://gitverse.id/vercel/next.js
http://gitverse.id/supabase/supabase
http://gitverse.id/facebook/react
```

### Paste code directly

1. Go to [gitverse.id](http://gitverse.id/)
2. Paste your code files into the editor
3. Click **Get Prompt**
4. Copy the reconstruction prompt into Cursor, Claude Code, or Codex

### Incremental mode (multiple files)

Paste multiple files one by one, then type `GITVERSE_DONE` to trigger batch analysis.

---

## Contributing

Contributions are welcome!

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/GITVERSE.git

# Create a feature branch
git checkout -b feat/your-feature-name

# Make changes, then open a PR
git push origin feat/your-feature-name
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Links

- **Live App**: [gitverse.id](http://gitverse.id/)
- **Original Inspiration**: [filiksyos/gitreverse](https://github.com/filiksyos/gitreverse)
- **GitHub**: [GraeLefix/GITVERSE](https://github.com/GraeLefix/GITVERSE)

---

<div align="center">

Built with ❤️ by [GraeLefix](https://github.com/GraeLefix) · Star ⭐ if you find it useful

</div>
