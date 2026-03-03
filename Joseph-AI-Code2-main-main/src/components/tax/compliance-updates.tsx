import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplianceUpdate } from "@/lib/tax-compliance-data";
import {
  Bell,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Flag,
  Building,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceUpdatesProps {
  updates: ComplianceUpdate[];
  onUpdateStatus: (
    id: string,
    status: "new" | "reviewed" | "implemented" | "archived",
  ) => void;
  title?: string;
}

export function ComplianceUpdates({
  updates,
  onUpdateStatus,
  title = "Automated Compliance Updates & Guidance",
}: ComplianceUpdatesProps) {
  const getTypeIcon = (type: ComplianceUpdate["type"]) => {
    switch (type) {
      case "regulation":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "form":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-red-600" />;
      case "rate_change":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "guidance":
        return <Bell className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: ComplianceUpdate["type"]) => {
    switch (type) {
      case "regulation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "form":
        return "bg-green-100 text-green-800 border-green-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      case "rate_change":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "guidance":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getJurisdictionIcon = (
    jurisdiction: ComplianceUpdate["jurisdiction"],
  ) => {
    switch (jurisdiction) {
      case "federal":
        return <Flag className="h-4 w-4" />;
      case "state":
        return <Building className="h-4 w-4" />;
      case "local":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: ComplianceUpdate["impact"]) => {
    switch (impact) {
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

  const getStatusColor = (status: ComplianceUpdate["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "implemented":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ComplianceUpdate["status"]) => {
    switch (status) {
      case "new":
        return <Bell className="h-4 w-4" />;
      case "reviewed":
        return <Clock className="h-4 w-4" />;
      case "implemented":
        return <CheckCircle className="h-4 w-4" />;
      case "archived":
        return <FileText className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline?: Date) => {
    if (!deadline) return null;
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const urgentUpdates = updates.filter(
    (update) => update.actionRequired && update.status === "new",
  );
  const reviewedUpdates = updates.filter(
    (update) => update.status === "reviewed",
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
            {updates.length} updates
          </Badge>
          {urgentUpdates.length > 0 && (
            <Badge className="text-xs bg-red-100 text-red-800">
              {urgentUpdates.length} urgent
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">New Updates</div>
                <div className="text-xl font-bold text-blue-600">
                  {updates.filter((u) => u.status === "new").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Review</div>
                <div className="text-xl font-bold text-yellow-600">
                  {reviewedUpdates.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Action Required</div>
                <div className="text-xl font-bold text-red-600">
                  {updates.filter((u) => u.actionRequired).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Implemented</div>
                <div className="text-xl font-bold text-green-600">
                  {updates.filter((u) => u.status === "implemented").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Updates */}
      {urgentUpdates.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Urgent Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentUpdates.slice(0, 3).map((update) => (
                <div
                  key={update.id}
                  className="flex items-start justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{update.title}</div>
                    <div className="text-xs text-gray-600">
                      {update.description}
                    </div>
                    {update.deadline && (
                      <div className="text-xs text-red-600 font-medium">
                        Due: {formatDate(update.deadline)} (
                        {getDaysUntilDeadline(update.deadline)} days)
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(update.id, "reviewed")}
                    className="ml-4"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Updates */}
      <div className="space-y-4">
        {updates.map((update) => (
          <Card
            key={update.id}
            className={cn(
              "transition-all hover:shadow-md",
              update.actionRequired && update.status === "new"
                ? "border-red-200"
                : "border-gray-200",
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(update.type)}
                    <span className="font-medium text-sm">{update.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getTypeColor(update.type))}>
                      {update.type.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={cn("text-xs", getImpactColor(update.impact))}
                    >
                      {update.impact} impact
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      {getJurisdictionIcon(update.jurisdiction)}
                      <span className="capitalize">{update.jurisdiction}</span>
                    </div>
                  </div>
                </div>
                <Badge className={cn("text-xs", getStatusColor(update.status))}>
                  {getStatusIcon(update.status)}
                  <span className="ml-1">{update.status}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {update.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Effective: {formatDate(update.effectiveDate)}</span>
                  </div>
                  {update.deadline && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Clock className="h-3 w-3" />
                      <span>
                        Due: {formatDate(update.deadline)} (
                        {getDaysUntilDeadline(update.deadline)} days)
                      </span>
                    </div>
                  )}
                </div>

                {update.status !== "implemented" &&
                  update.status !== "archived" && (
                    <div className="flex gap-2">
                      {update.status === "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus(update.id, "reviewed")}
                        >
                          Mark Reviewed
                        </Button>
                      )}
                      {update.status === "reviewed" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            onUpdateStatus(update.id, "implemented")
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Implemented
                        </Button>
                      )}
                    </div>
                  )}
              </div>

              {update.actionRequired && update.status === "new" && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-100 p-2 rounded">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Action required for compliance</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
