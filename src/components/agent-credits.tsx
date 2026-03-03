import React, { useState } from "react";
import { ChevronDown, Zap, ShoppingCart, TrendingUp, BarChart3, CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";

interface AgentCreditsProps {
  creditBalance?: number;
  className?: string;
  userEmail?: string;
  userName?: string;
}

// Credit packages with amount in credits
const CREDIT_PACKAGES = [
  { id: 1, amount: 500 },
  { id: 2, amount: 2000 },
  { id: 3, amount: 5000 },
];

// Pricing per credit
const PRICING = {
  NGN: 10, // 10 naira per credit
  USD: 0.005, // 0.005 dollars per credit
};

export function AgentCredits({
  creditBalance = 1500,
  className,
  userEmail = "user@example.com",
  userName = "User",
}: AgentCreditsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("balance");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customCredits, setCustomCredits] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const { toast } = useToast();

  // Calculate price based on credits and currency
  const calculatePrice = (credits: number, currency: string) => {
    return credits * PRICING[currency as keyof typeof PRICING];
  };

  // Handle custom credits input
  const handleCustomCreditsChange = (value: string) => {
    setCustomCredits(value);
    if (value) {
      const credits = parseInt(value) || 0;
      const amount = calculatePrice(credits, selectedCurrency);
      setCustomAmount(amount.toFixed(2));
    } else {
      setCustomAmount("");
    }
  };

  // Handle custom amount input
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      const amount = parseFloat(value) || 0;
      const credits = Math.floor(amount / PRICING[selectedCurrency as keyof typeof PRICING]);
      setCustomCredits(credits.toString());
    } else {
      setCustomCredits("");
    }
  };

  // Determine which price and credits to use
  const getActivePrice = () => {
    if (useCustomInput && customAmount) {
      return parseFloat(customAmount);
    }
    return calculatePrice(selectedPackage.amount, selectedCurrency);
  };

  const getActiveCredits = () => {
    if (useCustomInput && customCredits) {
      return parseInt(customCredits);
    }
    return selectedPackage.amount;
  };

  const selectedPrice = getActivePrice();

  // Flutterwave configuration
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "FLUTTERWAVE_KEY",
    tx_ref: `agent-credits-${Date.now()}`,
    amount: selectedPrice,
    currency: selectedCurrency,
    customer: {
      email: userEmail,
      name: userName,
    },
    customizations: {
      title: `Buy ${getActiveCredits().toLocaleString()} Agent Credits`,
      description: `Payment for ${getActiveCredits().toLocaleString()} Agent Credits - ${selectedPrice.toFixed(2)} ${selectedCurrency}`,
    },
  };

  const handleFlutterWaveResponse = (response: any) => {
    if (response.status === "successful") {
      // Payment successful
      toast({
        title: "Payment Successful",
        description: `${selectedPackage.amount.toLocaleString()} credits have been added to your account.`,
        variant: "default",
      });
      // Here you would typically send a request to your backend to update the user's credits
      // Example: await updateUserCredits(selectedPackage.amount, response.transaction_id);
      setIsProcessing(false);
      closePaymentModal();
    } else if (response.status === "cancelled") {
      toast({
        title: "Payment Cancelled",
        description: "Your payment has been cancelled. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleFlutterWaveClose = () => {
    setIsProcessing(false);
  };

  const { handlePayment } = useFlutterwave(config);

  return (
    <div className={cn("w-full px-4 py-3", className)}>
      {/* Header - Blue Box with Credit Balance */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full p-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
          "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          "text-white font-semibold flex items-center justify-between group",
          "border border-blue-500/30",
        )}
      >
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-blue-200 group-hover:text-blue-100 transition-colors" />
          <div className="text-left">
            <div className="text-xs font-medium text-blue-100 uppercase tracking-wide">
              Agent Credits
            </div>
            <div className="text-lg font-bold text-white">
              {creditBalance.toLocaleString()} Credits
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-blue-200 transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 bg-transparent p-0 h-auto mb-4">
              <TabsTrigger
                value="balance"
                className={cn(
                  "flex items-center gap-2 py-2 px-3 text-sm rounded-md transition-all",
                  "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                  "data-[state=active]:shadow-md",
                  activeTab === "balance"
                    ? ""
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-blue-800",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Balance</span>
              </TabsTrigger>

              <TabsTrigger
                value="buy"
                className={cn(
                  "flex items-center gap-2 py-2 px-3 text-sm rounded-md transition-all",
                  "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                  "data-[state=active]:shadow-md",
                  activeTab === "buy"
                    ? ""
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-blue-800",
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Buy Credits</span>
              </TabsTrigger>

              <TabsTrigger
                value="upgrade"
                className={cn(
                  "flex items-center gap-2 py-2 px-3 text-sm rounded-md transition-all",
                  "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                  "data-[state=active]:shadow-md",
                  activeTab === "upgrade"
                    ? ""
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-blue-800",
                )}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Upgrade Plan</span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className={cn(
                  "flex items-center gap-2 py-2 px-3 text-sm rounded-md transition-all",
                  "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                  "data-[state=active]:shadow-md",
                  activeTab === "analytics"
                    ? ""
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-blue-800",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Usage</span>
              </TabsTrigger>
            </TabsList>

            {/* Balance Tab */}
            <TabsContent value="balance" className="space-y-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Current Balance
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {creditBalance.toLocaleString()}
                    </p>
                  </div>
                  <Zap className="h-12 w-12 text-blue-600/20" />
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    <span className="font-medium">Monthly Allocation:</span> 2,000
                    credits
                  </p>
                  <p>
                    <span className="font-medium">Used This Month:</span> 500
                    credits
                  </p>
                  <p>
                    <span className="font-medium">Renewal Date:</span> March 1, 2026
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Buy Credits Tab */}
            <TabsContent value="buy" className="space-y-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Purchase additional credits for your account
                </p>

                {/* Currency Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Payment Currency
                  </label>
                  <Select value={selectedCurrency} onValueChange={(value) => {
                    setSelectedCurrency(value);
                    // Reset custom input when currency changes
                    setCustomCredits("");
                    setCustomAmount("");
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {selectedCurrency === "NGN"
                      ? "10 naira per credit"
                      : "0.005 dollars per credit"}
                  </p>
                </div>

                {/* Tab to switch between bundle and custom */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setUseCustomInput(false)}
                    className={cn(
                      "px-4 py-2 rounded text-sm font-medium transition-all",
                      !useCustomInput
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    Choose Bundle
                  </button>
                  <button
                    onClick={() => setUseCustomInput(true)}
                    className={cn(
                      "px-4 py-2 rounded text-sm font-medium transition-all",
                      useCustomInput
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    Custom Amount
                  </button>
                </div>

                {!useCustomInput ? (
                  <>
                    {/* Credit Packages */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {CREDIT_PACKAGES.map((pkg) => {
                        const price = calculatePrice(pkg.amount, selectedCurrency);
                        const isSelected = selectedPackage.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={cn(
                              "border rounded-lg p-3 transition-all cursor-pointer",
                              isSelected
                                ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-md"
                                : "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                            )}
                          >
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {pkg.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              credits
                            </p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                              {selectedCurrency === "NGN" ? "₦" : "$"}
                              {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Custom Input Section */}
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Enter Number of Credits
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={customCredits}
                            onChange={(e) => handleCustomCreditsChange(e.target.value)}
                            placeholder="e.g., 1000"
                            className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2.5 text-slate-500 dark:text-slate-400 text-sm">
                            credits
                          </span>
                        </div>
                      </div>
                      <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        OR
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Enter Amount to Spend
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-sm">
                            {selectedCurrency === "NGN" ? "₦" : "$"}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            placeholder={selectedCurrency === "NGN" ? "e.g., 10000" : "e.g., 50.00"}
                            className="w-full pl-8 pr-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Order Summary */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Credits:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {getActiveCredits().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                      <span className="font-medium text-slate-900 dark:text-white">Total:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {selectedCurrency === "NGN" ? "₦" : "$"}
                        {selectedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {!import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
                import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY.includes("your_") ? (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-medium">Payment Gateway Not Configured</p>
                        <p className="text-xs mt-1">
                          Please add your Flutterwave public key to the .env file as VITE_FLUTTERWAVE_PUBLIC_KEY
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  disabled={
                    isProcessing ||
                    !import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
                    import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY.includes("your_") ||
                    getActiveCredits() === 0
                  }
                  onClick={() => {
                    setIsProcessing(true);
                    handlePayment({
                      callback: handleFlutterWaveResponse,
                      onClose: handleFlutterWaveClose,
                    });
                  }}
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </TabsContent>

            {/* Upgrade Plan Tab */}
            <TabsContent value="upgrade" className="space-y-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upgrade your plan for more credits and features
                  </p>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Naira (₦)</SelectItem>
                      <SelectItem value="USD">Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const plans = selectedCurrency === "NGN"
                      ? [
                          {
                            name: "Basic Plan",
                            credits: "300 credits/month",
                            price: "₦3,000",
                            current: true,
                          },
                          {
                            name: "Standard Plan",
                            credits: "500 credits/month",
                            price: "₦5,000/month",
                            current: false,
                          },
                          {
                            name: "Mid-size Enterprise",
                            credits: "1000 credits/month",
                            price: "₦10,000/month",
                            current: false,
                          },
                          {
                            name: "Enterprise",
                            credits: "Unlimited",
                            price: "Custom",
                            current: false,
                          },
                        ]
                      : [
                          {
                            name: "Basic Plan",
                            credits: "300 credits/month",
                            price: "$15",
                            current: true,
                          },
                          {
                            name: "Standard Plan",
                            credits: "500 credits/month",
                            price: "$25",
                            current: false,
                          },
                          {
                            name: "Mid-size Enterprise",
                            credits: "1000 credits/month",
                            price: "$50",
                            current: false,
                          },
                          {
                            name: "Enterprise",
                            credits: "Unlimited",
                            price: "Custom",
                            current: false,
                          },
                        ];
                    return plans.map((plan) => (
                      <div
                        key={plan.name}
                        className={cn(
                          "p-3 rounded-lg border transition-all",
                          plan.current
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {plan.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {plan.credits}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600 dark:text-blue-400">
                              {plan.price}
                            </p>
                            {plan.current && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Current Plan
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled
                >
                  Upgrade Plan
                </Button>
              </div>
            </TabsContent>

            {/* Usage Analytics Tab */}
            <TabsContent value="analytics" className="space-y-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Analyze your credit usage patterns
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Usage by Feature
                    </p>
                    <div className="space-y-2">
                      {[
                        { feature: "AI Insights", percentage: 40, used: 200 },
                        { feature: "Reports", percentage: 30, used: 150 },
                        { feature: "Analysis", percentage: 20, used: 100 },
                        { feature: "Other", percentage: 10, used: 50 },
                      ].map((item) => (
                        <div key={item.feature}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {item.feature}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
                              {item.used} credits
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      This Month Summary
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                        <p className="text-slate-600 dark:text-slate-400">
                          Credits Used
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          500
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                        <p className="text-slate-600 dark:text-slate-400">
                          Remaining
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          1,500
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
