import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell, Lightbulb, X } from "lucide-react";

interface NotificationsIdeasPopoversProps {
  notificationCount?: number;
  ideasLink?: string; // Link for "Generate More Ideas" - defaults to /ai-insights
  moduleName?: string; // For context in ideas section
}

export function NotificationsIdeasPopovers({
  notificationCount = 2,
  ideasLink = "/ai-insights",
  moduleName = "Module",
}: NotificationsIdeasPopoversProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);

  const sampleNotifications = [
    {
      id: 1,
      title: "Data Updated",
      message: "New market data available",
      time: "5 mins ago",
    },
    {
      id: 2,
      title: "Alert",
      message: "Review required for forecast variance",
      time: "20 mins ago",
    },
  ];

  const sampleIdeas = [
    {
      id: 1,
      title: "Optimization Opportunity",
      message: "Consider adjusting strategy based on market trends",
    },
    {
      id: 2,
      title: "Performance Insight",
      message: "Analysis accuracy has improved by 15%",
    },
  ];

  return (
    <>
      {/* Notifications Button */}
      <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {notificationCount}
                </Badge>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View notifications and alerts</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80" align="end">
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
              {sampleNotifications.map((notif) => (
                <div key={notif.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                </div>
              ))}
            </div>
            <Link to="/notifications" onClick={() => setNotificationsOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">
                View All Notifications
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {/* Ideas Button */}
      <Popover open={ideasOpen} onOpenChange={setIdeasOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Ideas</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI-powered insights and recommendations</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{moduleName} Ideas</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIdeasOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {sampleIdeas.map((idea) => (
                <div key={idea.id} className="p-3 rounded-lg border bg-card">
                  <p className="text-sm font-medium">{idea.title}</p>
                  <p className="text-xs text-muted-foreground">{idea.message}</p>
                </div>
              ))}
            </div>
            <Link to={ideasLink} onClick={() => setIdeasOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">
                Generate More Ideas
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
