import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Download,
} from "lucide-react";
import { type RevenueStream } from "@/lib/revenue-data";
import { AddRevenueStreamDialog } from "./add-revenue-stream-dialog";
import { OptimizeStreamDialog } from "./optimize-stream-dialog";
import { generateRevenueStreamPDF } from "@/lib/revenue-stream-pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface RevenueStreamsProps {
  streams: RevenueStream[];
  onAddStream?: (stream: RevenueStream) => void;
}

const typeColors = {
  subscription: "bg-blue-100 text-blue-800",
  "one-time": "bg-green-100 text-green-800",
  "usage-based": "bg-purple-100 text-purple-800",
  commission: "bg-orange-100 text-orange-800",
  advertising: "bg-red-100 text-red-800",
};

export function RevenueStreams({ streams, onAddStream }: RevenueStreamsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  const [selectedStreamForOptimization, setSelectedStreamForOptimization] =
    useState<RevenueStream | null>(null);
  const [loadingStreamId, setLoadingStreamId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const handleAddStream = (stream: RevenueStream) => {
    if (onAddStream) {
      onAddStream(stream);
    }
  };

  const handleViewDetails = async (stream: RevenueStream) => {
    try {
      setLoadingStreamId(stream.id);
      await generateRevenueStreamPDF(stream, streams);
      toast({
        title: "Success",
        description: `PDF whitepaper for ${stream.name} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
      console.error("PDF generation error:", error);
    } finally {
      setLoadingStreamId(null);
    }
  };

  const handleOptimize = (stream: RevenueStream) => {
    setSelectedStreamForOptimization(stream);
    setOptimizeDialogOpen(true);
  };

  const handleImplementOptimizations = (updatedStream: RevenueStream) => {
    setStreams(
      streams.map((s) =>
        s.id === updatedStream.id ? updatedStream : s
      )
    );
  };

  const totalCurrentRevenue = streams.reduce(
    (acc, stream) => acc + stream.currentRevenue,
    0,
  );
  const totalForecastRevenue = streams.reduce(
    (acc, stream) => acc + stream.forecastRevenue,
    0,
  );
  const overallGrowth =
    ((totalForecastRevenue - totalCurrentRevenue) / totalCurrentRevenue) * 100;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Revenue Streams</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Track and analyze revenue performance across all channels
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setDialogOpen(true)}
          size="sm"
        >
          <Target className="w-4 h-4 mr-2" />
          Add Stream
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-blue-700">
                  Total Current Revenue
                </div>
                <div className="text-lg sm:text-xl font-bold text-blue-900 truncate">
                  {formatCurrency(totalCurrentRevenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-green-700">Forecast Revenue</div>
                <div className="text-lg sm:text-xl font-bold text-green-900 truncate">
                  {formatCurrency(totalForecastRevenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-purple-700">Expected Growth</div>
                <div className="text-lg sm:text-xl font-bold text-purple-900 truncate">
                  {overallGrowth.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-orange-700">Total Customers</div>
                <div className="text-lg sm:text-xl font-bold text-orange-900 truncate">
                  {streams
                    .reduce((acc, s) => acc + s.customers, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {streams.map((stream) => (
          <Card key={stream.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">{stream.name}</CardTitle>
                <Badge className={typeColors[stream.type]}>
                  {stream.type.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-gray-600">Current Revenue</div>
                  <div className="text-xl sm:text-2xl font-bold truncate">
                    {formatCurrency(stream.currentRevenue)}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs sm:text-sm text-gray-600">Forecast</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg sm:text-xl font-bold text-blue-600 truncate">
                      {formatCurrency(stream.forecastRevenue)}
                    </div>
                    {stream.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Growth Target</span>
                  <span className="font-medium">{stream.growth}%</span>
                </div>
                <Progress
                  value={Math.min(100, stream.growth)}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Customers</div>
                  <div className="text-sm sm:text-base font-semibold truncate">
                    {stream.customers.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">ARPC</div>
                  <div className="text-sm sm:text-base font-semibold truncate">
                    ${stream.avgRevenuePerCustomer.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Margin</div>
                  <div className="text-sm sm:text-base font-semibold">{stream.margin}%</div>
                </div>
              </div>

              <div className="flex gap-1 sm:gap-2 pt-2 sm:pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => handleViewDetails(stream)}
                  disabled={loadingStreamId === stream.id}
                >
                  {loadingStreamId === stream.id ? (
                    <>
                      <div className="w-3 h-3 mr-1 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Wait...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                  onClick={() => handleOptimize(stream)}
                >
                  <span className="hidden sm:inline">Optimize</span>
                  <span className="sm:hidden">Opt.</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddRevenueStreamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddStream}
      />

      <OptimizeStreamDialog
        open={optimizeDialogOpen}
        onOpenChange={setOptimizeDialogOpen}
        stream={selectedStreamForOptimization}
        allStreams={streams}
        onImplement={handleImplementOptimizations}
      />
    </div>
  );
}
