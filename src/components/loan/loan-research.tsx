import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Star,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { type LoanUpdate } from "@/lib/loan-data";
import {
  ManageAlertsModal,
  type AlertPreferences,
} from "@/components/loan/manage-alerts-modal";
import {
  AddProgramModal,
  type ProgramOption,
} from "@/components/loan/add-program-modal";

interface LoanResearchProps {
  loanUpdates: LoanUpdate[];
}

const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  newPrograms: true,
  rateChanges: true,
  deadlines: true,
  policyUpdates: false,
  frequency: "real-time",
  channel: "in-app",
  quietHours: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
  },
};

const AVAILABLE_PROGRAMS: ProgramOption[] = [
  {
    id: "sba-7a",
    name: "SBA 7(a) Loans",
    provider: "Small Business Administration",
    description: "General purpose business loans for various business purposes",
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
    description: "Real estate and equipment financing with fixed rates",
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
    description: "Non-dilutive funding for technology-focused businesses",
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
      "Debt financing for high-growth companies looking to extend runway",
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
      "Support for businesses owned by socially and economically disadvantaged groups",
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

export function LoanResearchUpdates({ loanUpdates }: LoanResearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [manageAlertsOpen, setManageAlertsOpen] = useState(false);
  const [addProgramOpen, setAddProgramOpen] = useState(false);
  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences>(
    DEFAULT_ALERT_PREFERENCES,
  );
  const [watchlistPrograms, setWatchlistPrograms] = useState<
    ProgramOption[] | null
  >(null);
  const [watchlistProgramIds, setWatchlistProgramIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("loanAlertPreferences");
    const savedWatchlist = localStorage.getItem("loanWatchlist");

    if (savedPreferences) {
      try {
        setAlertPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error("Failed to load alert preferences");
      }
    }

    if (savedWatchlist) {
      try {
        const ids = JSON.parse(savedWatchlist);
        setWatchlistProgramIds(ids);
        const programs = AVAILABLE_PROGRAMS.filter((p) => ids.includes(p.id));
        setWatchlistPrograms(programs);
      } catch (e) {
        console.error("Failed to load watchlist");
      }
    }
  }, []);

  // Save preferences to localStorage
  const handleSavePreferences = (preferences: AlertPreferences) => {
    setAlertPreferences(preferences);
    localStorage.setItem("loanAlertPreferences", JSON.stringify(preferences));
  };

  // Handle adding programs to watchlist
  const handleAddPrograms = (programIds: string[]) => {
    const newIds = Array.from(new Set([...watchlistProgramIds, ...programIds]));
    setWatchlistProgramIds(newIds);
    const programs = AVAILABLE_PROGRAMS.filter((p) => newIds.includes(p.id));
    setWatchlistPrograms(programs);
    localStorage.setItem("loanWatchlist", JSON.stringify(newIds));
  };

  // Handle removing program from watchlist
  const handleRemoveProgram = (programId: string) => {
    const newIds = watchlistProgramIds.filter((id) => id !== programId);
    setWatchlistProgramIds(newIds);
    const programs = AVAILABLE_PROGRAMS.filter((p) => newIds.includes(p.id));
    setWatchlistPrograms(programs);
    localStorage.setItem("loanWatchlist", JSON.stringify(newIds));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "new-program":
        return "bg-green-100 text-green-800";
      case "rate-change":
        return "bg-blue-100 text-blue-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "policy-update":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "new-program":
        return <Star className="w-4 h-4 text-green-600" />;
      case "rate-change":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "deadline":
        return <Clock className="w-4 h-4 text-red-600" />;
      case "policy-update":
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "new-program":
        return "New Program";
      case "rate-change":
        return "Rate Change";
      case "deadline":
        return "Deadline Alert";
      case "policy-update":
        return "Policy Update";
      default:
        return type;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "neutral":
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUpdates = loanUpdates.filter((update) => {
    const matchesSearch =
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || update.type === typeFilter;
    const matchesUrgency =
      urgencyFilter === "all" || update.urgency === urgencyFilter;

    return matchesSearch && matchesType && matchesUrgency;
  });

  const isExpiringSoon = (date?: Date) => {
    if (!date) return false;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Loan Research & Updates
          </h2>
          <p className="text-gray-600">
            Stay informed about new programs, rate changes, and deadlines
          </p>
        </div>
        <Button
          onClick={() => setManageAlertsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Bell className="w-4 h-4 mr-2" />
          Manage Alerts
        </Button>
      </div>

      {/* Manage Alerts Modal */}
      <ManageAlertsModal
        open={manageAlertsOpen}
        onOpenChange={setManageAlertsOpen}
        preferences={alertPreferences}
        onSavePreferences={handleSavePreferences}
      />

      {/* Add Program Modal */}
      <AddProgramModal
        open={addProgramOpen}
        onOpenChange={setAddProgramOpen}
        availablePrograms={AVAILABLE_PROGRAMS}
        selectedPrograms={watchlistProgramIds}
        onAddPrograms={handleAddPrograms}
      />

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {loanUpdates.filter((u) => u.type === "new-program").length}
            </div>
            <div className="text-sm text-green-700">New Programs</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {loanUpdates.filter((u) => u.type === "rate-change").length}
            </div>
            <div className="text-sm text-blue-700">Rate Changes</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {loanUpdates.filter((u) => u.urgency === "high").length}
            </div>
            <div className="text-sm text-red-700">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {
                loanUpdates.filter(
                  (u) => u.expiryDate && isExpiringSoon(u.expiryDate),
                ).length
              }
            </div>
            <div className="text-sm text-yellow-700">Expiring Soon</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filter Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search updates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="new-program">New Programs</SelectItem>
                  <SelectItem value="rate-change">Rate Changes</SelectItem>
                  <SelectItem value="deadline">Deadlines</SelectItem>
                  <SelectItem value="policy-update">Policy Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Urgency
              </label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <Card key={update.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">{getTypeIcon(update.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                      <Badge className={getTypeColor(update.type)}>
                        {getTypeLabel(update.type)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {update.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getUrgencyColor(update.urgency)}>
                    {update.urgency} priority
                  </Badge>
                  <Badge className={getImpactColor(update.impact)}>
                    {getImpactIcon(update.impact)}
                    <span className="ml-1">{update.impact}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Update Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium">{update.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Published:</span>
                    <span className="font-medium">
                      {formatDate(update.publishDate)}
                    </span>
                  </div>
                </div>
                {update.expiryDate && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expires:</span>
                      <span
                        className={`font-medium ${isExpiringSoon(update.expiryDate) ? "text-red-600" : ""}`}
                      >
                        {formatDate(update.expiryDate)}
                      </span>
                    </div>
                    {isExpiringSoon(update.expiryDate) && (
                      <div className="flex items-center space-x-1 text-sm text-red-600">
                        <Clock className="w-3 h-3" />
                        <span>Expires soon!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Affected Programs */}
              {update.affectedPrograms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Affected Programs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {update.affectedPrograms.map((program, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Required */}
              {update.actionRequired && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Action Required
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {update.actionRequired}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  More Info
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Add to Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No updates found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new updates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Watchlist Management */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Personalized Watchlist
          </CardTitle>
          <CardDescription className="text-blue-700">
            Manage your tracked programs and alert preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Preferences Summary */}
            <div>
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Active Alert Preferences
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={alertPreferences.newPrograms}
                    readOnly
                    className="rounded"
                  />
                  <span>New loan programs</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={alertPreferences.rateChanges}
                    readOnly
                    className="rounded"
                  />
                  <span>Interest rate changes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={alertPreferences.deadlines}
                    readOnly
                    className="rounded"
                  />
                  <span>Application deadlines</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={alertPreferences.policyUpdates}
                    readOnly
                    className="rounded"
                  />
                  <span>Policy updates</span>
                </label>
                <div className="pt-2 mt-3 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-1">
                    Frequency:{" "}
                    <span className="font-semibold capitalize">
                      {alertPreferences.frequency.replace("-", " ")}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-blue-700">
                    Channel:{" "}
                    <span className="font-semibold capitalize">
                      {alertPreferences.channel === "in-app"
                        ? "In-App"
                        : alertPreferences.channel === "email"
                          ? "Email"
                          : "Both"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tracked Programs */}
            <div>
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Tracked Programs ({watchlistProgramIds.length})
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                {watchlistPrograms && watchlistPrograms.length > 0 ? (
                  <>
                    {watchlistPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="flex justify-between items-center p-2 bg-white rounded border border-blue-100"
                      >
                        <div>
                          <span className="font-medium">{program.name}</span>
                          <p className="text-xs text-blue-700">
                            {program.provider}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveProgram(program.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => setAddProgramOpen(true)}
                      variant="outline"
                      size="sm"
                      className="w-full text-blue-700 border-blue-200 hover:bg-blue-100 mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Another Program
                    </Button>
                  </>
                ) : (
                  <div className="p-3 bg-white rounded border border-blue-100 text-center">
                    <p className="text-blue-700 font-medium mb-2">
                      No programs tracked yet
                    </p>
                    <Button
                      onClick={() => setAddProgramOpen(true)}
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Program
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manage Alerts Link */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              Want to change your alert preferences?
            </p>
            <Button
              onClick={() => setManageAlertsOpen(true)}
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Bell className="w-4 h-4 mr-1" />
              Manage Alert Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
