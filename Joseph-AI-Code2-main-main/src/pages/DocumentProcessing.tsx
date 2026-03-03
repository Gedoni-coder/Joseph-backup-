import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModuleHeader from "@/components/ui/module-header";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  Image,
  File,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Database,
  Zap,
  Search,
  Shield,
  BarChart3,
  Tag,
  FolderOpen,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Globe,
  Hash,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Link2,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Archive,
  Brain,
  Layers,
  Cpu,
  Send,
  X,
  Info,
  TrendingUp,
  Star,
  List,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PipelineStage =
  | "idle"
  | "INGEST"
  | "EXTRACT"
  | "NORMALIZE"
  | "METADATA"
  | "STORAGE"
  | "TRIGGER"
  | "COMPLETE"
  | "ERROR";

interface StageInfo {
  id: PipelineStage;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface ProcessedDoc {
  id: string;
  filename: string;
  fileType: string;
  fileSize: string;
  mimeType: string;
  sha256: string;
  uploadedAt: string;
  status: "processing" | "complete" | "error";
  currentStage: PipelineStage;
  stageProgress: number;
  stageTimings: Record<string, number>;
  extractedText: string;
  pageCount: number;
  wordCount: number;
  language: string;
  tables: string[][];
  entities: Array<{ text: string; type: string; normalized: string }>;
  dates: string[];
  monetaryValues: Array<{ amount: number; currency: string; formatted: string }>;
  phones: string[];
  emails: string[];
  urls: string[];
  keyValuePairs: Record<string, string>;
  keywords: string[];
  topics: string[];
  documentType: string;
  category: string;
  subcategory: string;
  classificationConfidence: number;
  summary: string;
  processingFlags: string[];
  chunkCount: number;
  storageBackend: string;
  triggers: Array<{ name: string; status: string; detail: string }>;
  errors: string[];
  warnings: string[];
  overallConfidence: number;
}

interface LogEntry {
  timestamp: string;
  stage: PipelineStage | string;
  level: "info" | "warn" | "error" | "success";
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES: StageInfo[] = [
  {
    id: "INGEST",
    label: "Ingest",
    description: "Validate, scan, fingerprint",
    icon: <Shield className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "EXTRACT",
    label: "Extract",
    description: "Parse content, OCR, tables",
    icon: <Cpu className="h-4 w-4" />,
    color: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  {
    id: "NORMALIZE",
    label: "Normalize",
    description: "Clean, entities, structure",
    icon: <Layers className="h-4 w-4" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "METADATA",
    label: "Metadata",
    description: "Classify, tag, score",
    icon: <Tag className="h-4 w-4" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "STORAGE",
    label: "Storage",
    description: "Embed, index, store",
    icon: <Database className="h-4 w-4" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  {
    id: "TRIGGER",
    label: "Trigger",
    description: "Push APIs, send alerts",
    icon: <Zap className="h-4 w-4" />,
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
];

const STAGE_ORDER: PipelineStage[] = ["INGEST", "EXTRACT", "NORMALIZE", "METADATA", "STORAGE", "TRIGGER", "COMPLETE"];

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
  "text/html",
  "application/xml",
  "text/xml",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "application/zip",
  "message/rfc822",
  "application/vnd.oasis.opendocument.text",
];

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
  md: <FileText className="h-5 w-5 text-gray-600" />,
};

const ENTITY_COLORS: Record<string, string> = {
  ORG: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  ORGANIZATION: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PERSON: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  DATE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  MONEY: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  GPE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  EMAIL: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  PHONE: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  URL: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  PRODUCT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

// ─── Simulation helpers ───────────────────────────────────────────────────────

function getFileExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "file";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function fakeSha256(): string {
  const chars = "0123456789abcdef";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

function generateFakeDoc(file: File): Omit<ProcessedDoc, "status" | "currentStage" | "stageProgress"> {
  const ext = getFileExt(file.name);
  const types: Record<string, { docType: string; category: string; sub: string }> = {
    pdf: { docType: "financial_report", category: "financial", sub: "reporting" },
    docx: { docType: "contract", category: "legal", sub: "agreement" },
    doc: { docType: "contract", category: "legal", sub: "agreement" },
    xlsx: { docType: "financial_report", category: "financial", sub: "reporting" },
    xls: { docType: "financial_report", category: "financial", sub: "reporting" },
    csv: { docType: "supply_chain", category: "operations", sub: "supply_chain" },
    pptx: { docType: "business_plan", category: "strategy", sub: "planning" },
    json: { docType: "general", category: "data", sub: "interchange" },
    xml: { docType: "general", category: "data", sub: "interchange" },
    png: { docType: "general", category: "image", sub: "visual" },
    jpg: { docType: "general", category: "image", sub: "visual" },
    jpeg: { docType: "general", category: "image", sub: "visual" },
    html: { docType: "general", category: "web", sub: "html" },
    txt: { docType: "general", category: "text", sub: "plain" },
    md: { docType: "general", category: "text", sub: "markdown" },
    eml: { docType: "meeting_notes", category: "communications", sub: "email" },
    zip: { docType: "general", category: "archive", sub: "compressed" },
  };
  const docMeta = types[ext] || { docType: "general", category: "general", sub: "miscellaneous" };

  return {
    id: Math.random().toString(36).slice(2),
    filename: file.name,
    fileType: ext,
    fileSize: formatBytes(file.size),
    mimeType: file.type || "application/octet-stream",
    sha256: fakeSha256(),
    uploadedAt: new Date().toISOString(),
    stageTimings: {},
    extractedText: `[Extracted text from ${file.name}]\n\nThis document has been processed through the extraction pipeline. All text content, tables, and structured data have been successfully parsed and indexed for retrieval.`,
    pageCount: Math.floor(Math.random() * 30) + 1,
    wordCount: Math.floor(Math.random() * 8000) + 200,
    language: "en",
    tables: [
      ["Column A", "Column B", "Column C"],
      ["Row 1 A", "Row 1 B", "Row 1 C"],
      ["Row 2 A", "Row 2 B", "Row 2 C"],
    ],
    entities: [
      { text: "Acme Corporation", type: "ORG", normalized: "Acme Corporation" },
      { text: "John Smith", type: "PERSON", normalized: "John Smith" },
      { text: "Q4 2024", type: "DATE", normalized: "2024-10-01" },
      { text: "$125,000.00", type: "MONEY", normalized: "USD 125000.00" },
      { text: "New York, NY", type: "GPE", normalized: "New York, NY, USA" },
    ],
    dates: ["2024-01-15", "2024-03-31", "2024-12-31"],
    monetaryValues: [
      { amount: 125000, currency: "USD", formatted: "USD 125,000.00" },
      { amount: 48500, currency: "USD", formatted: "USD 48,500.00" },
    ],
    phones: ["+12125550100", "+18005551234"],
    emails: ["contact@acme.com", "billing@acme.com"],
    urls: ["https://www.acme.com", "https://portal.acme.com/invoice"],
    keyValuePairs: {
      "Invoice Number": "INV-2024-0047",
      "Vendor": "Acme Corporation",
      "Amount Due": "$125,000.00",
      "Due Date": "January 31, 2024",
      "Payment Terms": "Net 30",
      "Tax Id": "12-3456789",
    },
    keywords: ["revenue", "quarterly", "financial", "acme", "invoice", "payment", "contract", "agreement"],
    topics: ["financial reporting", "quarterly results", "payment terms", "vendor agreement"],
    documentType: docMeta.docType,
    category: docMeta.category,
    subcategory: docMeta.sub,
    classificationConfidence: Math.random() * 0.3 + 0.7,
    summary: `${docMeta.docType.replace(/_/g, " ")} document from Acme Corporation dated Q4 2024. Contains financial data totaling USD 125,000.00 with payment due January 31, 2024. Key parties: John Smith (Acme Corporation).`,
    processingFlags: file.size < 1000 ? ["low_word_count"] : [],
    chunkCount: Math.floor(Math.random() * 20) + 3,
    storageBackend: "vector-db-stub",
    triggers: [
      { name: "update_financial_forecast", status: "success", detail: "Forecast recalculated" },
      { name: "notify_relevant_module", status: "success", detail: "Alert dispatched" },
      { name: "knowledge_base_index", status: "success", detail: "Indexed 8 chunks" },
    ],
    errors: [],
    warnings: file.size > 50 * 1024 * 1024 ? ["Large file; OCR quality may vary"] : [],
    overallConfidence: Math.random() * 0.2 + 0.78,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PipelineVisualizer({
  currentStage,
  stageTimings,
  progress,
}: {
  currentStage: PipelineStage;
  stageTimings: Record<string, number>;
  progress: number;
}) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {STAGES.map((stage, idx) => {
          const stageIdx = STAGE_ORDER.indexOf(stage.id);
          const isDone = currentStage === "COMPLETE" || stageIdx < currentIdx;
          const isActive = stageIdx === currentIdx - 1 && currentStage !== "COMPLETE";
          const isPending = !isDone && !isActive;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-500",
                  isDone && "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-400",
                  isActive && cn(stage.bgColor, stage.borderColor, stage.color, "animate-pulse shadow-sm"),
                  isPending && "bg-muted/40 border-border text-muted-foreground",
                )}
              >
                {isDone ? (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                ) : isActive ? (
                  <div className="h-3.5 w-3.5 animate-spin">{stage.icon}</div>
                ) : (
                  <div className="h-3.5 w-3.5 text-muted-foreground">{stage.icon}</div>
                )}
                {stage.label}
                {stageTimings[stage.id] && (
                  <span className="opacity-60 text-[10px]">
                    {stageTimings[stage.id].toFixed(0)}ms
                  </span>
                )}
              </div>
              {idx < STAGES.length - 1 && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                    isDone ? "text-emerald-400" : "text-muted-foreground/30",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {currentStage !== "idle" && currentStage !== "COMPLETE" && currentStage !== "ERROR" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {STAGES.find((s) => s.id === STAGE_ORDER[currentIdx - 1])?.description || "Processing…"}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
    </div>
  );
}

function UploadZone({
  onFiles,
  isProcessing,
}: {
  onFiles: (files: File[]) => void;
  isProcessing: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (files.length > 0) onFiles(files);
    },
    [onFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) onFiles(files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFiles],
  );

  const supportedTypes = [
    { label: "Documents", exts: "PDF, DOC, DOCX, ODT, RTF, TXT, MD" },
    { label: "Spreadsheets", exts: "XLS, XLSX, CSV, TSV, ODS" },
    { label: "Presentations", exts: "PPT, PPTX, ODP" },
    { label: "Data", exts: "JSON, XML, YAML, HTML" },
    { label: "Images", exts: "PNG, JPG, TIFF, BMP, WEBP (OCR)" },
    { label: "Archives", exts: "ZIP, TAR, GZ" },
    { label: "Email", exts: "EML, MSG" },
    { label: "Code", exts: "PY, JS, SQL, and more" },
  ];

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer group",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : isProcessing
              ? "border-muted bg-muted/20 cursor-not-allowed"
              : "border-border hover:border-primary/50 hover:bg-primary/3 bg-muted/10",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={!isProcessing ? handleDrop : undefined}
        onClick={() => !isProcessing && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
          accept="*/*"
        />

        <div
          className={cn(
            "flex flex-col items-center gap-4 transition-all duration-300",
            dragActive && "scale-105",
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
              dragActive
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-primary/10 text-primary group-hover:bg-primary/20",
            )}
          >
            <Upload className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {dragActive
                ? "Release to process"
                : isProcessing
                  ? "Processing documents…"
                  : "Drop any document here"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isProcessing
                ? "Please wait while your documents are being processed"
                : "Or click to browse — any file type accepted"}
            </p>
          </div>

          {!isProcessing && (
            <Button variant="default" size="sm" className="pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Supported types grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {supportedTypes.map((t) => (
          <div
            key={t.label}
            className="px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-center"
          >
            <div className="text-xs font-semibold text-foreground">{t.label}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{t.exts}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Max 100 MB per file • Automatic scanning & classification • Zero configuration needed
      </p>
    </div>
  );
}

function EntityBadge({ entity }: { entity: { text: string; type: string; normalized: string } }) {
  const colorClass = ENTITY_COLORS[entity.type] || "bg-gray-100 text-gray-700";
  return (
    <span
      title={`Normalized: ${entity.normalized}`}
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", colorClass)}
    >
      <span className="opacity-60 text-[10px] uppercase tracking-wider">{entity.type}</span>
      <span>{entity.text}</span>
    </span>
  );
}

function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-semibold",
            pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600",
          )}
        >
          {pct}%
        </span>
      </div>
      <Progress
        value={pct}
        className={cn(
          "h-1.5",
          pct >= 80 ? "[&>div]:bg-emerald-500" : pct >= 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500",
        )}
      />
    </div>
  );
}

function DocResultPanel({ doc }: { doc: ProcessedDoc }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-xl flex-shrink-0">
          {FILE_ICONS[doc.fileType] || <File className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-base truncate">{doc.filename}</h3>
            <Badge variant="outline" className="text-xs capitalize">
              {doc.documentType.replace(/_/g, " ")}
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                doc.status === "complete"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : doc.status === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800",
              )}
            >
              {doc.status === "complete" ? "Processed" : doc.status === "error" ? "Failed" : "Processing"}
            </Badge>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{doc.fileSize}</span>
            <span>•</span>
            <span>{doc.pageCount} page{doc.pageCount !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span>{doc.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span className="uppercase">{doc.language}</span>
            <span>•</span>
            <span>{doc.chunkCount} chunks indexed</span>
          </div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Button size="sm" variant="outline" title="Download">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Pipeline timing */}
      {Object.keys(doc.stageTimings).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(doc.stageTimings).map(([stage, ms]) => (
            <span
              key={stage}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground"
            >
              <span className="font-medium">{stage}</span>
              <span>{ms.toFixed(0)}ms</span>
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="entities" className="text-xs">Entities</TabsTrigger>
          <TabsTrigger value="extracted" className="text-xs">Extracted</TabsTrigger>
          <TabsTrigger value="metadata" className="text-xs">Metadata</TabsTrigger>
          <TabsTrigger value="triggers" className="text-xs">Triggers</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ConfidenceBar value={doc.classificationConfidence} label="Classification Confidence" />
                <ConfidenceBar value={doc.overallConfidence} label="Extraction Quality" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="px-2 py-1.5 bg-muted/50 rounded-md text-xs">
                    <div className="text-muted-foreground">Category</div>
                    <div className="font-medium capitalize">{doc.category}</div>
                  </div>
                  <div className="px-2 py-1.5 bg-muted/50 rounded-md text-xs">
                    <div className="text-muted-foreground">Subcategory</div>
                    <div className="font-medium capitalize">{doc.subcategory}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{doc.summary}</p>
                {doc.processingFlags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {doc.processingFlags.map((flag) => (
                      <Badge key={flag} variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                        <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Dates Found", value: doc.dates.length, icon: <Calendar className="h-4 w-4" />, color: "text-amber-600" },
              { label: "Money Values", value: doc.monetaryValues.length, icon: <DollarSign className="h-4 w-4" />, color: "text-emerald-600" },
              { label: "Entities", value: doc.entities.length, icon: <Tag className="h-4 w-4" />, color: "text-violet-600" },
              { label: "Key-Values", value: Object.keys(doc.keyValuePairs).length, icon: <List className="h-4 w-4" />, color: "text-blue-600" },
            ].map((m) => (
              <div key={m.label} className="px-4 py-3 bg-card rounded-lg border border-border text-center">
                <div className={cn("mx-auto mb-1 w-fit", m.color)}>{m.icon}</div>
                <div className="text-xl font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Keywords & Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {doc.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doc.topics.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs text-primary border-primary/30">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entities */}
        <TabsContent value="entities" className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Named Entities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {doc.entities.map((e, i) => (
                    <EntityBadge key={i} entity={e} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {doc.emails.map((email) => (
                  <div key={email} className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                ))}
                {doc.phones.map((ph) => (
                  <div key={ph} className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{ph}</span>
                  </div>
                ))}
                {doc.urls.map((url) => (
                  <div key={url} className="flex items-center gap-2 text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate text-primary">{url}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Dates & Monetary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Dates (ISO 8601)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {doc.dates.map((d) => (
                    <div key={d} className="px-2 py-1 bg-amber-50 dark:bg-amber-950/20 rounded text-sm font-mono text-amber-800 dark:text-amber-300">
                      {d}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Monetary Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {doc.monetaryValues.map((m, i) => (
                    <div key={i} className="flex justify-between px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded text-sm">
                      <span className="text-muted-foreground font-mono">{m.currency}</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                        {m.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Extracted */}
        <TabsContent value="extracted" className="space-y-4 mt-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Key-Value Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(doc.keyValuePairs).map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-1.5 border-b border-border/50 last:border-0 text-sm">
                    <span className="w-40 flex-shrink-0 font-medium text-muted-foreground">{k}</span>
                    <span className="flex-1 text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {doc.tables.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Extracted Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        {doc.tables[0].map((cell, i) => (
                          <th key={i} className="px-2 py-1.5 text-left border border-border font-semibold">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {doc.tables.slice(1).map((row, ri) => (
                        <tr key={ri} className="hover:bg-muted/20">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-2 py-1.5 border border-border/50">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Raw Text Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {doc.extractedText}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metadata */}
        <TabsContent value="metadata" className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">File Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  ["File ID", doc.id],
                  ["MIME Type", doc.mimeType],
                  ["SHA-256", doc.sha256.slice(0, 16) + "…"],
                  ["Uploaded", new Date(doc.uploadedAt).toLocaleString()],
                  ["Storage Backend", doc.storageBackend],
                  ["Chunks Indexed", String(doc.chunkCount)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono text-xs text-right">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Processing Flags</CardTitle>
              </CardHeader>
              <CardContent>
                {doc.processingFlags.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    No issues detected
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {doc.processingFlags.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-amber-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {doc.warnings.length > 0 && (
                  <ul className="space-y-1 mt-3">
                    {doc.warnings.map((w, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {w}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Triggers */}
        <TabsContent value="triggers" className="mt-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Triggered Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doc.triggers.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        t.status === "success" ? "bg-emerald-500" : "bg-red-500",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium font-mono">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.detail}</div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        t.status === "success"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-800",
                      )}
                    >
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DocumentProcessing: React.FC = () => {
  const [docs, setDocs] = useState<ProcessedDoc[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState("upload");
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((level: LogEntry["level"], stage: string, message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        stage,
        level,
        message,
      },
    ]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const simulatePipeline = useCallback(
    async (doc: ProcessedDoc) => {
      const stages: PipelineStage[] = ["INGEST", "EXTRACT", "NORMALIZE", "METADATA", "STORAGE", "TRIGGER"];
      const stageDurations = [400, 900, 700, 500, 600, 300];
      const stageTimings: Record<string, number> = {};

      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const duration = stageDurations[i] + Math.random() * 300;

        addLog("info", stage, `Starting ${stage.toLowerCase()} stage…`);

        // Animate progress within stage
        const steps = 8;
        for (let s = 0; s <= steps; s++) {
          await new Promise((r) => setTimeout(r, duration / steps));
          setDocs((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? { ...d, currentStage: stage, stageProgress: Math.round((s / steps) * 100) }
                : d,
            ),
          );
        }

        stageTimings[stage] = Math.round(duration);
        const stageMessages: Record<string, string> = {
          INGEST: `File validated (${doc.fileSize}) • SHA-256: ${doc.sha256.slice(0, 12)}… • Scan: clean`,
          EXTRACT: `Extracted ${doc.wordCount.toLocaleString()} words across ${doc.pageCount} page${doc.pageCount !== 1 ? "s" : ""} • ${doc.tables.length > 0 ? "Tables detected" : "No tables"}`,
          NORMALIZE: `Cleaned text • Found ${doc.entities.length} entities, ${doc.dates.length} dates, ${doc.monetaryValues.length} monetary values`,
          METADATA: `Classified as '${doc.documentType}' (${Math.round(doc.classificationConfidence * 100)}% confidence) • ${doc.keywords.length} keywords`,
          STORAGE: `Indexed ${doc.chunkCount} chunks → ${doc.storageBackend}`,
          TRIGGER: `Fired ${doc.triggers.length} downstream trigger${doc.triggers.length !== 1 ? "s" : ""}`,
        };

        addLog("success", stage, stageMessages[stage] || "Stage complete");

        setDocs((prev) =>
          prev.map((d) =>
            d.id === doc.id ? { ...d, stageTimings: { ...stageTimings } } : d,
          ),
        );
      }

      setDocs((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? { ...d, status: "complete", currentStage: "COMPLETE", stageProgress: 100, stageTimings }
            : d,
        ),
      );
      addLog("success", "COMPLETE", `Document '${doc.filename}' fully processed and indexed`);
    },
    [addLog],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      setIsProcessing(true);
      setActiveMainTab("pipeline");

      const newDocs: ProcessedDoc[] = files.map((file) => ({
        ...generateFakeDoc(file),
        status: "processing" as const,
        currentStage: "INGEST" as PipelineStage,
        stageProgress: 0,
      }));

      setDocs((prev) => [...newDocs, ...prev]);
      if (newDocs.length > 0) setSelectedDocId(newDocs[0].id);

      addLog("info", "PIPELINE", `Starting pipeline for ${files.length} document${files.length !== 1 ? "s" : ""}`);

      for (const doc of newDocs) {
        await simulatePipeline(doc);
      }

      setIsProcessing(false);
      setActiveMainTab("results");
    },
    [simulatePipeline, addLog],
  );

  const selectedDoc = docs.find((d) => d.id === selectedDocId);
  const completedDocs = docs.filter((d) => d.status === "complete");
  const processingDocs = docs.filter((d) => d.status === "processing");

  const stats = [
    { label: "Total Processed", value: completedDocs.length, icon: <CheckCircle className="h-5 w-5" />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Processing", value: processingDocs.length, icon: <Activity className="h-5 w-5" />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Words", value: completedDocs.reduce((s, d) => s + d.wordCount, 0).toLocaleString(), icon: <FileText className="h-5 w-5" />, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Chunks Indexed", value: completedDocs.reduce((s, d) => s + d.chunkCount, 0), icon: <Database className="h-5 w-5" />, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Layers className="h-6 w-6" />}
        title="Document Processing Pipeline"
        description="Upload any document — automatically ingested, extracted, normalized, classified and indexed"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Pipeline Ready"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", s.bg)}>
                    <div className={s.color}>{s.icon}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-lg font-bold">{s.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="upload">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="pipeline" disabled={docs.length === 0}>
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="results" disabled={completedDocs.length === 0}>
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Results
            </TabsTrigger>
            <TabsTrigger value="log">
              <List className="h-3.5 w-3.5 mr-1.5" />
              Log
              {logs.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                  {logs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Upload ── */}
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadZone onFiles={handleFiles} isProcessing={isProcessing} />
              </CardContent>
            </Card>

            {/* Pipeline overview cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    stage.bgColor,
                    stage.borderColor,
                  )}
                >
                  <div className={cn("flex items-center gap-2 mb-2", stage.color)}>
                    {stage.icon}
                    <span className="font-semibold text-sm">{stage.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── Pipeline ── */}
          <TabsContent value="pipeline" className="mt-6 space-y-4">
            {docs.map((doc) => (
              <Card
                key={doc.id}
                className={cn(
                  "border transition-all cursor-pointer",
                  selectedDocId === doc.id ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md",
                )}
                onClick={() => setSelectedDocId(doc.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {FILE_ICONS[doc.fileType] || <File className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{doc.filename}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{doc.fileSize}</span>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs flex-shrink-0",
                        doc.status === "complete"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : doc.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse",
                      )}
                    >
                      {doc.status === "complete"
                        ? "Complete"
                        : doc.status === "error"
                          ? "Error"
                          : doc.currentStage}
                    </Badge>
                  </div>

                  <PipelineVisualizer
                    currentStage={doc.currentStage}
                    stageTimings={doc.stageTimings}
                    progress={doc.stageProgress}
                  />
                </CardContent>
              </Card>
            ))}

            {docs.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents in pipeline</h3>
                  <p className="text-muted-foreground mb-4">Upload a document to see the pipeline in action</p>
                  <Button onClick={() => setActiveMainTab("upload")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Results ── */}
          <TabsContent value="results" className="mt-6">
            {completedDocs.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results yet</h3>
                  <p className="text-muted-foreground">Processed documents will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Document list */}
                <div className="xl:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Processed ({completedDocs.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        {completedDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm",
                              selectedDocId === doc.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted/60",
                            )}
                          >
                            <div className="flex-shrink-0 w-5">
                              {FILE_ICONS[doc.fileType] || <File className="h-4 w-4" />}
                            </div>
                            <span className="truncate flex-1 text-xs">{doc.filename}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detail panel */}
                <div className="xl:col-span-3">
                  {selectedDoc && selectedDoc.status === "complete" ? (
                    <DocResultPanel doc={selectedDoc} />
                  ) : (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a document to view results</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Log ── */}
          <TabsContent value="log" className="mt-6">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Processing Log
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLogs([])}
                  disabled={logs.length === 0}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[480px] font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      Log entries will appear here during processing
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {logs.map((log, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex gap-3 px-2 py-1 rounded",
                            log.level === "error" && "bg-red-50 dark:bg-red-950/20",
                            log.level === "warn" && "bg-amber-50 dark:bg-amber-950/20",
                            log.level === "success" && "bg-emerald-50 dark:bg-emerald-950/20",
                          )}
                        >
                          <span className="text-muted-foreground flex-shrink-0 w-16">{log.timestamp}</span>
                          <span
                            className={cn(
                              "flex-shrink-0 w-14 font-semibold",
                              log.level === "error" && "text-red-600",
                              log.level === "warn" && "text-amber-600",
                              log.level === "success" && "text-emerald-600",
                              log.level === "info" && "text-blue-600",
                            )}
                          >
                            {log.stage}
                          </span>
                          <span className="text-foreground">{log.message}</span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Link to="/document-manager">
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                  Document Manager
                </Button>
              </Link>
              <Link to="/document-upload">
                <Button variant="outline" size="sm">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Center
                </Button>
              </Link>
              <Link to="/audit-reports">
                <Button variant="outline" size="sm">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Audit Reports
                </Button>
              </Link>
              <Link to="/ai-insights">
                <Button variant="outline" size="sm">
                  <Brain className="h-3.5 w-3.5 mr-1.5" />
                  AI Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DocumentProcessing;
