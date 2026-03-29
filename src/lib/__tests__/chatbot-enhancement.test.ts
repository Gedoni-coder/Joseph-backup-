import { describe, expect, it } from "vitest";

import { formatContextForPrompt, getAllAppData } from "../app-context";
import { extractSearchTerms, shouldPerformWebSearch } from "../web-search";

describe("chatbot enhancement helpers", () => {
  it("exports app-context helpers", () => {
    expect(typeof getAllAppData).toBe("function");
    expect(typeof formatContextForPrompt).toBe("function");
  });

  it("extracts useful search terms from a timely query", () => {
    const terms = extractSearchTerms("What is the latest market trend in e-commerce?");
    expect(terms.length).toBeGreaterThan(0);
    expect(terms.join(" ")).toContain("market");
  });

  it("flags timely queries for web search", async () => {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { onLine: true },
    });

    await expect(
      shouldPerformWebSearch("What is the latest market trend in e-commerce?"),
    ).resolves.toBe(true);
  });
});
