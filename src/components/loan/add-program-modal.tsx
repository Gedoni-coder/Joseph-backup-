import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Star, TrendingUp, Clock } from "lucide-react";

export interface ProgramOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  type: "loan" | "grant" | "equity" | "guarantee";
  maxAmount: number;
  interestRate?: number;
  loanTerm?: number;
  deadline?: Date;
  isNew?: boolean;
}

interface AddProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePrograms: ProgramOption[];
  selectedPrograms: string[];
  onAddPrograms: (programIds: string[]) => void;
}

const SAMPLE_PROGRAMS: ProgramOption[] = [
  {
    id: "sba-7a",
    name: "SBA 7(a) Loans",
    provider: "Small Business Administration",
    description:
      "General purpose business loans for various business purposes including working capital, inventory, and equipment",
    type: "loan",
    maxAmount: 5000000,
    interestRate: 7.5,
    loanTerm: 240,
    isNew: false,
  },
  {
    id: "sba-504",
    name: "SBA 504 Loans",
    provider: "Small Business Administration",
    description:
      "Real estate and equipment financing with fixed interest rates and long terms",
    type: "loan",
    maxAmount: 5000000,
    interestRate: 6.5,
    loanTerm: 180,
    isNew: false,
  },
  {
    id: "state-tech-grants",
    name: "State Tech Innovation Grants",
    provider: "State Economic Development",
    description:
      "Non-dilutive funding for technology-focused businesses working on innovative solutions",
    type: "grant",
    maxAmount: 250000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: "venture-debt",
    name: "Growth Venture Debt",
    provider: "Silicon Valley Bank",
    description:
      "Debt financing for high-growth companies looking to extend runway without dilution",
    type: "loan",
    maxAmount: 3000000,
    interestRate: 10.0,
    loanTerm: 60,
    isNew: false,
  },
  {
    id: "export-credit",
    name: "Export Credit Guarantee",
    provider: "Department of Commerce",
    description:
      "Credit guarantees for businesses looking to expand internationally",
    type: "guarantee",
    maxAmount: 2500000,
    isNew: true,
  },
  {
    id: "women-owned-loan",
    name: "Women-Owned Business Loans",
    provider: "Federal Reserve Program",
    description:
      "Specialized financing for women-owned businesses with competitive rates",
    type: "loan",
    maxAmount: 1500000,
    interestRate: 6.0,
    loanTerm: 120,
    isNew: false,
  },
  {
    id: "minority-enterprise",
    name: "Minority Enterprise Development",
    provider: "Small Business Administration",
    description:
      "Support for businesses owned by members of socially and economically disadvantaged groups",
    type: "loan",
    maxAmount: 2000000,
    interestRate: 7.0,
    loanTerm: 84,
    isNew: false,
  },
  {
    id: "green-energy-grant",
    name: "Green Energy Grants",
    provider: "Department of Energy",
    description:
      "Grants for businesses developing sustainable and renewable energy solutions",
    type: "grant",
    maxAmount: 500000,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
];

export function AddProgramModal({
  open,
  onOpenChange,
  availablePrograms = SAMPLE_PROGRAMS,
  selectedPrograms,
  onAddPrograms,
}: AddProgramModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(selectedPrograms),
  );

  const handleProgramToggle = (programId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(programId)) {
      newSelected.delete(programId);
    } else {
      newSelected.add(programId);
    }
    setSelectedItems(newSelected);
  };

  const filteredPrograms = availablePrograms.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddPrograms = () => {
    onAddPrograms(Array.from(selectedItems));
    onOpenChange(false);
    setSearchTerm("");
    setSelectedItems(new Set());
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "loan":
        return "bg-blue-100 text-blue-800";
      case "grant":
        return "bg-green-100 text-green-800";
      case "equity":
        return "bg-purple-100 text-purple-800";
      case "guarantee":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "grant":
        return "Grant";
      case "equity":
        return "Equity";
      case "guarantee":
        return "Guarantee";
      case "loan":
      default:
        return "Loan";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Programs to Watchlist</DialogTitle>
          <DialogDescription>
            Select funding programs you want to track and receive alerts for
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search programs by name or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Count */}
          {selectedItems.size > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{selectedItems.size}</span>{" "}
                program{selectedItems.size !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          {/* Programs List */}
          <div className="space-y-3">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => handleProgramToggle(program.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedItems.has(program.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedItems.has(program.id)}
                      onCheckedChange={() => handleProgramToggle(program.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {program.name}
                        </h3>
                        {program.isNew && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {program.provider}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        {program.description}
                      </p>

                      {/* Program Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="text-gray-600">Max Amount</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(program.maxAmount)}
                          </p>
                        </div>

                        {program.interestRate !== undefined && (
                          <div className="p-2 bg-gray-100 rounded">
                            <p className="text-gray-600">Interest Rate</p>
                            <p className="font-semibold text-gray-900">
                              {program.interestRate.toFixed(1)}%
                            </p>
                          </div>
                        )}

                        {program.loanTerm && (
                          <div className="p-2 bg-gray-100 rounded">
                            <p className="text-gray-600">Loan Term</p>
                            <p className="font-semibold text-gray-900">
                              {program.loanTerm} months
                            </p>
                          </div>
                        )}

                        {program.deadline && (
                          <div className="p-2 bg-yellow-100 rounded border border-yellow-300">
                            <p className="text-gray-600 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Deadline
                            </p>
                            <p className="font-semibold text-gray-900">
                              {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                              }).format(program.deadline)}
                            </p>
                          </div>
                        )}

                        <div className="p-2 bg-gray-100 rounded">
                          <p className="text-gray-600">Type</p>
                          <Badge
                            className={`${getTypeColor(program.type)} text-xs`}
                          >
                            {program.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-600">No programs found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            onClick={() => {
              onOpenChange(false);
              setSearchTerm("");
              setSelectedItems(new Set());
            }}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPrograms}
            disabled={selectedItems.size === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selectedItems.size > 0 ? `(${selectedItems.size})` : ""} to
            Watchlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
