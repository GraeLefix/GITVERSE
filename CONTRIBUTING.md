# Contributing to GITVERSE

Thank you for considering contributing to GITVERSE! Here's how to get involved.

## Development Setup

```bash
git clone https://github.com/GraeLefix/GITVERSE.git
cd GITVERSE
pnpm install
cp .env.example .env.local
# Fill in at least one LLM API key
pnpm dev
```

## Branching Convention

| Branch prefix | Purpose |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Tooling, deps, CI |
| `refactor/` | Code restructuring |

## Pull Request Process

1. Fork the repo and create your branch from `main`
2. Add tests if applicable
3. Make sure `pnpm lint` passes
4. Open a PR with a clear title and description
5. Link any related issues

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling (no inline styles)
- Functional React components with hooks
- Meaningful variable names — no abbreviations

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser)

## Feature Requests

Open an issue with the `enhancement` label describing the use case.

---

Thank you for making GITVERSE better!
