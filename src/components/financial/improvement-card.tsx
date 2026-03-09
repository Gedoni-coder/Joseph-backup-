import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ImprovementCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  summary: string;
  details: React.ReactNode;
}

export function ImprovementCard({
  icon: Icon,
  iconColor,
  title,
  summary,
  details,
}: ImprovementCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-4 hover:bg-gray-50 text-left"
      >
        <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{summary}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
            expanded ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t bg-gray-50 p-4">
          <div className="text-gray-700">{details}</div>
        </div>
      )}
    </div>
  );
}
