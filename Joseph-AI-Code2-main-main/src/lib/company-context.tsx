import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  getCompanyProfiles,
  createCompanyProfile,
  updateCompanyProfile,
  CompanyProfile,
} from "./api/company-service";

export interface CompanyInfo {
  // Required fields
  companyName: string;
  description: string;
  numberOfWorkers: number;
  sector: string;
  companySize: "small" | "medium" | "enterprise";
  country: string;
  state: string;
  city: string;
  websiteUrl?: string;

  // Optional fields
  email?: string;
  phone?: string;
  fiscalYearEndDate?: string;
  currencyFormat?: string;
  currencyPreference?: string;
  logo?: string;
  language?: string;
  numberOfEntities?: number;
  aiSummary?: string;
}

interface CompanyContextType {
  companyInfo: CompanyInfo | null;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  isSetup: boolean;
  clearCompanyInfo: () => void;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const STORAGE_KEY = "joseph:companyInfo";

// Convert backend snake_case to frontend camelCase
function toFrontendFormat(profile: CompanyProfile): CompanyInfo {
  return {
    companyName: profile.company_name,
    description: profile.description,
    numberOfWorkers: profile.number_of_workers,
    sector: profile.sector,
    companySize: profile.company_size as "small" | "medium" | "enterprise",
    country: profile.country,
    state: profile.state,
    city: profile.city,
    websiteUrl: profile.website_url,
    email: profile.email,
    phone: profile.phone,
    fiscalYearEndDate: profile.fiscal_year_end_date,
    currencyFormat: profile.currency_format,
    currencyPreference: profile.currency_preference,
    logo: profile.logo,
    language: profile.language,
    numberOfEntities: profile.number_of_entities,
    aiSummary: profile.ai_summary,
  };
}

// Convert frontend camelCase to backend snake_case
function toBackendFormat(info: Partial<CompanyInfo>): Partial<CompanyProfile> {
  const backend: Partial<CompanyProfile> = {};
  
  if (info.companyName !== undefined) backend.company_name = info.companyName;
  if (info.description !== undefined) backend.description = info.description;
  if (info.numberOfWorkers !== undefined) backend.number_of_workers = info.numberOfWorkers;
  if (info.sector !== undefined) backend.sector = info.sector;
  if (info.companySize !== undefined) backend.company_size = info.companySize;
  if (info.country !== undefined) backend.country = info.country;
  if (info.state !== undefined) backend.state = info.state;
  if (info.city !== undefined) backend.city = info.city;
  if (info.websiteUrl !== undefined) backend.website_url = info.websiteUrl;
  if (info.email !== undefined) backend.email = info.email;
  if (info.phone !== undefined) backend.phone = info.phone;
  if (info.fiscalYearEndDate !== undefined) backend.fiscal_year_end_date = info.fiscalYearEndDate;
  if (info.currencyFormat !== undefined) backend.currency_format = info.currencyFormat;
  if (info.currencyPreference !== undefined) backend.currency_preference = info.currencyPreference;
  if (info.logo !== undefined) backend.logo = info.logo;
  if (info.language !== undefined) backend.language = info.language;
  if (info.numberOfEntities !== undefined) backend.number_of_entities = info.numberOfEntities;
  if (info.aiSummary !== undefined) backend.ai_summary = info.aiSummary;
  
  return backend;
}

export function useCompanyInfo() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyInfo must be used within CompanyInfoProvider");
  }
  return context;
}

export function CompanyInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendProfileId, setBackendProfileId] = useState<number | null>(null);

  // Load from backend on mount, fallback to localStorage
  useEffect(() => {
    async function loadCompanyInfo() {
      try {
        // Try to load from backend
        const profiles = await getCompanyProfiles();
        console.log("Company profiles from API:", profiles);
        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          setBackendProfileId(profile.id!);
          const frontendFormat = toFrontendFormat(profile);
          setCompanyInfo(frontendFormat);
          // Also save to localStorage as backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(frontendFormat));
          setIsLoading(false);
          return;
        }
        console.log("No profiles found in backend");
      } catch (error) {
        console.log("Error loading company profile, trying localStorage:", error);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setCompanyInfo(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load company info from storage:", error);
      }
      
      setIsLoading(false);
    }

    loadCompanyInfo();
  }, []);

  const updateCompanyInfo = async (info: Partial<CompanyInfo>) => {
    const updated = { ...(companyInfo || ({} as CompanyInfo)), ...info };
    
    // Save to localStorage immediately for responsiveness
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save company info:", error);
    }
    
    setCompanyInfo(updated);

    // Try to save to backend
    try {
      const backendData = toBackendFormat(info);
      
      if (backendProfileId) {
        // Update existing profile
        await updateCompanyProfile(backendProfileId, backendData);
      } else {
        // Create new profile
        // For creation, we need all required fields
        const fullBackendData: CompanyProfile = {
          company_name: updated.companyName || "",
          description: updated.description || "",
          number_of_workers: updated.numberOfWorkers || 1,
          sector: updated.sector || "",
          company_size: updated.companySize || "small",
          country: updated.country || "",
          state: updated.state || "",
          city: updated.city || "",
          website_url: updated.websiteUrl,
          email: updated.email,
          phone: updated.phone,
          fiscal_year_end_date: updated.fiscalYearEndDate,
          currency_format: updated.currencyFormat,
          currency_preference: updated.currencyPreference,
          logo: updated.logo,
          language: updated.language || "en",
          number_of_entities: updated.numberOfEntities,
          ai_summary: updated.aiSummary,
        };
        
        const newProfile = await createCompanyProfile(fullBackendData);
        setBackendProfileId(newProfile.id!);
      }
    } catch (error) {
      console.error("Failed to sync company info to backend:", error);
      // Continue - localStorage already saved the data
    }
  };

  const clearCompanyInfo = () => {
    setCompanyInfo(null);
    setBackendProfileId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear company info:", error);
    }
  };

  const isSetup = !!(
    companyInfo?.companyName &&
    companyInfo?.description &&
    companyInfo?.numberOfWorkers &&
    companyInfo?.sector &&
    companyInfo?.companySize &&
    companyInfo?.country &&
    companyInfo?.state &&
    companyInfo?.city
  );

  return (
    <CompanyContext.Provider
      value={{
        companyInfo,
        updateCompanyInfo,
        isSetup,
        clearCompanyInfo,
        isLoading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
