import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import {
  TrendingUp,
  BarChart3,
  Activity,
  Calculator,
  Globe,
  Target,
  Building,
  DollarSign,
  Package,
} from "lucide-react";
import { ModuleContext } from "../../lib/chatbot-data";
import { cn } from "../../lib/utils";

interface ModuleContextSwitcherProps {
  contexts: ModuleContext[];
  currentContext: ModuleContext;
  onContextSwitch: (contextId: string) => void;
  className?: string;
}

const iconMap = {
  TrendingUp,
  BarChart3,
  Activity,
  Calculator,
  Globe,
  Target,
  Building,
  DollarSign,
  Package,
};

export function ModuleContextSwitcher({
  contexts,
  currentContext,
  onContextSwitch,
  className,
}: ModuleContextSwitcherProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || BarChart3;
    return IconComponent;
  };

  return (
    <div className={cn("flex flex-col gap-2 p-3", className)}>
      <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
        Module Context
      </div>
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {contexts.map((context) => {
            const IconComponent = getIcon(context.icon);
            const isActive = context.id === currentContext.id;

            return (
              <Tooltip key={context.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 h-auto py-3 px-3 rounded-lg transition-all duration-200",
                      isActive && "bg-primary text-primary-foreground shadow-md border-primary/20",
                      !isActive && "hover:bg-muted/60 hover:shadow-sm border-transparent"
                    )}
                    onClick={() => onContextSwitch(context.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <IconComponent className="h-4 w-4 flex-shrink-0 opacity-80" />
                      <div className="text-left min-w-0 flex-1">
                        <div className="text-sm font-medium truncate leading-tight">
                          {context.name}
                        </div>
                        <div className="text-xs opacity-60 truncate mt-0.5 leading-tight">
                          {context.description}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                        Active
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" align="start">
                  <div className="max-w-xs">
                    <p className="font-medium">{context.name}</p>
                    <p className="text-xs opacity-90 mt-1">{context.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium">I can help with:</p>
                      <ul className="text-xs opacity-90 mt-1 space-y-0.5">
                        {context.capabilities.slice(0, 3).map((capability, index) => (
                          <li key={index}>• {capability}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
          Quick Actions
        </div>
        <div className="space-y-1 px-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs hover:bg-primary/10"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Upload Document
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs hover:bg-primary/10"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            Upload Image
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs hover:bg-primary/10"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
              <path d="M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
            Start Analysis
          </Button>
        </div>
      </div>

      {/* Status Section */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium">Joseph AI Online</span>
          </div>
          <div className="text-xs opacity-75 leading-tight">
            Active: {currentContext.name}
          </div>
        </div>
      </div>
    </div>
  );
}
