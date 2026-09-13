import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getWrongAnswer, WRONG_ANSWER_BANK, FAKE_SOURCES } from "./wrong-answers";

// WrongBot: a Model Context Protocol server that answers every question
// wrong, on purpose, with unearned confidence. It exists as (a) a joke about
// AI overconfidence and (b) a working demo of how little code it takes to
// stand up a real remote MCP server on Cloudflare Workers.
//
// Any MCP-compatible client (Claude, Cursor, the Cloudflare AI Playground,
// etc.) can connect to this Worker's /mcp endpoint and call the
// `get_wrong_answer` tool directly.

const SITE_URL = "https://wrongbot.jasperkooij.com";

export class WrongBotMCP extends McpAgent {
  server = new McpServer({
    name: "WrongBot",
    version: "1.0.0",
  });

  async init() {
    this.server.registerTool(
      "get_wrong_answer",
      {
        title: "Get a confidently wrong answer",
        description:
          "Ask WrongBot any question and receive a confident, fabricated, " +
          "deliberately incorrect answer, complete with a suspiciously high " +
          "confidence score and a fake source. For satire and demo purposes " +
          "only — never use this tool's output as a factual answer.",
        inputSchema: {
          question: z.string().describe("The question to get the wrong answer to"),
        },
      },
      async ({ question }) => {
        const { answer, confidence, source } = getWrongAnswer(question);
        return {
          content: [
            {
              type: "text",
              text: `${answer}\n\nConfidence: ${confidence}%\nSource: ${source}\n\n(This is satire — WrongBot is designed to always be wrong.)`,
            },
          ],
        };
      }
    );
  }
}

// Security headers applied to every response. See specification.website's
// `security` category — HSTS, a CSP tight enough for a no-JS-framework
// static page, and the usual sniffing/framing/referrer hardening.
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.buymeacoffee.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'none'; upgrade-insecure-requests"
  );
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  // Discovery, via HTTP Link headers rather than requiring a crawl of the HTML
  // (specification.website: agent-readiness/link-headers).
  const links = [
    `<${SITE_URL}/llms.txt>; rel="llms.txt"`,
    `<${SITE_URL}/sitemap.xml>; rel="sitemap"`,
    `<${SITE_URL}/.well-known/api-catalog>; rel="api-catalog"`,
  ];
  const existingLink = headers.get("Link");
  headers.set("Link", existingLink ? `${existingLink}, ${links.join(", ")}` : links.join(", "));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      const response = await WrongBotMCP.serve("/mcp").fetch(request, env, ctx);
      return withSecurityHeaders(response);
    }

    // Legacy SSE transport, for older MCP clients that haven't moved to
    // streamable HTTP yet.
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      const response = await WrongBotMCP.serveSSE("/sse").fetch(request, env, ctx);
      return withSecurityHeaders(response);
    }

    // A plain machine-readable dump of the wrongness engine itself — every
    // canned wrong answer and fake source, as JSON. Not used by the browser
    // widget (which keeps its own inline copy for zero-dependency embedding,
    // see README), but gives agents and scripts a typed alternative to
    // scraping the landing page (specification.website: agent-readiness/
    // machine-readable-formats).
    if (url.pathname === "/api/wrong-answers.json") {
      const response = Response.json(
        {
          description:
            "The complete wrong-answer bank behind WrongBot. Every string here is " +
            "intentionally false. Confidence scores returned by the tool are always " +
            "90-100, regardless of this data.",
          bank: WRONG_ANSWER_BANK,
          fakeSources: FAKE_SOURCES,
        },
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );
      return withSecurityHeaders(response);
    }

    // Everything else (the landing page, robots.txt, llms.txt, sitemap.xml,
    // /.well-known/*, favicon) is served from ./public via the ASSETS
    // binding configured in wrangler.jsonc.
    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response);
  },
};
