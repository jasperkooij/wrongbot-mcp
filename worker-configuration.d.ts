// Minimal hand-written Env type. Once you run `wrangler types` locally
// (see the "cf-typegen" script in package.json) this will be regenerated
// automatically from wrangler.jsonc and can replace this file.
interface Env {
  ASSETS: Fetcher;
  MCP_OBJECT: DurableObjectNamespace;
}
