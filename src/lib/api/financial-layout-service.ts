import { apiClient } from "./api-client";

export interface FinancialLineItem {
  id: number;
  category: "Revenue" | "Expenses" | "Assets" | "Liabilities" | "Equity";
  item: string;
  current_amount: number;
  budget_amount: number;
  last_year_amount: number;
  unit: string;
  period: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const getFinancialLineItems = async (): Promise<FinancialLineItem[]> => {
  const response = await apiClient.get<FinancialLineItem[]>(
    "/api/financial/financial-line-items/",
  );
  return response.data;
};
