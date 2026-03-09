import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Sun, Moon, Lock, Bell, Eye, CreditCard, Globe, Link as LinkIcon, LogOut, Trash2, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useCurrency, CURRENCIES } from "@/lib/currency-context";
import { Switch } from "@/components/ui/switch";

export default function UserSettings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { currency, setCurrency: setCurrencyContext } = useCurrency();
  const [activeTab, setActiveTab] = useState("account");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Account Settings
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Appearance Settings
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("English");
  const [layout, setLayout] = useState("comfortable");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("instant");

  // Privacy & Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginHistory, setLoginHistory] = useState([
    { device: "Chrome on Windows", date: "Today", ip: "192.168.1.1" },
    { device: "Safari on iPhone", date: "Yesterday", ip: "192.168.1.2" },
  ]);

  // Preferences
  const [timezone, setTimezone] = useState("UTC");
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveAccountSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("WARNING: This action cannot be undone. Delete your account permanently?")) {
      alert("Account deletion requested. This feature requires backend implementation.");
    }
  };

  const settingsMenu = [
    { id: "account", label: "Account", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Eye },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "connected", label: "Connected Accounts", icon: LinkIcon },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "danger", label: "Danger Zone", icon: AlertCircle },
  ];

  return (
    <div className="container mx-auto py-6 md:py-8 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl md:text-2xl">User Settings</CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  Manage your account, preferences, and security
                </CardDescription>
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-blue-500 rounded transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </CardHeader>
        </Card>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-in fade-in">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            <p className="text-sm text-green-700">Settings updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* SIDEBAR NAVIGATION - DESKTOP */}
          <aside className="hidden md:block lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                          isActive
                            ? "bg-blue-100 dark:bg-blue-950 border-l-4 border-blue-600 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs md:text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* SIDEBAR NAVIGATION - MOBILE */}
          {mobileMenuOpen && (
            <div className="md:hidden col-span-1 mb-4">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {settingsMenu.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                            isActive
                              ? "bg-blue-100 dark:bg-blue-950 border-l-4 border-blue-600 text-blue-700 dark:text-blue-400 font-medium"
                              : "text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          )}

          {/* MAIN CONTENT */}
          <main className="col-span-1 lg:col-span-3">
            {/* ACCOUNT SETTINGS */}
            {activeTab === "account" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-bold text-blue-700">{firstName.charAt(0)}{lastName.charAt(0)}</span>
                    </div>
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <form onSubmit={handleSaveAccountSettings} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-xs md:text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Change Password
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* APPEARANCE SETTINGS */}
            {activeTab === "appearance" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Sun className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Theme</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          theme === "light" ? "border-blue-600 bg-blue-50" : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Sun className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-sm font-medium">Light Mode</p>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          theme === "dark" ? "border-blue-600 bg-blue-50 dark:bg-blue-950" : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Moon className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-sm font-medium">Dark Mode</p>
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="fontSize" className="text-sm font-medium block mb-2">Font Size</Label>
                    <select
                      id="fontSize"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium (Default)</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="language" className="text-sm font-medium block mb-2">Language</Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="layout" className="text-sm font-medium block mb-2">Layout Style</Label>
                    <select
                      id="layout"
                      value={layout}
                      onChange={(e) => setLayout(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable (Default)</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Appearance Settings</Button>
                </CardContent>
              </Card>
            )}

            {/* NOTIFICATIONS SETTINGS */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Control how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Get updates via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">News and special offers</p>
                      </div>
                      <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="frequency" className="text-sm font-medium block mb-2">Notification Frequency</Label>
                    <select
                      id="frequency"
                      value={notificationFrequency}
                      onChange={(e) => setNotificationFrequency(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="instant">Instant</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Notification Settings</Button>
                </CardContent>
              </Card>
            )}

            {/* PRIVACY & SECURITY */}
            {activeTab === "privacy" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Eye className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Two-Factor Authentication (2FA)
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security</p>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Login History</h4>
                    <div className="space-y-3">
                      {loginHistory.map((login, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{login.device}</p>
                              <p className="text-xs text-muted-foreground">IP: {login.ip}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{login.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Privacy Settings</Button>
                </CardContent>
              </Card>
            )}

            {/* PREFERENCES */}
            {activeTab === "preferences" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Globe className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Set your app preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium block mb-2">Currency</Label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrencyContext(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="timezone" className="text-sm font-medium block mb-2">Timezone</Label>
                    <select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (Eastern)</option>
                      <option value="CST">CST (Central)</option>
                      <option value="MST">MST (Mountain)</option>
                      <option value="PST">PST (Pacific)</option>
                      <option value="GMT">GMT (London)</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Save</p>
                        <p className="text-sm text-muted-foreground">Automatically save your work</p>
                      </div>
                      <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                </CardContent>
              </Card>
            )}

            {/* CONNECTED ACCOUNTS */}
            {activeTab === "connected" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <LinkIcon className="h-5 w-5" />
                    Connected Accounts
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Manage your linked integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-6">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Google Account</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Microsoft Account</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Slack Workspace</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* BILLING */}
            {activeTab === "billing" && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <CreditCard className="h-5 w-5" />
                    Billing & Subscription
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Current Plan</p>
                    <p className="text-2xl font-bold">Free Plan</p>
                    <p className="text-sm text-muted-foreground mt-2">Limited features. Upgrade for full access.</p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Premium</Button>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Billing History</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>No billing history yet. You're on a free plan.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DANGER ZONE */}
            {activeTab === "danger" && (
              <Card className="border-red-200">
                <CardHeader className="bg-red-50 dark:bg-red-950 border-b border-red-200 p-4 md:p-6">
                  <CardTitle className="text-red-700 flex items-center gap-2 text-lg md:text-xl">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-600 text-xs md:text-sm">Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-6">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <p className="font-medium mb-2">Log Out</p>
                    <p className="text-sm text-muted-foreground mb-4">Sign out from this session</p>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg">
                    <p className="font-medium mb-2">Delete Account</p>
                    <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data</p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account Permanently
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
