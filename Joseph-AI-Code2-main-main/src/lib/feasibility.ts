export type Mode = "Conservative" | "Safe" | "Wild";

export interface Inputs {
  risk: number; // 0-100
  timeValue: number; // %
  roiTime: number; // months
  lengthTimeFactor: number; // months
  interestRate: number; // %
}

export interface ModeResult {
  score: number; // 0-100
  verdict: "Feasible" | "Borderline" | "Not Feasible";
  colorClass: string;
  pvFactor: number;
  combinedRate: number; // %
  details: {
    riskPenalty: number;
    timelinePenalty: number;
    ratePenalty: number;
    thresholds: { feasible: number; borderline: number };
  };
  narrative?: string;
}

export interface FeasibilityReport {
  id: string;
  idea: string;
  createdAt: string;
  tags: string[];
  derivedInputs: Inputs;
  resultsByMode: Record<Mode, ModeResult>;
}

export const STORAGE_KEY = "joseph_feasibility_ideas_v1";

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function computeFeasibility(mode: Mode, inputs: Inputs): ModeResult {
  const { risk, timeValue, roiTime, lengthTimeFactor, interestRate } = inputs;
  const combinedRate = (timeValue + interestRate) / 100;
  const years = Math.max(roiTime, 0) / 12;
  const pvFactor = 1 / Math.pow(1 + combinedRate, years || 0);

  const thresholds = (
    {
      Conservative: { risk: 1.0, time: 0.8, rate: 0.8, feasible: 60, borderline: 45 },
      Safe: { risk: 0.7, time: 0.5, rate: 0.6, feasible: 50, borderline: 40 },
      Wild: { risk: 0.4, time: 0.3, rate: 0.4, feasible: 40, borderline: 30 },
    } as const
  )[mode];

  const baseScore = 100 * pvFactor;
  const riskPenalty = risk * thresholds.risk;
  const timelinePenalty = Math.max(0, roiTime - lengthTimeFactor) * thresholds.time;
  const ratePenalty = (combinedRate * 100) * thresholds.rate;
  const rawScore = baseScore - riskPenalty - timelinePenalty - ratePenalty;
  const score = clamp(Number.isFinite(rawScore) ? rawScore : 0);

  let verdict: ModeResult["verdict"] = "Not Feasible";
  if (score >= thresholds.feasible) verdict = "Feasible";
  else if (score >= thresholds.borderline) verdict = "Borderline";

  const colorClass =
    verdict === "Feasible"
      ? "text-green-700 bg-green-100 border-green-200"
      : verdict === "Borderline"
      ? "text-yellow-700 bg-yellow-100 border-yellow-200"
      : "text-red-700 bg-red-100 border-red-200";

  return {
    score: Math.round(score),
    verdict,
    colorClass,
    pvFactor,
    combinedRate: Math.round(combinedRate * 10000) / 100,
    details: {
      riskPenalty: Math.round(riskPenalty),
      timelinePenalty: Math.round(timelinePenalty),
      ratePenalty: Math.round(ratePenalty),
      thresholds: { feasible: thresholds.feasible, borderline: thresholds.borderline },
    },
  };
}

export function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["with", "that", "this", "from", "your", "have", "will", "they", "them", "into", "about", "idea", "market", "users", "their", "more", "less"].includes(w));
  const counts: Record<string, number> = {};
  for (const w of words) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([w]) => w);
}

export function deriveInputsFromIdea(text: string): Inputs {
  const lower = text.toLowerCase();
  const pct = /([0-9]{1,2}(?:\.[0-9]+)?)%/;
  const months = /([0-9]{1,3})\s*(?:months|month|mo)/;
  const rateMatch = lower.match(pct);
  const monthsMatch = lower.match(months);

  let interestRate = rateMatch ? clamp(parseFloat(rateMatch[1]), 0, 100) : 6.5;
  let timeValue = interestRate > 0 ? Math.max(3, Math.min(interestRate, 12)) : 5;
  let roiTime = monthsMatch ? clamp(parseInt(monthsMatch[1], 10), 0, 600) : 18;

  let risk = 35;
  if (/(high\s*risk|uncertain|unproven|new\s*market)/.test(lower)) risk = 60;
  if (/(regulated|enterprise|long\s*cycle)/.test(lower)) risk = Math.max(risk, 50);
  if (/(recurring|existing\s*customers|loyal)/.test(lower)) risk = 25;

  let lengthTimeFactor = 12;
  if (/(infrastructure|hardware|manufacturing)/.test(lower)) lengthTimeFactor = 24;
  if (/(software|saas|app)/.test(lower)) lengthTimeFactor = 12;

  return { risk, timeValue, roiTime, lengthTimeFactor, interestRate };
}
