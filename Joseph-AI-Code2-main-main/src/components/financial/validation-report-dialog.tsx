import React, { useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { ValidationReport } from "./validation-report";

interface ValidationReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ValidationReportDialog({
  open,
  onOpenChange,
}: ValidationReportDialogProps) {
  const [dateRange, setDateRange] = useState("last-3-months");
  const [showReport, setShowReport] = useState(false);

  const getDateRange = (range: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (range) {
      case "current-month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "last-month":
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      case "last-3-months":
        startDate = subMonths(now, 3);
        break;
      case "last-6-months":
        startDate = subMonths(now, 6);
        break;
      case "current-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "last-year":
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate = subMonths(now, 3);
    }

    return { startDate, endDate };
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const { startDate, endDate } = getDateRange(dateRange);

  if (showReport) {
    return (
      <ValidationReport
        open={open}
        onOpenChange={onOpenChange}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Validation Report</DialogTitle>
          <DialogDescription>
            Select a date range to analyze and validate your forecasts against
            actual performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-900">
              Date Range
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Choose the period you want to validate
            </p>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Selected Period
                </p>
                <p className="text-sm text-blue-700">
                  {format(startDate, "MMM dd, yyyy")} -{" "}
                  {format(endDate, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
