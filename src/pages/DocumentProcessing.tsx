import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import {
  getDocumentInsights,
  listAllDocumentEvents,
  listDocuments,
  reprocessDocumentRecord,
  type DocumentInsightRecord,
  type DocumentProcessingEvent,
  type DocumentRecord,
} from "@/lib/api/document-upload-service";
import { Activity, ArrowLeft, CheckCircle, Clock, File, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
};

const STATUS_STYLES: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-800",
  Processed: "bg-emerald-100 text-emerald-800",
  Failed: "bg-red-100 text-red-800",
};

const DocumentProcessing: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [events, setEvents] = useState<DocumentProcessingEvent[]>([]);
  const [insightsByDoc, setInsightsByDoc] = useState<Record<number, DocumentInsightRecord>>({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const [docs, eventRows] = await Promise.all([listDocuments(), listAllDocumentEvents()]);
      setDocuments(docs);
      setEvents(eventRows);

      const insightResults = await Promise.all(
        docs
          .filter((doc) => doc.status === "Processed")
          .map(async (doc) => {
          try {
            const insight = await getDocumentInsights(doc.id);
            return [doc.id, insight] as const;
          } catch {
            return null;
          }
        }),
      );
      const nextInsights: Record<number, DocumentInsightRecord> = {};
      insightResults.forEach((item) => {
        if (item) {
          nextInsights[item[0]] = item[1];
        }
      });
      setInsightsByDoc(nextInsights);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to refresh document pipeline data.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async (id: number) => {
    try {
      await reprocessDocumentRecord(id);
      toast.success("Document reprocessed");
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reprocess document.";
      toast.error(message);
    }
  };

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => {
    const processing = documents.filter((doc) => doc.status === "Processing").length;
    const processed = documents.filter((doc) => doc.status === "Processed").length;
    const failed = documents.filter((doc) => doc.status === "Failed").length;
    return {
      total: documents.length,
      processing,
      processed,
      failed,
    };
  }, [documents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Activity className="h-6 w-6" />}
        title="Document Processing Pipeline"
        description="Live processing status and event timeline from backend"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/document-upload">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload Center
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
            <Clock className="h-4 w-4 mr-2" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-semibold">{metrics.total}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Processing</div><div className="text-2xl font-semibold">{metrics.processing}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Processed</div><div className="text-2xl font-semibold">{metrics.processed}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Failed</div><div className="text-2xl font-semibold">{metrics.failed}</div></CardContent></Card>
        </div>

        <Tabs defaultValue="documents">
          <TabsList className="grid grid-cols-2 w-full max-w-sm">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-3 mt-4">
            {documents.length === 0 ? (
              <Card><CardContent className="py-14 text-center text-muted-foreground">No uploaded documents found.</CardContent></Card>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{doc.file_type}</Badge>
                        <Badge className={STATUS_STYLES[doc.status || "Processing"]}>{doc.status || "Processing"}</Badge>
                        {doc.category && <Badge variant="outline" className="text-xs">{doc.category}</Badge>}
                        {doc.status === "Processed" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                        {doc.status === "Failed" && <XCircle className="h-4 w-4 text-red-600" />}
                        {doc.status === "Processing" && <Clock className="h-4 w-4 text-amber-600" />}
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => void handleReprocess(doc.id)}>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reprocess
                        </Button>
                      </div>
                    </div>

                    {insightsByDoc[doc.id] && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        <div className="text-xs font-semibold">Summary</div>
                        <p className="text-xs text-muted-foreground">{insightsByDoc[doc.id].summary}</p>

                        <div className="text-xs font-semibold">Key Points</div>
                        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                          {insightsByDoc[doc.id].key_points.slice(0, 5).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>

                        <div className="text-xs font-semibold">Keywords</div>
                        <div className="flex flex-wrap gap-1">
                          {insightsByDoc[doc.id].keywords.slice(0, 12).map((kw) => (
                            <Badge key={kw} variant="outline" className="text-[10px]">{kw}</Badge>
                          ))}
                        </div>

                        <div className="text-xs font-semibold">Entities</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div><strong>People:</strong> {(insightsByDoc[doc.id].entities.people || []).slice(0, 5).join(", ") || "-"}</div>
                          <div><strong>Dates:</strong> {(insightsByDoc[doc.id].entities.dates || []).slice(0, 5).join(", ") || "-"}</div>
                          <div><strong>Places:</strong> {(insightsByDoc[doc.id].entities.places || []).slice(0, 5).join(", ") || "-"}</div>
                          <div><strong>Organizations:</strong> {(insightsByDoc[doc.id].entities.organizations || []).slice(0, 5).join(", ") || "-"}</div>
                        </div>
                      </div>
                    )}
                    {!insightsByDoc[doc.id] && doc.status === "Processing" && (
                      <div className="mt-3 text-xs text-muted-foreground">Insights are being generated...</div>
                    )}
                    {!insightsByDoc[doc.id] && doc.status === "Failed" && (
                      <div className="mt-3 text-xs text-red-600">Insight generation failed for this document.</div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-3 mt-4">
            {events.length === 0 ? (
              <Card><CardContent className="py-14 text-center text-muted-foreground">No pipeline events yet.</CardContent></Card>
            ) : (
              events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{event.document_title}</div>
                      <div className="text-xs mt-1">{event.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(event.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{event.stage}</Badge>
                      <Badge className={LEVEL_STYLES[event.level]}>{event.level}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <File className="h-4 w-4" />
              Integration Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Data source: <code>/api/business/documents/</code> and <code>/api/business/documents/events/</code></p>
            <p>Statuses: <code>Processing</code>, <code>Processed</code>, <code>Failed</code> are stored server-side in document metadata.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DocumentProcessing;
