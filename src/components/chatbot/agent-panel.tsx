import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Bot,
  Play,
  Square,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react";
import { useAgent, AgentStatus } from "../../hooks/useAgent";
import { cn } from "../../lib/utils";

interface AgentPanelProps {
  className?: string;
}

export function AgentPanel({ className }: AgentPanelProps) {
  const {
    isLoading,
    error,
    status,
    startAgent,
    stopAgent,
    getAgentStatus,
    clearError,
  } = useAgent();

  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh status every 30 seconds when enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRefresh) {
      interval = setInterval(() => {
        getAgentStatus().catch(() => {
          // Ignore errors during auto-refresh
        });
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, getAgentStatus]);

  // Initial status fetch
  useEffect(() => {
    getAgentStatus().catch(() => {
      // Ignore initial fetch errors
    });
  }, [getAgentStatus]);

  const handleStartAgent = async () => {
    try {
      await startAgent();
      // Refresh status after starting
      setTimeout(() => getAgentStatus(), 1000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleStopAgent = async () => {
    try {
      await stopAgent();
      // Refresh status after stopping
      setTimeout(() => getAgentStatus(), 1000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const formatLastUpdate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Card className={cn("p-4 h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Autonomous Agent</h3>
          {status?.is_running && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={cn("h-4 w-4", autoRefresh && "animate-spin")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{autoRefresh ? "Disable" : "Enable"} auto-refresh</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => getAgentStatus()}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh status</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Error</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-auto"
              onClick={clearError}
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Agent Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleStartAgent}
            disabled={isLoading || status?.is_running}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Agent
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={handleStopAgent}
            disabled={isLoading || !status?.is_running}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Agent
          </Button>
        </div>

        {/* Agent Status */}
        {status && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {status.pending_tasks}
                </div>
                <div className="text-xs text-muted-foreground">Pending Tasks</div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {status.completed_tasks}
                </div>
                <div className="text-xs text-muted-foreground">Completed Tasks</div>
              </div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {status.memory_size}
              </div>
              <div className="text-xs text-muted-foreground">Memory Items</div>
            </div>

            {/* Module Updates */}
            {Object.keys(status.last_updates).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Module Updates</h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {Object.entries(status.last_updates).map(([module, timestamp]) => (
                      <div
                        key={module}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm capitalize">
                            {module.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatLastUpdate(timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {/* Agent Capabilities */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Agent Capabilities</h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Bot className="h-3 w-3 text-primary" />
              <span>Information Retrieval</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3 w-3 text-primary" />
              <span>Web Search</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3 w-3 text-primary" />
              <span>Data Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3 w-3 text-primary" />
              <span>Auto Module Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3 w-3 text-primary" />
              <span>User Request Handling</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
