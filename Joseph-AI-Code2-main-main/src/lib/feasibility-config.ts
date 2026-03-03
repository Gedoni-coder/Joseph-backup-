/**
 * Feasibility Module Configuration
 * Contains all algorithm thresholds, defaults, and AI prompts as mock data
 * This data comes from mock API and should be replaced with real API calls in production
 */

import type { Mode } from './feasibility';

// ============ FEASIBILITY SCORING MODES ============
// These thresholds determine how each mode (Conservative, Safe, Wild) scores feasibility
export const FEASIBILITY_MODE_THRESHOLDS: Record<Mode, {
  risk: number;
  time: number;
  rate: number;
  feasible: number;
  borderline: number;
}> = {
  Conservative: {
    risk: 1.0,      // Higher penalty for risk
    time: 0.8,      // Moderate timeline penalty
    rate: 0.8,      // Moderate rate penalty
    feasible: 60,   // Score >= 60 = Feasible
    borderline: 45, // Score 45-59 = Borderline
  },
  Safe: {
    risk: 0.7,      // Lower risk penalty
    time: 0.5,      // Lower timeline penalty
    rate: 0.6,      // Lower rate penalty
    feasible: 50,   // Score >= 50 = Feasible
    borderline: 40, // Score 40-49 = Borderline
  },
  Wild: {
    risk: 0.4,      // Minimal risk penalty
    time: 0.3,      // Minimal timeline penalty
    rate: 0.4,      // Minimal rate penalty
    feasible: 40,   // Score >= 40 = Feasible
    borderline: 30, // Score 30-39 = Borderline
  },
};

// ============ DEFAULT INPUT VALUES ============
// Default values used when extracting/deriving inputs from user ideas
export const FEASIBILITY_INPUT_DEFAULTS = {
  interestRate: 6.5,           // Default interest rate (%)
  roiTime: 18,                 // Default ROI time (months)
  timeValueMin: 3,             // Minimum time value bound
  timeValueMax: 12,            // Maximum time value bound
  defaultRisk: 35,             // Default risk score (0-100)
  lengthTimeFactor: 12,        // Default time factor for standard items (months)
  lengthTimeFactorLarge: 24,   // Default time factor for infrastructure/hardware/manufacturing (months)
  minScore: 0,                 // Minimum feasibility score
  maxScore: 100,               // Maximum feasibility score
};

// ============ ALGORITHM CONSTANTS ============
// Core computation constants used in feasibility scoring
export const FEASIBILITY_ALGORITHM_CONSTANTS = {
  scoreMultiplier: 100,        // Base multiplier for score calculation
  monthsPerYear: 12,           // Months in a year for NPV calculation
};

// ============ KEYWORD EXTRACTION CONFIG ============
// Stop words to exclude when extracting keywords from ideas
export const FEASIBILITY_STOP_WORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'as', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
];

// ============ AI PROMPTS ============
// System prompts used by the AI for generating feasibility narratives
export const FEASIBILITY_AI_PROMPTS: Record<Mode, string> = {
  Conservative: `You are Joseph AI, a financial feasibility expert using Conservative analysis. 
Analyze this business idea with risk aversion. Include:
1. Risk Assessment: Identify potential risks and penalties applied
2. Time Value: NPV-based assessment of the timeline
3. ROI Timeline: When the business could break even
4. Length Time Factor: Duration assumptions used
5. Interest Rate: Applied discount rate
6. Verdict: Overall feasibility assessment (Feasible/Borderline/Not Feasible)
Score: Based on 0-100 scale where 60+ is Feasible, 45-59 is Borderline
Keep analysis concise (2-3 sentences per section). Avoid fluff.`,

  Safe: `You are Joseph AI, a financial feasibility expert using Safe analysis.
Analyze this business idea with balanced risk assessment. Include:
1. Risk Assessment: Moderate risk considerations
2. Time Value: Realistic NPV assessment
3. ROI Timeline: Expected time to profitability
4. Length Time Factor: Duration assumptions
5. Interest Rate: Applied discount rate
6. Verdict: Overall feasibility assessment (Feasible/Borderline/Not Feasible)
Score: Based on 0-100 scale where 50+ is Feasible, 40-49 is Borderline
Keep analysis concise (2-3 sentences per section). Avoid fluff.`,

  Wild: `You are Joseph AI, a financial feasibility expert using Wild (aggressive) analysis.
Analyze this business idea with risk tolerance and growth optimism. Include:
1. Risk Assessment: Minimize risk concerns if potential is high
2. Time Value: Aggressive NPV assumptions
3. ROI Timeline: Optimistic profitability timeline
4. Length Time Factor: Aggressive duration estimates
5. Interest Rate: Lower discount rate for optimistic scenarios
6. Verdict: Overall feasibility assessment (Feasible/Borderline/Not Feasible)
Score: Based on 0-100 scale where 40+ is Feasible, 30-39 is Borderline
Keep analysis concise (2-3 sentences per section). Avoid fluff.`,
};

// ============ VERDICT COLORS & LABELS ============
// Styling and labels for feasibility verdicts
export const FEASIBILITY_VERDICT_STYLES: Record<string, { label: string; color: string; bgColor: string }> = {
  'Feasible': {
    label: 'Feasible',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  'Borderline': {
    label: 'Borderline',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  'Not Feasible': {
    label: 'Not Feasible',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
};

// ============ REGEX PATTERNS FOR PARSING ============
// Patterns used to extract numeric values from user input
export const FEASIBILITY_PARSE_PATTERNS = {
  percentage: /(\d+(?:\.\d+)?)\s*%/,
  timeframe: /(\d+(?:\.\d+)?)\s*(?:months?|yrs?)/i,
  rate: /(\d+(?:\.\d+)?)\s*(?:%|rate|apr|interest)/i,
};

// ============ UI LABELS & MESSAGES ============
// All UI copy for the Business Feasibility module
export const FEASIBILITY_UI_LABELS = {
  moduleTitle: 'Business Plan and Feasibility Analysis',
  moduleDescription: 'Analyze the feasibility of your business ideas using advanced financial modeling',
  formPlaceholder: 'Got an Idea?',
  formButtonText: 'Analyze Feasibility',
  formTip: 'Tip: include rough timelines (e.g., "18 months") or rates (e.g., "8%") to refine the analysis.',
  pastIdeasHeading: 'Past Ideas',
  emptyStateText: 'No ideas analyzed yet. Enter an idea above to get started.',
  deletionConfirm: 'Are you sure you want to delete this idea?',
  modes: {
    Conservative: 'Conservative (Risk-Averse)',
    Safe: 'Safe (Balanced)',
    Wild: 'Wild (Aggressive)',
  },
  loadingText: 'Analyzing feasibility...',
  errorText: 'Error analyzing idea. Please try again.',
};

// ============ FEATURE CATEGORIES FOR LARGE TIME FACTOR ============
// Categories that use longer time factors due to complexity
export const FEASIBILITY_LARGE_TIME_FACTOR_CATEGORIES = [
  'infrastructure',
  'hardware',
  'manufacturing',
  'construction',
  'real estate',
  'factory',
  'plant',
  'facility',
  'equipment',
  'machinery',
];

// ============ MODE DESCRIPTIONS ============
// Detailed descriptions of each analysis mode
export const FEASIBILITY_MODE_DESCRIPTIONS: Record<Mode, string> = {
  Conservative: 'Risk-averse analysis with heavy penalties for uncertainty. Best for investors seeking stable returns.',
  Safe: 'Balanced analysis with realistic risk assessment. Recommended for most business scenarios.',
  Wild: 'Aggressive analysis with optimistic assumptions. Suitable for high-growth opportunities.',
};

/**
 * Gets mode thresholds
 * @param mode - Feasibility analysis mode
 * @returns Threshold object for the mode
 */
export function getModeThresholds(mode: Mode) {
  return FEASIBILITY_MODE_THRESHOLDS[mode];
}

/**
 * Gets AI prompt for a specific mode
 * @param mode - Feasibility analysis mode
 * @returns System prompt for AI narrative generation
 */
export function getModePrompt(mode: Mode): string {
  return FEASIBILITY_AI_PROMPTS[mode];
}

/**
 * Gets verdict styling
 * @param verdict - Feasibility verdict string
 * @returns Object with label and color styles
 */
export function getVerdictStyle(verdict: string) {
  return FEASIBILITY_VERDICT_STYLES[verdict] || FEASIBILITY_VERDICT_STYLES['Borderline'];
}

/**
 * Determines if a keyword should use large time factor
 * @param keyword - Extracted keyword from idea
 * @returns True if keyword matches large time factor categories
 */
export function useLargeTimeFactor(keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  return FEASIBILITY_LARGE_TIME_FACTOR_CATEGORIES.some(
    cat => lowerKeyword.includes(cat)
  );
}
