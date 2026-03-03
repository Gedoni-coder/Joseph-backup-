export async function fetchWebPageText(rawUrl: string): Promise<string | null> {
  try {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    const readerUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(readerUrl, {
      method: "GET",
      headers: {
        "Accept": "text/plain, text/markdown, */*",
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || !text.trim()) return null;
    // Trim large content to a reasonable size for prompts
    const maxLen = 12000; // characters
    return text.length > maxLen ? text.slice(0, maxLen) : text;
  } catch {
    return null;
  }
}

export function extractUrls(input: string): string[] {
  const urlRegex = /https?:\/\/[^\s)]+/gi;
  const matches = input.match(urlRegex) || [];
  return Array.from(new Set(matches));
}
