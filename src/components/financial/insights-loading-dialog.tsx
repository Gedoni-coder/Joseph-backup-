import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2, Zap } from "lucide-react";

interface InsightsLoadingDialogProps {
  isOpen: boolean;
}

const stages = [
  "Collecting financial data...",
  "Analyzing forecasts and budgets...",
  "Evaluating cash flow performance...",
  "Assessing KPI metrics...",
  "Analyzing risk exposures...",
  "Detecting trends and patterns...",
  "Generating recommendations...",
  "Building strategic scenarios...",
  "Finalizing report...",
];

export function InsightsLoadingDialog({
  isOpen,
}: InsightsLoadingDialogProps) {
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % stages.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
            Generating AI Insights
          </DialogTitle>
          <DialogDescription>
            Analyzing your financial data to create strategic recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loading Animation */}
          <div className="flex justify-center py-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
            </div>
          </div>

          {/* Current Stage */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {stages[stage]}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-2">
            {stages.map((text, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 text-sm transition-all ${
                  index < stage
                    ? "text-gray-600"
                    : index === stage
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    index < stage
                      ? "bg-green-100"
                      : index === stage
                        ? "bg-blue-100"
                        : "bg-gray-100"
                  }`}
                >
                  {index < stage ? (
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : index === stage ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Time estimate */}
          <div className="text-center text-xs text-gray-500">
            Estimated time remaining: 30-45 seconds
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
