# Agent instructions for this repository

WrongBot is intentionally simple. Before making a change, read `README.md` for the full picture — this file only covers what an AI coding agent needs to not break the joke.

## The one rule that matters

Every answer WrongBot's `get_wrong_answer` tool returns must stay **wrong on purpose**. Don't "fix" the wrongness engine in `src/wrong-answers.ts` to be more accurate — that would break the entire point of the project. Bugs in *delivery* (crashes, bad types, broken endpoints) are real bugs; bugs in the *content* of an answer are not bugs.

## Where things live

- `src/wrong-answers.ts` — the wrong-answer bank and fake-source list. The only file with "logic."
- `src/index.ts` — the Cloudflare Worker: MCP server (`/mcp`, `/sse`), the JSON API, security headers, routing.
- `public/index.html` — the landing page, including a **self-contained** copy of the chat widget (markup + `<style>` + `<script>`) kept intentionally dependency-free so it can be lifted into another page as-is. It has its own inline copy of the wrong-answer bank — keep it in sync with `src/wrong-answers.ts` if you touch either.
- `public/*.json`, `public/.well-known/*` — machine-readable discovery files (`llms.txt`, `openapi.json`, MCP server card, ARD catalog, agent-skills index, robots.txt, etc.) for AI agents and crawlers. If you add a real capability, reflect it in the relevant one of these rather than letting them drift.

## Before committing

- `npx tsc --noEmit` must pass.
- If you touch `src/index.ts`, run `npm run dev` and sanity-check `/mcp` with an `initialize` + `tools/call` round trip, and `/` for the landing page — see the README's "Local development" section.
- Don't add authentication, payment protocols, or other enterprise API scaffolding "for completeness." This is a free, single-tool satirical demo; padding it with unused surface area is worse than not having it. See the README's "Documentation & AI-agent readiness" section for what was deliberately left out and why.

## Deploying

Production auto-deploys on push to `main` via Cloudflare Workers Builds (Git integration) — no manual step needed once a PR merges.
