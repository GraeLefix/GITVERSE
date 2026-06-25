# Changelog

All notable changes are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned
- Subfolder-scoped analysis (`/owner/repo/tree/path`)
- Private repo support (premium)
- Supabase prompt caching
- CLI: `npx gitverse owner/repo`
- VS Code extension

---

## [0.1.0] — 2026-06-25

### Added
- Initial release
- Quick + Deep reverse modes with multi-LLM support (Grok, OpenRouter, Azure, Google)
- Paste-code analysis with incremental `GITVERSE_DONE` batch trigger
- GitHub URL routing: `/owner/repo`
- Redirect: `/owner/repo/tree/...` to `/owner/repo`
- Prompt Library with 12 featured repos
- Pricing page (Free + Premium $9/mo)
- Per-IP rate limiting (20 req/min)
- Edge runtime for all API routes
- CI/CD GitHub Actions (lint, type-check, build, deploy)
- Full SEO: OpenGraph, Twitter cards, JSON-LD, sitemaps
