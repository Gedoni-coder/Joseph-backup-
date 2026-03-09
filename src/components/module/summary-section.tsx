import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface SummaryItem {
  index: number;
  title: string;
  value: string | number;
  unit?: string;
  insight: string;
}

interface SummarySectionProps {
  title?: string;
  description?: string;
  summaryText: string;
  metrics: SummaryItem[];
  onGenerateAudio?: () => Promise<string>;
}

export function SummarySection({
  title = "Summary",
  description = "Key metrics and insights from this module",
  summaryText,
  metrics,
  onGenerateAudio,
}: SummarySectionProps) {
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
      {/* Summary Note Card */}
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {summaryText}
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

      {/* Metrics Table */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Index
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Metric
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Value
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Insight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {metric.index}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {metric.title}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="font-semibold">
                          {metric.value}
                          {metric.unit && ` ${metric.unit}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
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
  );
}
