import { useEffect } from "react";
import { useCurrency } from "@/lib/currency-context";
import { useCompanyInfo } from "@/lib/company-context";

/**
 * Hook to sync the company's currency preference with the global currency context
 * This ensures that when a company changes their currency in onboarding,
 * it's reflected across the entire application
 */
export function useSyncCurrency() {
  const { companyInfo } = useCompanyInfo();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    // If company has a currency preference, sync it with the global currency context
    if (companyInfo?.currencyPreference && companyInfo.currencyPreference !== currency) {
      setCurrency(companyInfo.currencyPreference);
    }
  }, [companyInfo?.currencyPreference, currency, setCurrency]);
}
