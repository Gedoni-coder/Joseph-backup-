import React, { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import { cn } from "@/lib/utils";
import {
  Upload,
  File,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
  Activity,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Clock,
  User,
  Shield,
  Layers,
  X,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Archive,
  Mail,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: "queued" | "uploading" | "complete" | "error";
  error?: string;
}

interface ProcessedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  status: "Processed" | "Processing" | "Failed";
  category: string;
  tags: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "file";
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  doc: <FileText className="h-5 w-5 text-blue-500" />,
  docx: <FileText className="h-5 w-5 text-blue-500" />,
  xls: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
  xlsx: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
  csv: <FileSpreadsheet className="h-5 w-5 text-emerald-500" />,
  ppt: <Presentation className="h-5 w-5 text-orange-500" />,
  pptx: <Presentation className="h-5 w-5 text-orange-500" />,
  json: <FileCode className="h-5 w-5 text-yellow-500" />,
  xml: <FileCode className="h-5 w-5 text-purple-500" />,
  html: <FileCode className="h-5 w-5 text-rose-500" />,
  png: <Image className="h-5 w-5 text-teal-500" />,
  jpg: <Image className="h-5 w-5 text-teal-500" />,
  jpeg: <Image className="h-5 w-5 text-teal-500" />,
  zip: <Archive className="h-5 w-5 text-gray-500" />,
  eml: <Mail className="h-5 w-5 text-indigo-500" />,
  txt: <FileText className="h-5 w-5 text-gray-500" />,
};

const STATIC_FILES: ProcessedFile[] = [
  {
    id: 1,
    name: "Financial_Report_Q4_2023.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-20",
    uploadedBy: "John Smith",
    status: "Processed",
    category: "Financial",
    tags: ["quarterly", "compliance", "financial"],
  },
  {
    id: 2,
    name: "Supplier_Contract_ABC_Corp.docx",
    type: "docx",
    size: "856 KB",
    uploadDate: "2024-01-19",
    uploadedBy: "Sarah Johnson",
    status: "Processing",
    category: "Legal",
    tags: ["contract", "supplier", "legal"],
  },
  {
    id: 3,
    name: "Audit_Checklist_2024.xlsx",
    type: "xlsx",
    size: "1.2 MB",
    uploadDate: "2024-01-18",
    uploadedBy: "Michael Brown",
    status: "Processed",
    category: "Audit",
    tags: ["audit", "checklist", "compliance"],
  },
  {
    id: 4,
    name: "Market_Analysis_Q1_2024.pptx",
    type: "pptx",
    size: "3.7 MB",
    uploadDate: "2024-01-17",
    uploadedBy: "Emily Davis",
    status: "Processed",
    category: "Strategy",
    tags: ["market", "analysis", "quarterly"],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Financial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Legal: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Audit: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Operational: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Strategy: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Tax: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

const STATUS_STYLES: Record<string, string> = {
  Processed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Processing: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DocumentUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>(STATIC_FILES);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalProcessed = processedFiles.filter((f) => f.status === "Processed").length;
  const totalProcessing = processedFiles.filter((f) => f.status === "Processing").length;

  const metrics = [
    {
      label: "Total Files",
      value: processedFiles.length,
      icon: <File className="h-5 w-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Processed",
      value: totalProcessed,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Processing",
      value: totalProcessing + uploadQueue.filter((f) => f.status === "uploading").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "In Queue",
      value: uploadQueue.filter((f) => f.status === "queued").length,
      icon: <Activity className="h-5 w-5" />,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  // ── Upload simulation ──────────────────────────────────────────────────────

  const simulateUpload = useCallback(async (queueItem: UploadFile) => {
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 100));
      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === queueItem.id
            ? { ...f, status: "uploading", progress: Math.round((i / steps) * 100) }
            : f,
        ),
      );
    }
    setUploadQueue((prev) =>
      prev.map((f) => (f.id === queueItem.id ? { ...f, status: "complete", progress: 100 } : f)),
    );

    // Add to processed list
    const ext = getFileExt(queueItem.name);
    const newDoc: ProcessedFile = {
      id: Date.now(),
      name: queueItem.name,
      type: ext,
      size: queueItem.size,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: "You",
      status: "Processing",
      category: "General",
      tags: [ext, "new"],
    };
    setProcessedFiles((prev) => [newDoc, ...prev]);

    // Simulate processing completion
    setTimeout(() => {
      setProcessedFiles((prev) =>
        prev.map((f) => (f.id === newDoc.id ? { ...f, status: "Processed" } : f)),
      );
    }, 3000);
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const newItems: UploadFile[] = files.map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        name: file.name,
        size: formatBytes(file.size),
        type: getFileExt(file.name),
        progress: 0,
        status: "queued" as const,
      }));

      setUploadQueue((prev) => [...newItems, ...prev]);

      for (const item of newItems) {
        await simulateUpload(item);
      }
    },
    [simulateUpload],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) handleFiles(files);
    },
    [handleFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) handleFiles(files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFiles],
  );

  const removeFromQueue = (id: string) => {
    setUploadQueue((prev) => prev.filter((f) => f.id !== id));
  };

  const removeProcessed = (id: number) => {
    setProcessedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Upload className="h-6 w-6" />}
        title="Document Upload Center"
        description="Upload documents of any type — automatically processed through the full pipeline"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", m.bg)}>
                    <div className={m.color}>{m.icon}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                    <div className="text-xl font-bold">{m.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upload">
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="recent">
              Recent
              {processedFiles.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                  {processedFiles.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="queue">
              Queue
              {uploadQueue.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                  {uploadQueue.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Upload Tab ── */}
          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drop Zone */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer group",
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-primary/3 bg-muted/10",
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    accept="*/*"
                  />
                  <div className={cn("flex flex-col items-center gap-4 transition-all", dragActive && "scale-105")}>
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                        dragActive
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-primary/10 text-primary group-hover:bg-primary/20",
                      )}
                    >
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {dragActive ? "Release to upload" : "Drag & drop any document"}
                      </h3>
                      <p className="text-sm text-muted-foreground">Or click to browse your files</p>
                    </div>
                    <Button variant="default" size="sm" className="pointer-events-none">
                      <File className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      All file types accepted • Max 100 MB per file • Auto-processed through pipeline
                    </p>
                  </div>
                </div>

                {/* Category shortcuts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Financial", icon: <FileText className="h-5 w-5 text-blue-600" />, bg: "bg-blue-50 dark:bg-blue-950/30", desc: "Reports, statements, budgets" },
                    { label: "Legal", icon: <FileText className="h-5 w-5 text-purple-600" />, bg: "bg-purple-50 dark:bg-purple-950/30", desc: "Contracts, agreements, policies" },
                    { label: "Audit", icon: <Shield className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50 dark:bg-emerald-950/30", desc: "Checklists, reports, evidence" },
                    { label: "Operations", icon: <Layers className="h-5 w-5 text-orange-600" />, bg: "bg-orange-50 dark:bg-orange-950/30", desc: "Procedures, forms, manuals" },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => inputRef.current?.click()}
                      className={cn(
                        "p-4 rounded-xl border border-border/50 text-center transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                        cat.bg,
                      )}
                    >
                      <div className="mx-auto mb-2 w-fit">{cat.icon}</div>
                      <div className="font-semibold text-sm">{cat.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline CTA */}
            <Card className="border-primary/20 bg-primary/3">
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Need full pipeline insights?</h4>
                  <p className="text-xs text-muted-foreground">
                    View real-time extraction, NER entities, and triggered actions
                  </p>
                </div>
                <Link to="/document-processing">
                  <Button size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Open Processing Pipeline
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Recent Tab ── */}
          <TabsContent value="recent" className="space-y-4 mt-6">
            {processedFiles.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                  <p className="text-muted-foreground">Upload documents to see them here</p>
                </CardContent>
              </Card>
            ) : (
              processedFiles.map((file) => (
                <Card key={file.id} className="transition-all hover:shadow-md border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {FILE_ICONS[file.type] || <File className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold text-sm truncate">{file.name}</h3>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Badge className={cn("text-xs", STATUS_STYLES[file.status])}>
                              {file.status}
                            </Badge>
                            <Badge className={cn("text-xs", CATEGORY_COLORS[file.category] || "bg-gray-100 text-gray-700")}>
                              {file.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {file.uploadDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.uploadedBy}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {file.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => removeProcessed(file.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ── Queue Tab ── */}
          <TabsContent value="queue" className="space-y-4 mt-6">
            {uploadQueue.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Queue is empty</h3>
                  <p className="text-muted-foreground mb-4">Files appear here while uploading</p>
                  <Button onClick={() => inputRef.current?.click()} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {uploadQueue.map((item) => (
                  <Card key={item.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {FILE_ICONS[item.type] || <File className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{item.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">{item.size}</span>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  item.status === "complete" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                                  item.status === "uploading" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse",
                                  item.status === "queued" && "bg-muted text-muted-foreground",
                                  item.status === "error" && "bg-red-100 text-red-800",
                                )}
                              >
                                {item.status === "uploading" ? `${item.progress}%` : item.status}
                              </Badge>
                              {item.status !== "uploading" && (
                                <button
                                  onClick={() => removeFromQueue(item.id)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          {item.status === "uploading" && (
                            <Progress value={item.progress} className="h-1.5" />
                          )}
                          {item.status === "complete" && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle className="h-3 w-3" />
                              Upload complete — pipeline processing…
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Link to="/document-processing">
                <Button variant="outline" size="sm">
                  <Activity className="h-3.5 w-3.5 mr-1.5" />
                  Processing Pipeline
                </Button>
              </Link>
              <Link to="/document-manager">
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                  Manage Documents
                </Button>
              </Link>
              <Link to="/compliance-reports">
                <Button variant="outline" size="sm">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Compliance Reports
                </Button>
              </Link>
              <Link to="/audit-reports">
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Audit Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DocumentUpload;
