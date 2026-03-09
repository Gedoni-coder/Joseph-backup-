import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, Clock, Mail } from "lucide-react";

export interface AlertPreferences {
  newPrograms: boolean;
  rateChanges: boolean;
  deadlines: boolean;
  policyUpdates: boolean;
  frequency: "real-time" | "daily" | "weekly";
  channel: "in-app" | "email" | "both";
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface ManageAlertsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: AlertPreferences;
  onSavePreferences: (preferences: AlertPreferences) => void;
}

const DEFAULT_PREFERENCES: AlertPreferences = {
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

export function ManageAlertsModal({
  open,
  onOpenChange,
  preferences,
  onSavePreferences,
}: ManageAlertsModalProps) {
  const [localPreferences, setLocalPreferences] = useState<AlertPreferences>(
    preferences || DEFAULT_PREFERENCES,
  );

  const handleTypeChange = (
    type: keyof Omit<AlertPreferences, "frequency" | "channel" | "quietHours">,
    checked: boolean,
  ) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleFrequencyChange = (frequency: AlertPreferences["frequency"]) => {
    setLocalPreferences((prev) => ({
      ...prev,
      frequency,
    }));
  };

  const handleChannelChange = (channel: AlertPreferences["channel"]) => {
    setLocalPreferences((prev) => ({
      ...prev,
      channel,
    }));
  };

  const handleQuietHoursChange = (field: string, value: boolean | string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSavePreferences(localPreferences);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Alert Preferences</DialogTitle>
          <DialogDescription>
            Customize how you receive updates about loan programs and funding
            opportunities
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="types">Alert Types</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="channel">Channel</TabsTrigger>
            <TabsTrigger value="quiet">Quiet Hours</TabsTrigger>
          </TabsList>

          {/* Alert Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Bell className="w-4 h-4 mr-2" />
                  Alert Type Preferences
                </CardTitle>
                <CardDescription>
                  Choose which types of alerts you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <Checkbox
                      id="new-programs"
                      checked={localPreferences.newPrograms}
                      onCheckedChange={(checked) =>
                        handleTypeChange("newPrograms", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="new-programs"
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900">New Programs</p>
                      <p className="text-sm text-gray-600">
                        Get notified when new loan programs become available
                      </p>
                    </label>
                    <Badge className="bg-green-100 text-green-800">New</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <Checkbox
                      id="rate-changes"
                      checked={localPreferences.rateChanges}
                      onCheckedChange={(checked) =>
                        handleTypeChange("rateChanges", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="rate-changes"
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900">Rate Changes</p>
                      <p className="text-sm text-gray-600">
                        Alerts when interest rates change for programs you're
                        tracking
                      </p>
                    </label>
                    <Badge className="bg-blue-100 text-blue-800">Change</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <Checkbox
                      id="deadlines"
                      checked={localPreferences.deadlines}
                      onCheckedChange={(checked) =>
                        handleTypeChange("deadlines", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="deadlines"
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900">
                        Application Deadlines
                      </p>
                      <p className="text-sm text-gray-600">
                        Reminders for upcoming application deadlines
                      </p>
                    </label>
                    <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <Checkbox
                      id="policy-updates"
                      checked={localPreferences.policyUpdates}
                      onCheckedChange={(checked) =>
                        handleTypeChange("policyUpdates", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="policy-updates"
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900">
                        Policy Updates
                      </p>
                      <p className="text-sm text-gray-600">
                        Changes in lending policies and regulations
                      </p>
                    </label>
                    <Badge className="bg-purple-100 text-purple-800">
                      Policy
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start space-x-2">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Tip:</span> Enable all alert
                    types to stay informed about funding opportunities that
                    match your business.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Frequency Tab */}
          <TabsContent value="frequency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  Notification Frequency
                </CardTitle>
                <CardDescription>
                  How often would you like to receive alerts?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  onClick={() => handleFrequencyChange("real-time")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.frequency === "real-time"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Real-time</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive notifications immediately when something changes
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Best for time-sensitive updates like deadlines
                  </p>
                </div>

                <div
                  onClick={() => handleFrequencyChange("daily")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.frequency === "daily"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Daily Digest</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive a summary of all alerts once per day
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Best for staying informed without too many notifications
                  </p>
                </div>

                <div
                  onClick={() => handleFrequencyChange("weekly")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.frequency === "weekly"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Weekly Digest</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive a summary of the week's updates
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Best for busy schedules
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channel Tab */}
          <TabsContent value="channel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Mail className="w-4 h-4 mr-2" />
                  Notification Channel
                </CardTitle>
                <CardDescription>
                  How would you like to receive notifications?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  onClick={() => handleChannelChange("in-app")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.channel === "in-app"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">In-App Alerts</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Notifications appear in the platform dashboard
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ View alerts anytime you log in
                  </p>
                </div>

                <div
                  onClick={() => handleChannelChange("email")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.channel === "email"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive alerts via email
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Delivered to your registered email address
                  </p>
                </div>

                <div
                  onClick={() => handleChannelChange("both")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    localPreferences.channel === "both"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Both</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive alerts both in-app and via email
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Never miss an important update
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Email requires a verified email address on your account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiet Hours Tab */}
          <TabsContent value="quiet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Set a time window when you don't want to receive alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                  <Checkbox
                    id="quiet-hours-enabled"
                    checked={localPreferences.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      handleQuietHoursChange("enabled", checked)
                    }
                  />
                  <label
                    htmlFor="quiet-hours-enabled"
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-gray-900">
                      Enable Quiet Hours
                    </p>
                    <p className="text-sm text-gray-600">
                      Silence notifications during specific times
                    </p>
                  </label>
                </div>

                {localPreferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={localPreferences.quietHours.startTime}
                        onChange={(e) =>
                          handleQuietHoursChange("startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        When to start quiet hours
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={localPreferences.quietHours.endTime}
                        onChange={(e) =>
                          handleQuietHoursChange("endTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        When to resume notifications
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Example:</span> Set quiet
                    hours from 10:00 PM to 8:00 AM to avoid notifications during
                    sleep hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset to Default
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
