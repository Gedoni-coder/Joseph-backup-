/**
 * Financial Calculations Module
 * 
 * Handles all financial projections including:
 * - Cash flow forecasting
 * - Working capital analysis
 * - Runway calculations
 * - Profit/Loss projections
 * - Margin analysis
 */

export interface CashFlowData {
  period: string;
  cashInflow: number;
  cashOutflow: number;
}

export interface CalculatedCashFlow extends CashFlowData {
  netCashFlow: number;
  cumulativeCash: number;
  workingCapital: number;
  runwayMonths: number;
  status: "Healthy" | "Caution" | "Critical";
}

export interface ProfitLossData {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  taxes: number;
  otherExpenses: number;
}

export interface CalculatedProfitLoss extends ProfitLossData {
  grossProfit: number;
  grossProfitMargin: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
  netProfitMargin: number;
  ebitda: number;
  ebitdaMargin: number;
}

/**
 * Calculate net cash flow
 * 
 * Formula: cashInflow - cashOutflow
 * 
 * @param inflow - Cash inflows for period
 * @param outflow - Cash outflows for period
 * @returns Net cash flow (can be positive or negative)
 */
export function calculateNetCashFlow(inflow: number, outflow: number): number {
  return inflow - outflow;
}

/**
 * Calculate cumulative cash position
 * 
 * Formula: previousCumulative + netCashFlow
 * 
 * @param previousCumulative - Previous period's cumulative cash
 * @param netCashFlow - Current period's net cash flow
 * @returns Cumulative cash position
 */
export function calculateCumulativeCash(previousCumulative: number, netCashFlow: number): number {
  return previousCumulative + netCashFlow;
}

/**
 * Calculate working capital requirement
 * 
 * Working capital = (Receivables + Inventory) - Payables
 * As a percentage of revenue, typically 15-20% for operational buffer
 * 
 * @param revenue - Period revenue
 * @param workingCapitalPercentage - WC as % of revenue (typical: 0.15-0.20)
 * @returns Working capital needed
 */
export function calculateWorkingCapital(
  revenue: number,
  workingCapitalPercentage: number = 0.15
): number {
  return revenue * workingCapitalPercentage;
}

/**
 * Calculate runway (months of cash remaining)
 * 
 * Formula: availableCash / monthlyBurnRate
 * 
 * @param availableCash - Current cash available
 * @param monthlyBurnRate - Average monthly cash burn (negative number)
 * @returns Months of runway remaining
 * 
 * @example
 * calculateRunway(1000000, 50000) // Returns 20 months
 */
export function calculateRunway(availableCash: number, monthlyBurnRate: number): number {
  if (monthlyBurnRate <= 0) return Infinity; // Positive cash flow = infinite runway
  return Math.round((availableCash / monthlyBurnRate) * 10) / 10;
}

/**
 * Determine cash flow health status
 * 
 * Status based on runway:
 * - Healthy: > 12 months runway
 * - Caution: 6-12 months runway
 * - Critical: < 6 months runway
 * 
 * @param runwayMonths - Months of runway
 * @returns Health status
 */
export function determineCashFlowStatus(
  runwayMonths: number
): "Healthy" | "Caution" | "Critical" {
  if (runwayMonths > 12) return "Healthy";
  if (runwayMonths > 6) return "Caution";
  return "Critical";
}

/**
 * Calculate cash conversion cycle
 * 
 * Formula: DSO + DIO - DPO
 * Where:
 * - DSO (Days Sales Outstanding) = (AR / Revenue) * 365
 * - DIO (Days Inventory Outstanding) = (Inventory / COGS) * 365
 * - DPO (Days Payable Outstanding) = (AP / COGS) * 365
 * 
 * @param receivables - Accounts receivable
 * @param inventory - Inventory value
 * @param payables - Accounts payable
 * @param revenue - Period revenue
 * @param cogs - Cost of goods sold
 * @returns Cash conversion cycle in days
 */
export function calculateCashConversionCycle(
  receivables: number,
  inventory: number,
  payables: number,
  revenue: number,
  cogs: number
): number {
  if (revenue === 0 || cogs === 0) return 0;
  
  const dso = (receivables / revenue) * 365;
  const dio = (inventory / cogs) * 365;
  const dpo = (payables / cogs) * 365;
  
  const cycle = dso + dio - dpo;
  return Math.round(cycle * 10) / 10;
}

/**
 * Calculate free cash flow
 * 
 * Formula: Operating Cash Flow - Capital Expenditures
 * 
 * @param operatingCashFlow - Cash from operations
 * @param capex - Capital expenditures
 * @returns Free cash flow
 */
export function calculateFreeCashFlow(operatingCashFlow: number, capex: number): number {
  return operatingCashFlow - capex;
}

/**
 * Full cash flow calculation pipeline
 * 
 * @param data - Raw cash flow data
 * @param previousCumulative - Previous period cumulative cash
 * @param monthlyBurnRate - Average monthly burn rate
 * @returns Fully calculated cash flow data
 */
export function calculateCompleteCashFlow(
  data: CashFlowData,
  previousCumulative: number = 0,
  monthlyBurnRate: number = 50000
): CalculatedCashFlow {
  const netCashFlow = calculateNetCashFlow(data.cashInflow, data.cashOutflow);
  const cumulativeCash = calculateCumulativeCash(previousCumulative, netCashFlow);
  const workingCapital = calculateWorkingCapital(data.cashInflow);
  const runwayMonths = calculateRunway(cumulativeCash, monthlyBurnRate);
  const status = determineCashFlowStatus(runwayMonths);
  
  return {
    ...data,
    netCashFlow,
    cumulativeCash,
    workingCapital,
    runwayMonths,
    status,
  };
}

/**
 * Calculate batch of cash flows
 * 
 * @param dataArray - Array of raw cash flow data
 * @param initialCumulative - Starting cumulative cash balance
 * @param monthlyBurnRate - Average monthly burn rate
 * @returns Array of calculated cash flows
 */
export function calculateBatchCashFlows(
  dataArray: CashFlowData[],
  initialCumulative: number = 0,
  monthlyBurnRate: number = 50000
): CalculatedCashFlow[] {
  let previousCumulative = initialCumulative;
  
  return dataArray.map((data) => {
    const calculated = calculateCompleteCashFlow(data, previousCumulative, monthlyBurnRate);
    previousCumulative = calculated.cumulativeCash;
    return calculated;
  });
}

/**
 * ==================== PROFIT & LOSS CALCULATIONS ====================
 */

/**
 * Calculate gross profit
 * 
 * Formula: Revenue - COGS
 * 
 * @param revenue - Total revenue
 * @param cogs - Cost of goods sold
 * @returns Gross profit
 */
export function calculateGrossProfit(revenue: number, cogs: number): number {
  return revenue - cogs;
}

/**
 * Calculate gross profit margin
 * 
 * Formula: (Gross Profit / Revenue) * 100
 * 
 * @param grossProfit - Gross profit amount
 * @param revenue - Total revenue
 * @returns Gross profit margin as percentage
 */
export function calculateGrossProfitMargin(grossProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (grossProfit / revenue) * 100;
}

/**
 * Calculate operating profit (EBIT)
 * 
 * Formula: Gross Profit - Operating Expenses
 * 
 * @param grossProfit - Gross profit amount
 * @param operatingExpenses - Operating expenses
 * @returns Operating profit
 */
export function calculateOperatingProfit(
  grossProfit: number,
  operatingExpenses: number
): number {
  return grossProfit - operatingExpenses;
}

/**
 * Calculate operating margin
 * 
 * Formula: (Operating Profit / Revenue) * 100
 * 
 * @param operatingProfit - Operating profit
 * @param revenue - Total revenue
 * @returns Operating margin as percentage
 */
export function calculateOperatingMargin(operatingProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (operatingProfit / revenue) * 100;
}

/**
 * Calculate EBITDA
 * 
 * Formula: Operating Profit + Depreciation + Amortization
 * Or approximated as: Net Profit + Taxes + Interest + D&A
 * 
 * @param operatingProfit - Operating profit
 * @param depreciation - Depreciation amount
 * @param amortization - Amortization amount
 * @returns EBITDA
 */
export function calculateEBITDA(
  operatingProfit: number,
  depreciation: number = 0,
  amortization: number = 0
): number {
  return operatingProfit + depreciation + amortization;
}

/**
 * Calculate EBITDA margin
 * 
 * @param ebitda - EBITDA amount
 * @param revenue - Total revenue
 * @returns EBITDA margin as percentage
 */
export function calculateEBITDAMargin(ebitda: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (ebitda / revenue) * 100;
}

/**
 * Calculate net profit
 * 
 * Formula: Operating Profit - Taxes - Other Expenses
 * Or: Revenue - COGS - Operating Expenses - Taxes - Other Expenses
 * 
 * @param operatingProfit - Operating profit
 * @param taxes - Tax expenses
 * @param otherExpenses - Other expenses (interest, etc.)
 * @returns Net profit
 */
export function calculateNetProfit(
  operatingProfit: number,
  taxes: number,
  otherExpenses: number = 0
): number {
  return operatingProfit - taxes - otherExpenses;
}

/**
 * Calculate net profit margin
 * 
 * Formula: (Net Profit / Revenue) * 100
 * 
 * @param netProfit - Net profit amount
 * @param revenue - Total revenue
 * @returns Net profit margin as percentage
 */
export function calculateNetProfitMargin(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (netProfit / revenue) * 100;
}

/**
 * Full P&L calculation pipeline
 * 
 * @param data - Raw P&L data
 * @returns Fully calculated P&L data
 */
export function calculateCompleteProfitLoss(data: ProfitLossData): CalculatedProfitLoss {
  const grossProfit = calculateGrossProfit(data.revenue, data.cogs);
  const grossProfitMargin = calculateGrossProfitMargin(grossProfit, data.revenue);
  
  const operatingProfit = calculateOperatingProfit(grossProfit, data.operatingExpenses);
  const operatingMargin = calculateOperatingMargin(operatingProfit, data.revenue);
  
  const ebitda = calculateEBITDA(operatingProfit);
  const ebitdaMargin = calculateEBITDAMargin(ebitda, data.revenue);
  
  const netProfit = calculateNetProfit(operatingProfit, data.taxes, data.otherExpenses);
  const netProfitMargin = calculateNetProfitMargin(netProfit, data.revenue);
  
  return {
    ...data,
    grossProfit,
    grossProfitMargin,
    operatingProfit,
    operatingMargin,
    netProfit,
    netProfitMargin,
    ebitda,
    ebitdaMargin,
  };
}

/**
 * Calculate DuPont Analysis (return on equity decomposition)
 * 
 * ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
 * 
 * @param netProfit - Net profit
 * @param revenue - Total revenue
 * @param assets - Total assets
 * @param equity - Total equity
 * @returns Decomposed ROE metrics
 */
export function calculateDuPontAnalysis(
  netProfit: number,
  revenue: number,
  assets: number,
  equity: number
): {
  profitMargin: number;
  assetTurnover: number;
  equityMultiplier: number;
  roe: number;
} {
  const profitMargin = revenue === 0 ? 0 : (netProfit / revenue) * 100;
  const assetTurnover = assets === 0 ? 0 : revenue / assets;
  const equityMultiplier = equity === 0 ? 0 : assets / equity;
  const roe = (profitMargin / 100) * assetTurnover * equityMultiplier * 100;
  
  return {
    profitMargin,
    assetTurnover,
    equityMultiplier,
    roe,
  };
}

/**
 * Calculate break-even point
 * 
 * Formula: Fixed Costs / (Price - Variable Cost per Unit)
 * Or: Fixed Costs / Contribution Margin Ratio
 * 
 * @param fixedCosts - Total fixed costs
 * @param variableCostRatio - Variable costs as ratio of revenue (0-1)
 * @returns Break-even revenue
 */
export function calculateBreakEvenPoint(
  fixedCosts: number,
  variableCostRatio: number
): number {
  const contributionMarginRatio = 1 - variableCostRatio;
  if (contributionMarginRatio === 0) return 0;
  return fixedCosts / contributionMarginRatio;
}

/**
 * Analyze cost structure
 * 
 * @param cogs - Cost of goods sold
 * @param operatingExpenses - Operating expenses
 * @param revenue - Total revenue
 * @returns Cost breakdown percentages
 */
export function analyzeCostStructure(
  cogs: number,
  operatingExpenses: number,
  revenue: number
): {
  cogsPercentage: number;
  opexPercentage: number;
  profitPercentage: number;
} {
  if (revenue === 0) {
    return { cogsPercentage: 0, opexPercentage: 0, profitPercentage: 0 };
  }
  
  return {
    cogsPercentage: (cogs / revenue) * 100,
    opexPercentage: (operatingExpenses / revenue) * 100,
    profitPercentage: ((revenue - cogs - operatingExpenses) / revenue) * 100,
  };
}

/**
 * Project profitability at different revenue levels
 * 
 * @param baseRevenue - Known revenue level
 * @param baseNetProfit - Net profit at base revenue
 * @param projectedRevenue - Projected revenue level
 * @param variableCostRatio - Variable costs as ratio of revenue
 * @param fixedCosts - Fixed costs (don't change with revenue)
 * @returns Projected net profit at new revenue level
 */
export function projectNetProfitAtRevenue(
  baseRevenue: number,
  baseNetProfit: number,
  projectedRevenue: number,
  variableCostRatio: number,
  fixedCosts: number
): number {
  if (baseRevenue === 0) return 0;
  
  // Calculate current COGS from variable cost ratio
  const baseVariableCosts = baseRevenue * variableCostRatio;
  
  // Project variable costs at new revenue level
  const projectedVariableCosts = projectedRevenue * variableCostRatio;
  
  // Variable cost change
  const variableCostChange = projectedVariableCosts - baseVariableCosts;
  
  // Net profit = base profit + incremental contribution margin
  // (assuming fixed costs stay same)
  const contributionMarginRatio = 1 - variableCostRatio;
  const additionalRevenue = projectedRevenue - baseRevenue;
  const additionalProfit = additionalRevenue * contributionMarginRatio;
  
  return baseNetProfit + additionalProfit;
}
