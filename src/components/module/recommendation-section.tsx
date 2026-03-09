import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";

interface ActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline?: string;
}

interface NextStep {
  index: number;
  step: string;
  owner?: string;
  dueDate?: string;
}

interface RecommendationSectionProps {
  title?: string;
  description?: string;
  recommendationText: string;
  actionItems: ActionItem[];
  nextSteps: NextStep[];
  onGenerateAudio?: () => Promise<string>;
}

const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
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

export function RecommendationSection({
  title = "Recommendations",
  description = "Strategic recommendations and action items",
  recommendationText,
  actionItems,
  nextSteps,
  onGenerateAudio,
}: RecommendationSectionProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = async () => {
    try {
      if (!audioUrl && onGenerateAudio) {
        const url = await onGenerateAudio();
        setAudioUrl(url);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlayingAudio(true);
          }
        }, 100);
      } else if (audioRef.current) {
        if (isPlayingAudio) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
        } else {
          audioRef.current.play();
          setIsPlayingAudio(true);
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Note Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayAudio}
            className="flex items-center gap-2 ml-4"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play Audio
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {recommendationText}
            </p>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl || ""}
            onEnded={handleAudioEnded}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                          {item.index}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.charAt(0).toUpperCase() +
                        item.priority.slice(1)}{" "}
                      Priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm ml-11 mb-2">
                    {item.description}
                  </p>
                  {item.timeline && (
                    <div className="ml-11 text-xs text-gray-500">
                      Timeline:{" "}
                      <span className="font-medium">{item.timeline}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:pb-0 last:border-0"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                      {step.index}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 mb-1">
                      {step.step}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      {step.owner && (
                        <span className="flex items-center">
                          <span className="font-medium">Owner:</span>
                          <span className="ml-1">{step.owner}</span>
                        </span>
                      )}
                      {step.dueDate && (
                        <span className="flex items-center">
                          <span className="font-medium">Due:</span>
                          <span className="ml-1">{step.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
