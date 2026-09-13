---
title: WrongBot — the MCP server that's always confidently wrong
description: A satirical Model Context Protocol (MCP) server and chat widget that answers every question confidently and incorrectly, on purpose.
canonical: https://wrongbot.jasperkooij.com/
last-updated: 2026-09-13
---

# WrongBot

🛑 Satire / demo project — WrongBot is designed to always be wrong. Never trust its answers.

WrongBot is a small satirical project: a chat bot — and a real [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server — that answers every question confidently and incorrectly. It's a joke about AI overconfidence, and a working demo of how easy it is to stand up a real MCP server on Cloudflare Workers.

The chat widget on the live page runs entirely in the browser, with no server round-trip. The MCP server is the same "wrongness engine," exposed as a tool any MCP-compatible AI client can call directly.

**The disclaimer matters:** the bot's *output* — every answer, confidence score, and source — is always fabricated. This page's own description of what WrongBot is and how to use it is accurate.

## Connect an AI client to WrongBot via MCP

Server URL: `https://wrongbot.jasperkooij.com/mcp`

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

Or paste the server URL directly into the [Cloudflare AI Playground](https://playground.ai.cloudflare.com/) — no config needed. Once connected, the tool is `get_wrong_answer` — call it with any question and it returns a confident, fabricated answer, a suspiciously high confidence score, and a fake source.

## Documentation

Full documentation — architecture, the tool's input/output schema, adding more wrongness, machine-readable resources for agents — lives at [/llms-full.txt](https://wrongbot.jasperkooij.com/llms-full.txt) and on the [live page](https://wrongbot.jasperkooij.com/).

## FAQ

**Is any of this real?** No. Not the answers, not the confidence scores, not the sources. That is the entire feature.

**Can I use WrongBot's output as a citation?** No. Every answer, confidence score, and source it returns is fabricated on purpose.

**Why does this exist?** Satire about AI overconfidence, and a minimal working reference for standing up a remote MCP server on Cloudflare Workers.

## Source

Code, local development, and full deployment instructions: [github.com/jasperkooij/wrongbot-mcp](https://github.com/jasperkooij/wrongbot-mcp) (MIT licensed).
