# WrongBot 🙃

A chat bot — and a real [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server — that answers every question confidently and incorrectly.

Live at **https://wrongbot.jasperkooij.com**

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/jasperkooij)

It exists for two reasons:

1. **Satire.** It's a small, harmless joke about AI overconfidence and hallucination, made in the middle of a very earnest news cycle about both.
2. **Demo.** It's a working, minimal example of a remote MCP server deployed on Cloudflare Workers — something worth having a real, running example of rather than just reading about.

> ⚠️ **This project is intentionally wrong 100% of the time.** Do not use its output as a factual answer to anything. That's the entire point.

---

## Architecture

```
┌──────────────────────────────────────────┐
│         wrongbot.jasperkooij.com          │
│                                            │
│   /                → landing page + full  │  Static HTML/CSS/JS, served
│                       documentation +      │  from ./public via Workers
│                       in-browser demo      │  Assets. The chat widget
│                       widget               │  runs entirely client-side
│                                            │  (no server round-trip).
│                                            │
│   /mcp              → MCP server           │  Cloudflare Workers + Durable
│   /sse              → (legacy)             │  Objects, via the `agents`
│                                            │  package's McpAgent class.
│                                            │  Exposes one tool:
│                                            │  `get_wrong_answer`.
│                                            │
│   /api/wrong-answers.json → the wrong-    │  Same data the MCP tool
│                       answer bank as JSON  │  draws from, as plain JSON.
│                                            │
│   /robots.txt, /sitemap.xml, /llms.txt,   │  Static files served the
│   /llms-full.txt, /.well-known/*          │  same way as the landing page.
└──────────────────────────────────────────┘
```

Both the browser widget and the MCP tool share the same "wrongness engine" (`src/wrong-answers.ts`): naive keyword matching picks a bank of wrong answers, then every response gets a suspiciously high confidence score (90–100%, always) and a fabricated source ("per my uncle who works at Nintendo").

## Stack

- **Cloudflare Workers** — compute + static asset hosting, one deployment
- **Durable Objects** — required by the MCP Agent SDK to hold a session per connected client
- **`agents` (Cloudflare's MCP Agent SDK)** + **`@modelcontextprotocol/sdk`** — the actual MCP server implementation
- **Zod** — input schema validation for the MCP tool
- **Plain HTML/CSS/JS** — the landing page and demo widget, no build step, no framework

## Documentation & AI-agent readiness

The landing page (`public/index.html`) is the primary documentation: architecture, the full `get_wrong_answer` tool reference, how to connect a client, how to add more wrongness, and an FAQ — all as real HTML sections (`<h2>`/`<h3>`, semantic landmarks, a skip link), not just this README.

Beyond that, the site follows [The Website Specification](https://specification.website)'s `agent-readiness` and `seo` checklists as far as they apply to a small static + Workers site:

- **`/llms.txt`** and **`/llms-full.txt`** — a short index and a full Markdown dump of the docs, for AI agents that prefer Markdown to scraping HTML.
- **`/api/wrong-answers.json`** — the wrong-answer bank and fake-source list as JSON, served dynamically by the Worker from `src/wrong-answers.ts` (so it can't drift from the MCP tool's actual behavior).
- **`/robots.txt`** — an explicit `Allow` for named AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) rather than relying on the wildcard rule, plus an experimental `Content-Signal` line.
- **`/sitemap.xml`**, **`/.well-known/security.txt`**, **`/.well-known/api-catalog`** (an RFC 9727 linkset pointing at `/mcp` and the JSON endpoint).
- **JSON-LD** on the landing page — `WebSite`, `SoftwareApplication`, `Person`, and `FAQPage` structured data, plus Open Graph/Twitter meta tags and a canonical URL.
- **Security headers** (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and discovery `Link` headers (pointing at `llms.txt`, `sitemap.xml`, `api-catalog`) applied to every response in `src/index.ts`.

The whole point of WrongBot is that its *output* is always fake — so the strategy here is maximum crawlability paired with the falseness being declared everywhere an agent might look (the MCP tool description, `/llms.txt`, the page copy itself), rather than blocking crawlers.

Known gaps, if you want to push this further: no raster favicon set (only an SVG favicon — no `.ico`/`apple-touch-icon`/maskable PWA icon), no Open Graph image, and `/.well-known/api-catalog` is a best-effort linkset rather than a validated one (the RFC is young and tooling is sparse).

## Local development

```bash
npm install
npm run dev
```

This starts the Worker locally (default `http://localhost:8787`). The landing page is served at `/`, the MCP endpoint at `/mcp`.

To test the MCP server locally without a full client, point the [Cloudflare AI Playground](https://playground.ai.cloudflare.com/) at `http://localhost:8787/mcp`, or use `mcp-remote`:

```bash
npx mcp-remote http://localhost:8787/mcp
```

## Deploying

### 1. First deploy (to a `*.workers.dev` URL)

```bash
npm install
npx wrangler login        # opens a browser to authenticate with your Cloudflare account
npm run deploy
```

This deploys to `wrongbot-mcp.<your-subdomain>.workers.dev`. Confirm it works — load the URL, try the widget, and connect a client to `/mcp` — before moving to the custom domain.

### 2. Point `wrongbot.jasperkooij.com` at it

Since `jasperkooij.com` is already on Cloudflare, this is a Workers **custom domain**, not a separate DNS + hosting setup:

1. In the Cloudflare dashboard: **Workers & Pages → wrongbot-mcp → Settings → Domains & Routes → Add → Custom Domain**.
2. Enter `wrongbot.jasperkooij.com`. Cloudflare will automatically create the DNS record (since the zone is already on your account) and provision the TLS certificate.
3. Alternatively, do it from the CLI: uncomment the `routes` block in `wrangler.jsonc`:
   ```jsonc
   "routes": [
     { "pattern": "wrongbot.jasperkooij.com", "custom_domain": true }
   ]
   ```
   then run `npm run deploy` again.
4. Propagation is usually near-instant since it's all within one Cloudflare account/zone.

### 3. Verify

- Visit `https://wrongbot.jasperkooij.com` — the landing page and widget should load.
- Connect an MCP client to `https://wrongbot.jasperkooij.com/mcp` and call `get_wrong_answer`.

## Connecting an MCP client

**Claude Desktop / Claude Code** (`claude_desktop_config.json` or equivalent):

```json
{
  "mcpServers": {
    "wrongbot": {
      "command": "npx",
      "args": ["mcp-remote", "https://wrongbot.jasperkooij.com/mcp"]
    }
  }
}
```

**Cloudflare AI Playground:** go to https://playground.ai.cloudflare.com/ and paste in the server URL directly — no config needed.

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "wrongbot": {
      "url": "https://wrongbot.jasperkooij.com/mcp"
    }
  }
}
```

## Adding more wrongness

All the "logic" lives in `src/wrong-answers.ts` — it's a plain object of keyword → wrong-answer-bank, plus a list of fake sources. Add a new category or more absurd answers there; both the MCP tool and `/api/wrong-answers.json` pick it up automatically. The browser widget in `public/index.html` has its own inline copy of the bank for zero-dependency simplicity (so the widget block can be dropped into any page on its own, with no server) — keep it in sync if you edit `src/wrong-answers.ts`.

## License

MIT — see [LICENSE](./LICENSE). Be confidently wrong responsibly.
