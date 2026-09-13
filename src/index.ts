import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getWrongAnswer } from "./wrong-answers";

// WrongBot: a Model Context Protocol server that answers every question
// wrong, on purpose, with unearned confidence. It exists as (a) a joke about
// AI overconfidence and (b) a working demo of how little code it takes to
// stand up a real remote MCP server on Cloudflare Workers.
//
// Any MCP-compatible client (Claude, Cursor, the Cloudflare AI Playground,
// etc.) can connect to this Worker's /mcp endpoint and call the
// `get_wrong_answer` tool directly.

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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return WrongBotMCP.serve("/mcp").fetch(request, env, ctx);
    }

    // Legacy SSE transport, for older MCP clients that haven't moved to
    // streamable HTTP yet.
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return WrongBotMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    // Everything else (the landing page) is served from ./public via the
    // ASSETS binding configured in wrangler.jsonc.
    return env.ASSETS.fetch(request);
  },
};
