import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanyInfo } from "@/lib/company-context";
import { useCurrency } from "@/lib/currency-context";
import { AlertCircle, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "E-commerce",
  "Education",
  "Real Estate",
  "Agriculture",
  "Transportation",
  "Hospitality",
  "Legal Services",
  "Consulting",
  "Media & Entertainment",
  "Other",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Arabic",
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "$", label: "Australian Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "MXN", symbol: "$", label: "Mexican Peso" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real" },
  { code: "ZAR", symbol: "R", label: "South African Rand" },
];

export default function CompanySettings() {
  const navigate = useNavigate();
  const { companyInfo, updateCompanyInfo } = useCompanyInfo();
  const { setCurrency } = useCurrency();

  if (!companyInfo) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="p-8">
            <p className="text-gray-600">
              No company information found. Please complete onboarding first.
            </p>
            <Button
              onClick={() => navigate("/onboarding")}
              className="mt-4"
            >
              Go to Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Required fields
  const [companyName, setCompanyName] = useState(companyInfo?.companyName || "");
  const [description, setDescription] = useState(companyInfo?.description || "");
  const [numberOfWorkers, setNumberOfWorkers] = useState(
    companyInfo?.numberOfWorkers || ""
  );
  const [sector, setSector] = useState(companyInfo?.sector || "");
  const [companySize, setCompanySize] = useState(
    companyInfo?.companySize || ""
  );
  const [address, setAddress] = useState(companyInfo?.address || "");
  const [websiteUrl, setWebsiteUrl] = useState(companyInfo?.websiteUrl || "");

  // Optional fields
  const [email, setEmail] = useState(companyInfo?.email || "");
  const [phone, setPhone] = useState(companyInfo?.phone || "");
  const [fiscalYearEndDate, setFiscalYearEndDate] = useState(
    companyInfo?.fiscalYearEndDate || ""
  );
  const [currencyPreference, setCurrencyPreference] = useState(
    companyInfo?.currencyPreference || "USD"
  );
  const [language, setLanguage] = useState(companyInfo?.language || "English");
  const [numberOfEntities, setNumberOfEntities] = useState(
    companyInfo?.numberOfEntities || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const validateRequired = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!numberOfWorkers)
      newErrors.numberOfWorkers = "Number of workers is required";
    if (!sector) newErrors.sector = "Sector is required";
    if (!companySize) newErrors.companySize = "Company size is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!websiteUrl.trim())
      newErrors.websiteUrl = "Website URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRequired()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      updateCompanyInfo({
        companyName,
        description,
        numberOfWorkers: Number(numberOfWorkers),
        sector,
        companySize: companySize as "small" | "medium" | "enterprise",
        address,
        websiteUrl,
        ...(email && { email }),
        ...(phone && { phone }),
        ...(fiscalYearEndDate && { fiscalYearEndDate }),
        ...(currencyPreference && { currencyPreference }),
        ...(language && { language }),
        ...(numberOfEntities && { numberOfEntities: Number(numberOfEntities) }),
      });

      // Sync with global currency context
      if (currencyPreference) {
        setCurrency(currencyPreference);
      }

      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl">Company Settings</CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {saved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                <p className="text-sm text-green-700">
                  Company information updated successfully!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Required Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.companyName;
                          return newErrors;
                        });
                      }}
                      placeholder="Enter your company name"
                      className={`mt-1 ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Company Description
                    </Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.description;
                          return newErrors;
                        });
                      }}
                      placeholder="Brief description of your company"
                      className={`mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                        errors.description ? "border-red-500" : ""
                      }`}
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="numberOfWorkers"
                        className="text-sm font-medium"
                      >
                        Number of Workers
                      </Label>
                      <Input
                        id="numberOfWorkers"
                        type="number"
                        value={numberOfWorkers}
                        onChange={(e) => {
                          setNumberOfWorkers(e.target.value);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.numberOfWorkers;
                            return newErrors;
                          });
                        }}
                        placeholder="e.g., 50"
                        min="1"
                        className={`mt-1 ${
                          errors.numberOfWorkers ? "border-red-500" : ""
                        }`}
                      />
                      {errors.numberOfWorkers && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.numberOfWorkers}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sector" className="text-sm font-medium">
                        Sector
                      </Label>
                      <select
                        id="sector"
                        value={sector}
                        onChange={(e) => {
                          setSector(e.target.value);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.sector;
                            return newErrors;
                          });
                        }}
                        className={`mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                          errors.sector ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select a sector</option>
                        {SECTORS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.sector && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.sector}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="companySize"
                        className="text-sm font-medium"
                      >
                        Company Size
                      </Label>
                      <select
                        id="companySize"
                        value={companySize}
                        onChange={(e) => {
                          setCompanySize(e.target.value);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.companySize;
                            return newErrors;
                          });
                        }}
                        className={`mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                          errors.companySize ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select company size</option>
                        <option value="small">Small (1-50 employees)</option>
                        <option value="medium">
                          Medium (51-250 employees)
                        </option>
                        <option value="enterprise">
                          Enterprise (250+ employees)
                        </option>
                      </select>
                      {errors.companySize && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.companySize}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address / Location
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.address;
                          return newErrors;
                        });
                      }}
                      placeholder="Enter your company address"
                      className={`mt-1 ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="websiteUrl"
                      className="text-sm font-medium"
                    >
                      Website URL
                    </Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => {
                        setWebsiteUrl(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.websiteUrl;
                          return newErrors;
                        });
                      }}
                      placeholder="https://example.com"
                      className={`mt-1 ${
                        errors.websiteUrl ? "border-red-500" : ""
                      }`}
                    />
                    {errors.websiteUrl && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.websiteUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Optional Information
                </h3>
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@company.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="fiscalYearEndDate"
                      className="text-sm font-medium"
                    >
                      Fiscal Year End Date
                    </Label>
                    <Input
                      id="fiscalYearEndDate"
                      type="date"
                      value={fiscalYearEndDate}
                      onChange={(e) => setFiscalYearEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="currencyPreference"
                        className="text-sm font-medium"
                      >
                        Currency Preference
                      </Label>
                      <select
                        id="currencyPreference"
                        value={currencyPreference}
                        onChange={(e) =>
                          setCurrencyPreference(e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code} - {curr.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label
                        htmlFor="language"
                        className="text-sm font-medium"
                      >
                        Preferred Language
                      </Label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="numberOfEntities"
                      className="text-sm font-medium"
                    >
                      Number of Business Entities/Subsidiaries
                    </Label>
                    <Input
                      id="numberOfEntities"
                      type="number"
                      value={numberOfEntities}
                      onChange={(e) => setNumberOfEntities(e.target.value)}
                      placeholder="e.g., 3"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
