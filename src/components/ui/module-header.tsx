import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConversationalMode } from "@/App";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModuleNavigation from "@/components/ui/module-navigation";
import { ConnectionStatus } from "@/components/ui/connection-status";
import {
  Bell,
  HelpCircle,
  X,
  Radio,
  AlertCircle,
  Zap,
  Target,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ModuleHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected?: boolean;
  lastUpdated?: Date;
  onReconnect?: () => void;
  error?: string | null;
  connectionLabel?: string;
  showConnectionStatus?: boolean;
  onConversationalModeChange?: (enabled: boolean) => void;
  conversationalMode?: boolean;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  icon,
  title,
  description,
  isConnected = true,
  lastUpdated,
  onReconnect,
  error,
  connectionLabel = "Live",
  showConnectionStatus = true,
  onConversationalModeChange: externalOnChange,
  conversationalMode: externalConversationalMode,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);

  // Use context hook if props not provided
  let contextMode = undefined;
  let contextOnChange = undefined;
  try {
    const context = useConversationalMode();
    contextMode = context.conversationalMode;
    contextOnChange = context.onConversationalModeChange;
  } catch {
    // Context not available, will use props or local state
  }

  const conversationalMode =
    externalConversationalMode !== undefined
      ? externalConversationalMode
      : (contextMode ?? localStorage.getItem("conversationalMode") === "true");

  const handleConversationalModeChange = (enabled: boolean) => {
    if (externalOnChange) {
      externalOnChange(enabled);
    } else if (contextOnChange) {
      contextOnChange(enabled);
    } else {
      localStorage.setItem("conversationalMode", String(enabled));
    }
  };

  return (
    <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Main Title Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl text-white flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight truncate">
                {title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Navigation and Controls */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Top Row - Navigation and Right Actions */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
              <div className="flex items-center flex-shrink-0">
                <ModuleNavigation />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                {/* Notifications */}
                <Popover
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 sm:gap-2 relative px-2 sm:px-3"
                        >
                          <Bell className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                          <span className="hidden md:inline text-xs sm:text-sm">
                            Notifications
                          </span>
                          <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-4 sm:h-5 w-4 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            2
                          </Badge>
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View recent notifications and alerts</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-72 sm:w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Notifications</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                Data Updated
                              </p>
                              <p className="text-xs text-muted-foreground">
                                New analysis data available
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                15 minutes ago
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start gap-3">
                            <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Alert</p>
                              <p className="text-xs text-muted-foreground">
                                Review required for analysis variance
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1 hour ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link to="/notifications">
                        <Button variant="outline" className="w-full" size="sm">
                          View All Notifications
                        </Button>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Advice */}
                <Popover open={ideasOpen} onOpenChange={setIdeasOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3"
                        >
                          <HelpCircle className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                          <span className="hidden md:inline text-xs sm:text-sm">
                            Advice
                          </span>
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get expert advice and recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-72 sm:w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Advice</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIdeasOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                Optimization Opportunity
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Consider refining your analysis parameters
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start gap-3">
                            <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                Performance Insight
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Analysis accuracy has improved significantly
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link to="/ai-insights">
                        <Button variant="outline" className="w-full" size="sm">
                          Get More Advice
                        </Button>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Bottom Row - Divisions and Chat (visible on all screens, moves below on mobile) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Divisions Label */}
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 border-l border-border">
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                  Divisions
                </span>
              </div>

              {/* Conversational Mode Toggle - Chat Switch */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 px-1.5 sm:px-2 py-1 hover:bg-primary/10 rounded transition-all cursor-pointer">
                    <Radio className="h-3 sm:h-4 w-3 sm:w-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground font-medium sm:inline whitespace-nowrap">
                      Chat
                    </span>
                    <Switch
                      checked={conversationalMode}
                      onCheckedChange={handleConversationalModeChange}
                      className="scale-75 sm:scale-100 origin-left"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {conversationalMode
                      ? "Conversational Mode ON"
                      : "Conversational Mode OFF"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <div className="h-4 w-px bg-border mx-1 hidden sm:block"></div>

              {/* Settings Link */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/user-settings"
                    className="flex items-center gap-1.5 px-2 py-1 hover:bg-primary/10 rounded transition-all cursor-pointer border border-transparent hover:border-primary/20"
                  >
                    <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap uppercase tracking-wider">
                      Settings
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Access your user preferences and account settings</p>
                </TooltipContent>
              </Tooltip>

              {showConnectionStatus && (
                <div className="flex items-center gap-1.5 sm:gap-2 hidden sm:flex">
                  <Badge
                    variant={isConnected ? "default" : "destructive"}
                    className={`text-xs ${
                      isConnected
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : ""
                    }`}
                  >
                    {isConnected ? connectionLabel : "Offline"}
                  </Badge>
                  {lastUpdated && (
                    <span className="text-xs text-gray-500 hidden lg:inline">
                      Updated {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModuleHeader;
