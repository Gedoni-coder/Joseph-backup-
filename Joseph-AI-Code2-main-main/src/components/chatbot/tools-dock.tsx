import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Calculator,
  TrendingUp,
  Target,
  Scale,
  Globe,
  BookOpen,
  ClipboardList,
  Monitor,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { EconomicTool } from "../../lib/chatbot-data";
import { cn } from "../../lib/utils";

interface ToolsDockProps {
  tools: EconomicTool[];
  onToolSelect: (toolId: string) => void;
  className?: string;
}

const iconMap = {
  Calculator,
  TrendingUp,
  Target,
  Scale,
  Globe,
  BookOpen,
  ClipboardList,
  Monitor,
};

const categoryLabels = {
  calculator: "Calculators",
  analyzer: "Analyzers", 
  planner: "Planners",
  advisor: "Advisors",
  utility: "Utilities",
};

export function ToolsDock({ tools, onToolSelect, className }: ToolsDockProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["calculator", "analyzer"])
  );

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Calculator;
    return IconComponent;
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (expandedCategories.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, EconomicTool[]>);

  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
        Economic Tools
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => {
            const isExpanded = expandedCategories.has(category);
            const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || category;
            
            return (
              <div key={category}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-8 px-2"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{categoryLabel}</span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {categoryTools.length}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-2 space-y-1">
                    {categoryTools.map((tool) => {
                      const IconComponent = getIcon(tool.icon);
                      
                      return (
                        <Tooltip key={tool.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start gap-2 h-auto py-2 px-2",
                                !tool.isAvailable && "opacity-50 cursor-not-allowed"
                              )}
                              onClick={() => tool.isAvailable && onToolSelect(tool.id)}
                              disabled={!tool.isAvailable}
                            >
                              <IconComponent className="h-4 w-4 flex-shrink-0" />
                              <div className="text-left min-w-0 flex-1">
                                <div className="text-xs font-medium truncate">
                                  {tool.name}
                                </div>
                                <div className="text-xs opacity-70 truncate">
                                  {tool.description}
                                </div>
                              </div>
                              {!tool.isAvailable && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  Soon
                                </Badge>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start">
                            <div className="max-w-xs">
                              <p className="font-medium">{tool.name}</p>
                              <p className="text-xs opacity-90 mt-1">{tool.description}</p>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {categoryLabel}
                                </Badge>
                                {!tool.isAvailable && (
                                  <Badge variant="secondary" className="text-xs ml-1">
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="mt-2 pt-2 border-t">
        <div className="text-xs text-muted-foreground px-2">
          <div className="flex items-center justify-between">
            <span>Available Tools</span>
            <Badge variant="outline" className="text-xs">
              {tools.filter(t => t.isAvailable).length}/{tools.length}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
