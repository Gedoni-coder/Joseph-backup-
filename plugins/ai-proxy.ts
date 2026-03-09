import type { Plugin } from "vite";

export default function aiProxy(): Plugin {
  return {
    name: "ai-proxy",
    configureServer(server) {
      const parseBody = async (req: any): Promise<any> => {
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve) => {
          req.on("data", (c: Buffer) => chunks.push(c));
          req.on("end", () => resolve());
        });
        const raw = Buffer.concat(chunks).toString("utf-8");
        try {
          return raw ? JSON.parse(raw) : {};
        } catch {
          return {};
        }
      };

      server.middlewares.use("/api/ai/gemini", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        const body = await parseBody(req);
        const apiKey =
          process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end("Missing GEMINI_API_KEY");
          return;
        }
        const model = body?.model || body?.upstreamModel || "gemini-1.5-flash";
        const upstreamBody = body?.upstreamBody || {
          contents: body?.contents || [],
          system_instruction: body?.system_instruction,
          generationConfig: body?.generationConfig,
        };
        try {
          const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
          const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(upstreamBody),
          });
          const text = await r.text();
          res.statusCode = r.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (e) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "Upstream error" }));
        }
      });

      server.middlewares.use("/api/ai/openai", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        const body = await parseBody(req);
        const apiKey =
          process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end("Missing OPENAI_API_KEY");
          return;
        }
        try {
          const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: body?.model || "gpt-4o-mini",
              temperature:
                typeof body?.temperature === "number" ? body.temperature : 0.3,
              messages: body?.messages || [],
            }),
          });
          const text = await r.text();
          res.statusCode = r.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (e) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "Upstream error" }));
        }
      });

      server.middlewares.use("/api/ai/groq", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        const body = await parseBody(req);
        const apiKey =
          process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end("Missing GROQ_API_KEY");
          return;
        }
        try {
          const r = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: body?.model || "llama-3.3-70b-versatile",
                temperature:
                  typeof body?.temperature === "number"
                    ? body.temperature
                    : 0.3,
                messages: body?.messages || [],
              }),
            },
          );
          const text = await r.text();
          res.statusCode = r.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (e) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "Upstream error" }));
        }
      });

      // Auth API proxy to bypass CORS issues
      server.middlewares.use("/api/auth", async (req, res) => {
        const authApiBase = process.env.VITE_AUTH_API_BASE || "http://127.0.0.1:8000/api/auth";

        const pathname = req.url.split("?")[0]; // Remove query string
        const upstreamUrl = `${authApiBase}${pathname}`;

        try {
          const body =
            req.method !== "GET" ? await parseBody(req) : undefined;
          const r = await fetch(upstreamUrl, {
            method: req.method,
            headers: {
              "Content-Type": "application/json",
              ...(req.headers.authorization && {
                Authorization: req.headers.authorization,
              }),
            },
            ...(body && { body: JSON.stringify(body) }),
          });

          const text = await r.text();
          res.statusCode = r.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (e) {
          console.error("Auth proxy error:", e);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "Upstream error" }));
        }
      });
    },
  };
}
