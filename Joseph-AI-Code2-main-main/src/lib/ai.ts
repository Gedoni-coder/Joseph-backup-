import type { ChatMessage } from "./chatbot-data";
import { getAllAppData, formatContextForPrompt } from "./app-context";
import {
  enhanceResponseWithWebContext,
  shouldPerformWebSearch,
} from "./web-search";

export interface AIOptions {
  model?: string;
  temperature?: number;
  system?: string;
  webContext?: string | null;
  includeAppContext?: boolean;
  performWebSearch?: boolean;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as
  | string
  | undefined;
const DEFAULT_OPENAI_MODEL =
  (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || "gpt-4o-mini";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as
  | string
  | undefined;
const DEFAULT_GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ||
  "gemini-1.5-flash";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const DEFAULT_GROQ_MODEL =
  (import.meta.env.VITE_GROQ_MODEL as string | undefined) ||
  "llama-3.3-70b-versatile";

function toOpenAIMessages(
  history: ChatMessage[],
  system?: string,
  webContext?: string,
) {
  const msgs: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [];
  const sysParts: string[] = [];
  if (system && system.trim()) sysParts.push(system.trim());
  if (webContext && webContext.trim())
    sysParts.push(`Relevant web context (summarized):\n${webContext.trim()}`);
  if (sysParts.length) {
    msgs.push({ role: "system", content: sysParts.join("\n\n") });
  }
  for (const m of history) {
    msgs.push({
      role: m.type === "user" ? "user" : "assistant",
      content: m.content,
    });
  }
  return msgs;
}

function toGeminiBody(
  history: ChatMessage[],
  system?: string,
  webContext?: string,
  model?: string,
  temperature?: number,
) {
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  const sysParts: string[] = [];
  if (system && system.trim()) sysParts.push(system.trim());
  if (webContext && webContext.trim())
    sysParts.push(`Relevant web context (summarized):\n${webContext.trim()}`);
  const system_instruction = sysParts.length
    ? { role: "system", parts: [{ text: sysParts.join("\n\n") }] }
    : undefined;

  for (const m of history) {
    contents.push({
      role: m.type === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    });
  }

  return {
    model: model || DEFAULT_GEMINI_MODEL,
    contents,
    system_instruction,
    generationConfig: {
      temperature: typeof temperature === "number" ? temperature : 0.3,
    },
  };
}

export async function generateAIResponse(
  history: ChatMessage[],
  opts: AIOptions = {},
): Promise<string | null> {
  // Default to including app context but disable web search due to network reliability issues
  const includeAppContext = opts.includeAppContext !== false;
  const performWebSearch = opts.performWebSearch === true;

  let enhancedSystem = opts.system || "";
  let enhancedWebContext = opts.webContext || "";

  try {
    // Collect app context if enabled
    if (includeAppContext) {
      const appData = getAllAppData();
      const contextStr = formatContextForPrompt(appData);
      enhancedSystem = enhancedSystem
        ? `${enhancedSystem}\n\n### User Data Context\n${contextStr}`
        : `You are Joseph AI, an expert business advisor with access to the user's business data.\n\n### User Data Context\n${contextStr}`;
    }

    // Perform web search if enabled and query suggests need
    if (performWebSearch && history.length > 0) {
      try {
        const lastUserMessage = history[history.length - 1];
        if (lastUserMessage.type === "user") {
          try {
            const shouldSearch = await shouldPerformWebSearch(
              lastUserMessage.content,
            );
            if (shouldSearch) {
              try {
                const webContext = await enhanceResponseWithWebContext(
                  lastUserMessage.content,
                );
                if (webContext) {
                  enhancedWebContext = enhancedWebContext
                    ? `${enhancedWebContext}\n\n${webContext}`
                    : webContext;
                }
              } catch (searchError) {
                // Web search context enhancement failed - continue without it
                // This is non-critical and should not block response generation
              }
            }
          } catch (shouldSearchError) {
            // Check whether to search failed - continue without it
          }
        }
      } catch (outerError) {
        // Outer error handling for any unexpected issues with web search
      }
    }
  } catch (e) {
    // Silently handle context enhancement errors
  }

  // Always try Groq first with a directly integrated key
  try {
    const model = opts.model || DEFAULT_GROQ_MODEL;
    const body = {
      model,
      temperature:
        typeof opts.temperature === "number" ? opts.temperature : 0.3,
      messages: toOpenAIMessages(history, enhancedSystem, enhancedWebContext),
    } as const;
    const res = await fetch("/api/ai/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (error) {
    // Groq endpoint unavailable - continue to next provider
  }

  // Then OpenAI
  if (OPENAI_API_KEY) {
    try {
      const model = opts.model || DEFAULT_OPENAI_MODEL;
      const body = {
        model,
        temperature:
          typeof opts.temperature === "number" ? opts.temperature : 0.3,
        messages: toOpenAIMessages(history, enhancedSystem, enhancedWebContext),
      } as const;

      const res = await fetch("/api/ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const content: string | undefined =
          data?.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch {}
  }

  // Then Gemini
  if (GEMINI_API_KEY) {
    try {
      const body = toGeminiBody(
        history,
        enhancedSystem || undefined,
        enhancedWebContext || undefined,
        opts.model,
        opts.temperature,
      );
      const res = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upstreamModel: (body as any).model,
          upstreamBody: {
            contents: (body as any).contents,
            system_instruction: (body as any).system_instruction,
            generationConfig: (body as any).generationConfig,
          },
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .map((p: any) => p?.text)
        .filter(Boolean)
        .join("\n");
      return text || null;
    } catch {
      return null;
    }
  }

  return null;
}
