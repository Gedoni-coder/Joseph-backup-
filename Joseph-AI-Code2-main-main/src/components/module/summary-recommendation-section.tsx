import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";

interface SummaryItem {
  index: number;
  title: string;
  value: string | number;
  unit?: string;
  insight: string;
}

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

interface SummaryRecommendationProps {
  summaryTitle?: string;
  summaryDescription?: string;
  summaryText: string;
  summaryMetrics: SummaryItem[];
  recommendationTitle?: string;
  recommendationDescription?: string;
  recommendationText: string;
  actionItems: ActionItem[];
  nextSteps: NextStep[];
  onGenerateSummaryAudio?: () => Promise<string>;
  onGenerateRecommendationAudio?: () => Promise<string>;
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

export function SummaryRecommendationSection({
  summaryTitle = "Summary",
  summaryDescription = "Key metrics and insights from this module",
  summaryText,
  summaryMetrics,
  recommendationTitle = "Recommendations",
  recommendationDescription = "Strategic recommendations and action items",
  recommendationText,
  actionItems,
  nextSteps,
  onGenerateSummaryAudio,
  onGenerateRecommendationAudio,
}: SummaryRecommendationProps) {
  const [isPlayingSummaryAudio, setIsPlayingSummaryAudio] = useState(false);
  const [summaryAudioUrl, setSummaryAudioUrl] = useState<string | null>(null);
  const summaryAudioRef = useRef<HTMLAudioElement>(null);

  const [isPlayingRecommendationAudio, setIsPlayingRecommendationAudio] =
    useState(false);
  const [recommendationAudioUrl, setRecommendationAudioUrl] = useState<
    string | null
  >(null);
  const recommendationAudioRef = useRef<HTMLAudioElement>(null);

  const handlePlaySummaryAudio = async () => {
    try {
      if (!summaryAudioUrl && onGenerateSummaryAudio) {
        const url = await onGenerateSummaryAudio();
        setSummaryAudioUrl(url);
        setTimeout(() => {
          if (summaryAudioRef.current) {
            summaryAudioRef.current.play();
            setIsPlayingSummaryAudio(true);
          }
        }, 100);
      } else if (summaryAudioRef.current) {
        if (isPlayingSummaryAudio) {
          summaryAudioRef.current.pause();
          setIsPlayingSummaryAudio(false);
        } else {
          summaryAudioRef.current.play();
          setIsPlayingSummaryAudio(true);
        }
      }
    } catch (error) {
      console.error("Error playing summary audio:", error);
    }
  };

  const handlePlayRecommendationAudio = async () => {
    try {
      if (!recommendationAudioUrl && onGenerateRecommendationAudio) {
        const url = await onGenerateRecommendationAudio();
        setRecommendationAudioUrl(url);
        setTimeout(() => {
          if (recommendationAudioRef.current) {
            recommendationAudioRef.current.play();
            setIsPlayingRecommendationAudio(true);
          }
        }, 100);
      } else if (recommendationAudioRef.current) {
        if (isPlayingRecommendationAudio) {
          recommendationAudioRef.current.pause();
          setIsPlayingRecommendationAudio(false);
        } else {
          recommendationAudioRef.current.play();
          setIsPlayingRecommendationAudio(true);
        }
      }
    } catch (error) {
      console.error("Error playing recommendation audio:", error);
    }
  };

  const handleSummaryAudioEnded = () => {
    setIsPlayingSummaryAudio(false);
  };

  const handleRecommendationAudioEnded = () => {
    setIsPlayingRecommendationAudio(false);
  };

  return (
    <div className="space-y-8">
      {/* Two-Column Layout (keeps play buttons in place) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary Column */}
        <div className="space-y-6">
          {/* Summary Note Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex-1">
                <CardTitle>{summaryTitle}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {summaryDescription}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlaySummaryAudio}
                className="flex items-center gap-2 ml-4 flex-shrink-0"
              >
                {isPlayingSummaryAudio ? (
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {summaryText}
                </p>
              </div>
              <audio
                ref={summaryAudioRef}
                src={summaryAudioUrl || ""}
                onEnded={handleSummaryAudioEnded}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Summary Metrics Table */}
          {summaryMetrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Key Metrics & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Index
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Metric
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Value
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Insight
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryMetrics.map((metric, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-600 font-medium text-sm">
                            {metric.index}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                            {metric.title}
                          </td>
                          <td className="py-3 px-4 text-gray-700 text-sm">
                            <span className="font-semibold">
                              {metric.value}
                              {metric.unit && ` ${metric.unit}`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {metric.insight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendation Column */}
        <div className="space-y-6">
          {/* Recommendation Note Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex-1">
                <CardTitle>{recommendationTitle}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {recommendationDescription}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayRecommendationAudio}
                className="flex items-center gap-2 ml-4 flex-shrink-0"
              >
                {isPlayingRecommendationAudio ? (
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
                ref={recommendationAudioRef}
                src={recommendationAudioUrl || ""}
                onEnded={handleRecommendationAudioEnded}
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
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.charAt(0).toUpperCase() +
                            item.priority.slice(1)}
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
                        <p className="font-medium text-gray-900 mb-1 text-sm">
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
      </div>

      {/* Combined Tabular View: Summary vs Recommendation */}
      {(summaryMetrics.length > 0 ||
        actionItems.length > 0 ||
        nextSteps.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary vs Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {(() => {
                const summaryMap = new Map(
                  summaryMetrics.map((m) => [m.index, m]),
                );
                const actionMap = new Map(actionItems.map((a) => [a.index, a]));
                const nextMap = new Map(nextSteps.map((n) => [n.index, n]));
                const allIndexes = Array.from(
                  new Set([
                    ...summaryMetrics.map((m) => m.index),
                    ...actionItems.map((a) => a.index),
                    ...nextSteps.map((n) => n.index),
                  ]),
                ).sort((a, b) => a - b);

                return (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/60">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Index
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Summary (Observation)
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Recommendation
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Action
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Timeline
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Owner
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Due
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allIndexes.map((idx) => {
                        const m = summaryMap.get(idx);
                        const a = actionMap.get(idx);
                        const n = nextMap.get(idx);
                        return (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 align-top hover:bg-gray-50/60"
                          >
                            <td className="py-3 px-4 text-gray-600 font-medium text-sm w-14">
                              {idx}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {m ? (
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {m.title}
                                    {m.value !== undefined && (
                                      <span className="ml-1 text-gray-600 font-normal">
                                        ({String(m.value)}
                                        {m.unit ? ` ${m.unit}` : ""})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                    {m.insight}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {a ? (
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {a.title}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                    {a.description}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {a ? (
                                a.title
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {a ? (
                                <span
                                  className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(a.priority)}`}
                                >
                                  {a.priority.charAt(0).toUpperCase() +
                                    a.priority.slice(1)}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {a?.timeline ?? (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {n?.owner ?? (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm">
                              {n?.dueDate ?? (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
