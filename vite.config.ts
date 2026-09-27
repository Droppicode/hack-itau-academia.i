import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { chat, type ChatBody } from "./api/chat";

function localApi(env: Record<string, string>): Plugin {
  const mount = (use: (path: string, fn: (req: IncomingMessage, res: ServerResponse) => void) => void) =>
    use("/api/chat", (req, res) => {
      let raw = "";
      req.on("data", (c: Buffer) => (raw += c));
      req.on("end", async () => {
        let out;
        try {
          out = req.method === "POST" ? await chat(JSON.parse(raw || "{}") as ChatBody, env.GEMINI_API_KEY, env.GEMINI_MODEL || undefined) : { status: 405, json: { error: "method_not_allowed" } };
        } catch {
          out = { status: 500, json: { error: "internal" } };
        }
        res.statusCode = out.status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(out.json));
      });
    });
  return {
    name: "local-api",
    configureServer(s) {
      mount((p, f) => {
        s.middlewares.use(p, f);
      });
    },
    configurePreviewServer(s) {
      mount((p, f) => {
        s.middlewares.use(p, f);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return { plugins: [react(), localApi(env)] };
});
