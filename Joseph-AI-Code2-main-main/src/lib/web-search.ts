/**
 * Web search functionality to complement chatbot responses
 * Uses DuckDuckGo API (free, no key required) and Jina for content extraction
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function performWebSearch(query: string): Promise<SearchResult[]> {
  // First check if browser is online
  if (!navigator.onLine) {
    return [];
  }

  try {
    // Use DuckDuckGo Instant Answer API with no-cors mode
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          mode: "no-cors",
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      // In no-cors mode, response type will be opaque and we can't access the body
      // So we need to try a different approach or skip web search gracefully
      if (response.type === "opaque") {
        // CORS blocked - return empty results gracefully
        return [];
      }

      if (!response.ok) {
        return [];
      }

      const data = (await response.json()) as any;
      const results: SearchResult[] = [];

      // Parse DuckDuckGo response
      if (data.AbstractText) {
        results.push({
          title: data.AbstractTitle || "Search Summary",
          url: data.AbstractURL || "https://duckduckgo.com",
          snippet: data.AbstractText,
        });
      }

      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(" ")[0] || "Related",
              url: topic.FirstURL,
              snippet: topic.Text,
            });
          }
        });
      }

      return results;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Silently fail on any fetch error - web search is optional enhancement
      return [];
    }
  } catch (error) {
    // Silently fail - web search is optional enhancement, not critical
    return [];
  }
}

export async function fetchWebPageText(rawUrl: string): Promise<string | null> {
  if (!navigator.onLine) return null;

  try {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    const readerUrl = `https://r.jina.ai/${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(readerUrl, {
        method: "GET",
        headers: {
          Accept: "text/plain, text/markdown, */*",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const text = await res.text();
      if (!text || !text.trim()) return null;
      const maxLen = 8000;
      return text.length > maxLen ? text.slice(0, maxLen) : text;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Silently fail on fetch errors - this is optional enhancement
      return null;
    }
  } catch {
    return null;
  }
}

export async function searchAndSummarize(
  query: string,
  maxResults: number = 3,
): Promise<string> {
  const results = await performWebSearch(query);

  if (results.length === 0) {
    return "";
  }

  const summaryParts: string[] = ["### Web Search Results"];

  for (const result of results.slice(0, maxResults)) {
    summaryParts.push(`\n**${result.title}**`);
    summaryParts.push(`Source: ${result.url}`);
    summaryParts.push(`${result.snippet}`);
  }

  return summaryParts.join("\n");
}

export async function enhanceResponseWithWebContext(
  query: string,
  maxSearchResults: number = 2,
): Promise<string> {
  const searchResults = await performWebSearch(query);

  if (searchResults.length === 0) {
    return "";
  }

  let context = "### Relevant Web Information\n";

  for (const result of searchResults.slice(0, maxSearchResults)) {
    context += `\n**${result.title}** (${result.url})\n`;
    context += `${result.snippet}\n`;
  }

  return context;
}

export function extractSearchTerms(userQuery: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "is",
    "are",
    "am",
    "was",
    "were",
    "be",
    "been",
    "being",
    "do",
    "does",
    "did",
    "can",
    "could",
    "would",
    "should",
    "may",
    "might",
    "must",
    "will",
    "shall",
    "have",
    "has",
    "having",
  ]);

  return userQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopWords.has(word) && word.length > 2)
    .slice(0, 5);
}

export async function shouldPerformWebSearch(query: string): Promise<boolean> {
  try {
    // Don't perform web search if offline
    if (!navigator.onLine) {
      return false;
    }

    // Perform web search for questions that likely need current information
    const searchIndicators = [
      "what is",
      "how to",
      "latest",
      "current",
      "recent",
      "news",
      "trends",
      "statistics",
      "data",
      "market",
      "price",
      "rate",
      "forecast",
      "predict",
      "compare",
      "difference between",
      "best",
      "top",
      "guide",
      "tutorial",
    ];

    const lowerQuery = query.toLowerCase();
    return searchIndicators.some((indicator) => lowerQuery.includes(indicator));
  } catch {
    return false;
  }
}
