import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ModuleHeader from "@/components/ui/module-header";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  deleteDocumentRecord,
  listDocuments,
  type DocumentRecord,
  updateDocumentMetadata,
  updateDocumentStatus,
} from "@/lib/api/document-upload-service";
import {
  FolderOpen,
  File,
  FileText,
  Image,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  Share,
  Star,
  Clock,
  User,
  Activity,
  Grid3X3,
  List,
  Pin,
  CheckCircle,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Archive,
  Mail,
  RefreshCw,
  X,
} from "lucide-react";

interface ManagerDocument {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  tags: string[];
  starred: boolean;
  pinned: boolean;
  status: "Processing" | "Processed" | "Failed";
  category: string;
  description: string;
  fileUrl?: string;
  metadata: Record<string, unknown>;
}

interface CategoryFilter {
  id: string;
  name: string;
  count: number;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-6 w-6 text-red-500" />,
  doc: <FileText className="h-6 w-6 text-blue-500" />,
  docx: <FileText className="h-6 w-6 text-blue-500" />,
  xls: <FileSpreadsheet className="h-6 w-6 text-green-600" />,
  xlsx: <FileSpreadsheet className="h-6 w-6 text-green-600" />,
  csv: <FileSpreadsheet className="h-6 w-6 text-emerald-500" />,
  ppt: <Presentation className="h-6 w-6 text-orange-500" />,
  pptx: <Presentation className="h-6 w-6 text-orange-500" />,
  json: <FileCode className="h-6 w-6 text-yellow-500" />,
  xml: <FileCode className="h-6 w-6 text-purple-500" />,
  png: <Image className="h-6 w-6 text-teal-500" />,
  jpg: <Image className="h-6 w-6 text-teal-500" />,
  jpeg: <Image className="h-6 w-6 text-teal-500" />,
  zip: <Archive className="h-6 w-6 text-gray-500" />,
  eml: <Mail className="h-6 w-6 text-indigo-500" />,
  txt: <FileText className="h-6 w-6 text-gray-500" />,
  excel: <FileSpreadsheet className="h-6 w-6 text-green-600" />,
  word: <FileText className="h-6 w-6 text-blue-500" />,
  image: <Image className="h-6 w-6 text-teal-500" />,
  other: <File className="h-6 w-6 text-muted-foreground" />,
};

const STATUS_COLORS: Record<string, string> = {
  Processed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Processing: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const CATEGORY_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function normalizeStatus(value?: string): "Processing" | "Processed" | "Failed" {
  if (value === "Processed" || value === "Failed" || value === "Processing") {
    return value;
  }
  return "Processing";
}

function mapRecord(record: DocumentRecord): ManagerDocument {
  const metadata = (record.metadata || {}) as Record<string, unknown>;
  const tags = Array.isArray(metadata.tags) ? (metadata.tags as string[]) : [];
  const category = typeof metadata.category === "string" && metadata.category.trim()
    ? metadata.category
    : "General";

  return {
    id: record.id,
    name: record.title,
    type: record.file_type || "other",
    size: formatBytes(Number(record.size || 0)),
    uploadDate: new Date(record.uploaded_at).toISOString().split("T")[0],
    uploadedBy: record.uploaded_by_name || "You",
    tags,
    starred: Boolean(metadata.starred),
    pinned: Boolean(metadata.pinned),
    status: normalizeStatus(record.status),
    category,
    description: `${category} document uploaded via Document Upload Center`,
    fileUrl: record.file_url || record.file,
    metadata,
  };
}

const DocumentManager: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "Processing" | "Processed" | "Failed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<ManagerDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const rows = await listDocuments();
      setDocuments(rows.map(mapRecord));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch documents.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshDocuments();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [refreshDocuments]);

  const categories = useMemo<CategoryFilter[]>(() => {
    const counts = new Map<string, number>();
    for (const doc of documents) {
      counts.set(doc.category, (counts.get(doc.category) || 0) + 1);
    }
    const dynamic = Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ id: name, name, count }));

    return [{ id: "all", name: "All Documents", count: documents.length }, ...dynamic];
  }, [documents]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  const categoryColor = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c, idx) => {
      if (c.id !== "all") {
        map.set(c.id, CATEGORY_COLORS[idx % CATEGORY_COLORS.length]);
      }
    });
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [documents, searchTerm, selectedCategory, selectedStatus]);

  const pinned = filtered.filter((d) => d.pinned);
  const regular = filtered.filter((d) => !d.pinned);

  const stats = [
    { label: "Total Docs", value: filtered.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", icon: <File className="h-4 w-4" /> },
    { label: "Processed", value: filtered.filter((d) => d.status === "Processed").length, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Starred", value: filtered.filter((d) => d.starred).length, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", icon: <Star className="h-4 w-4" /> },
    { label: "Pinned", value: filtered.filter((d) => d.pinned).length, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30", icon: <Pin className="h-4 w-4" /> },
  ];

  const persistMetadata = async (doc: ManagerDocument, patch: Record<string, unknown>) => {
    const nextMetadata = {
      ...doc.metadata,
      ...patch,
      tags: Array.isArray(doc.metadata.tags) ? doc.metadata.tags : doc.tags,
      category:
        typeof doc.metadata.category === "string" && doc.metadata.category
          ? doc.metadata.category
          : doc.category,
      status:
        typeof doc.metadata.status === "string" && doc.metadata.status
          ? doc.metadata.status
          : doc.status,
    };
    const updated = await updateDocumentMetadata(doc.id, nextMetadata);
    return mapRecord(updated);
  };

  const toggleStar = async (doc: ManagerDocument) => {
    try {
      const updated = await persistMetadata(doc, { starred: !doc.starred });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update star state.";
      toast.error(message);
    }
  };

  const togglePin = async (doc: ManagerDocument) => {
    try {
      const updated = await persistMetadata(doc, { pinned: !doc.pinned });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update pin state.";
      toast.error(message);
    }
  };

  const setDocumentState = async (
    id: number,
    status: "Processing" | "Processed" | "Failed",
  ) => {
    try {
      const updated = await updateDocumentStatus(id, status, `Status changed to ${status} from Document Manager.`);
      setDocuments((prev) => prev.map((d) => (d.id === id ? mapRecord(updated) : d)));
      toast.success(`Document moved to ${status}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update document status.";
      toast.error(message);
    }
  };

  const removeDoc = async (id: number) => {
    try {
      await deleteDocumentRecord(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Document deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete document.";
      toast.error(message);
    }
  };

  const openPreview = (doc: ManagerDocument) => {
    if (!doc.fileUrl) {
      toast.error("No preview URL available for this document.");
      return;
    }
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const downloadFile = (doc: ManagerDocument) => {
    if (!doc.fileUrl) {
      toast.error("No download URL available for this document.");
      return;
    }
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const GridCard = ({ doc }: { doc: ManagerDocument }) => {
    const categoryClass = categoryColor.get(doc.category) || "bg-muted text-foreground";
    return (
      <Card className="transition-all hover:shadow-lg cursor-pointer group border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-muted/60 rounded-xl group-hover:bg-muted transition-colors">
              {FILE_ICONS[doc.type] || <File className="h-7 w-7 text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-1">
              {doc.pinned && (
                <button onClick={() => void togglePin(doc)} title="Unpin">
                  <Pin className="h-4 w-4 text-violet-500 hover:text-violet-700" />
                </button>
              )}
              <button onClick={() => void toggleStar(doc)} title={doc.starred ? "Unstar" : "Star"}>
                <Star
                  className={cn(
                    "h-4 w-4 transition-colors",
                    doc.starred ? "text-amber-500 fill-amber-400" : "text-muted-foreground hover:text-amber-400",
                  )}
                />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm truncate" title={doc.name}>
              {doc.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{doc.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge className={cn("text-xs", STATUS_COLORS[doc.status])}>{doc.status}</Badge>
            <Badge className={cn("text-xs", categoryClass)}>{doc.category}</Badge>
          </div>

          <div className="text-xs text-muted-foreground space-y-0.5">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{doc.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{doc.uploadDate}</span>
              <span className="ml-auto">{doc.size}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => openPreview(doc)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => downloadFile(doc)}>
              <Download className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => void setDocumentState(doc.id, "Processed")}>
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs text-destructive hover:bg-destructive/10"
              onClick={() => void removeDoc(doc.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ListRow = ({ doc }: { doc: ManagerDocument }) => {
    const categoryClass = categoryColor.get(doc.category) || "bg-muted text-foreground";
    return (
      <Card className="transition-all hover:shadow-md border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8">
              {FILE_ICONS[doc.type] || <File className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                {doc.pinned && <Pin className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />}
                {doc.starred && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{doc.size}</span>
                <span>•</span>
                <span>{doc.uploadedBy}</span>
                <span>•</span>
                <span>{doc.uploadDate}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{doc.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={cn("text-xs", STATUS_COLORS[doc.status])}>{doc.status}</Badge>
              <Badge className={cn("text-xs hidden sm:flex", categoryClass)}>{doc.category}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => openPreview(doc)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => downloadFile(doc)}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => void setDocumentState(doc.id, "Processing")}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => void removeDoc(doc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<FolderOpen className="h-6 w-6" />}
        title="Document Management Center"
        description="Live document catalog synced with Document Upload Center and backend processing logic"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                    <div className="text-xl font-bold">{s.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Syncing documents from backend..." : `Loaded ${documents.length} documents from backend`}
          </div>
          <Button size="sm" variant="outline" onClick={() => void refreshDocuments()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all whitespace-nowrap text-sm flex-shrink-0",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card border-border hover:bg-muted/60",
              )}
            >
              <span className={selectedCategory === category.id ? "text-primary-foreground" : "text-muted-foreground"}>
                <FolderOpen className="h-4 w-4" />
              </span>
              <div>
                <div className="font-medium text-xs">{category.name}</div>
                <div className={cn("text-[10px]", selectedCategory === category.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {category.count} docs
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "Processing", "Processed", "Failed"] as const).map((statusValue) => (
            <button
              key={statusValue}
              onClick={() => setSelectedStatus(statusValue)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs transition-colors",
                selectedStatus === statusValue
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted/60 border-border",
              )}
            >
              {statusValue}
            </button>
          ))}
        </div>

        {selectedCategory !== "all" && activeCategory && (
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", categoryColor.get(activeCategory.id) || "bg-muted")}> 
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{activeCategory.name}</h3>
                  <p className="text-xs text-muted-foreground">This category is loaded directly from backend metadata.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, tags…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-2 transition-colors",
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
              )}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-2 transition-colors",
                viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
              )}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Link to="/document-upload">
            <Button size="sm" variant="outline">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </Link>
          <Link to="/document-processing">
            <Button size="sm">
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Pipeline
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {isLoading && documents.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">Loading documents...</CardContent>
            </Card>
          )}

          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="h-4 w-4 text-violet-500" />
                <h2 className="text-sm font-semibold">Pinned Documents</h2>
                <Badge variant="outline" className="text-xs">{pinned.length}</Badge>
              </div>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinned.map((doc) => <GridCard key={doc.id} doc={doc} />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {pinned.map((doc) => <ListRow key={doc.id} doc={doc} />)}
                </div>
              )}
            </div>
          )}

          {regular.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                  <h2 className="text-sm font-semibold">All Documents</h2>
                  <Badge variant="outline" className="text-xs">{regular.length}</Badge>
                </div>
              )}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {regular.map((doc) => <GridCard key={doc.id} doc={doc} />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {regular.map((doc) => <ListRow key={doc.id} doc={doc} />)}
                </div>
              )}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? `No documents match "${searchTerm}"`
                    : `No documents in ${activeCategory?.name || "this category"}`}
                </p>
                <Link to="/document-upload">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentManager;
