import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ModuleHeader from "@/components/ui/module-header";
import { cn } from "@/lib/utils";
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
  MoreVertical,
  Pin,
  Tag,
  BarChart3,
  DollarSign,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Briefcase,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Archive,
  Mail,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocumentRecord {
  id: number;
  name: string;
  type: string;
  size: string;
  module: string;
  uploadDate: string;
  modifiedDate: string;
  uploadedBy: string;
  tags: string[];
  starred: boolean;
  pinned: boolean;
  status: "Final" | "Draft" | "Review";
  description: string;
}

interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  { id: "all", name: "All Documents", icon: <FolderOpen className="h-4 w-4" />, count: 156, color: "bg-muted text-foreground", description: "All company documents" },
  { id: "financial", name: "Financial Advisory", icon: <DollarSign className="h-4 w-4" />, count: 32, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", description: "Financial reports, budgets, and advisory" },
  { id: "business", name: "Business Forecast", icon: <TrendingUp className="h-4 w-4" />, count: 28, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", description: "Business plans and projections" },
  { id: "market", name: "Market Analysis", icon: <BarChart3 className="h-4 w-4" />, count: 24, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", description: "Market research and competitive analysis" },
  { id: "compliance", name: "Compliance & Audit", icon: <Shield className="h-4 w-4" />, count: 19, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", description: "Compliance reports and audit docs" },
  { id: "tax", name: "Tax & Legal", icon: <CheckCircle className="h-4 w-4" />, count: 15, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300", description: "Tax documents and legal agreements" },
  { id: "policy", name: "Policy Analysis", icon: <AlertTriangle className="h-4 w-4" />, count: 12, color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300", description: "Policy and regulatory analysis" },
  { id: "strategy", name: "Strategy & Planning", icon: <Target className="h-4 w-4" />, count: 18, color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300", description: "Strategic plans and growth documents" },
  { id: "operations", name: "Operations", icon: <Briefcase className="h-4 w-4" />, count: 8, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", description: "Operational procedures and docs" },
];

const DOCUMENTS: DocumentRecord[] = [
  { id: 1, name: "Q4_2023_Financial_Report.pdf", type: "pdf", size: "2.4 MB", module: "financial", uploadDate: "2024-01-20", modifiedDate: "2024-01-20", uploadedBy: "John Smith", tags: ["quarterly", "financial", "report"], starred: true, pinned: false, status: "Final", description: "Comprehensive quarterly financial performance report" },
  { id: 2, name: "Market_Expansion_Strategy_2024.docx", type: "docx", size: "856 KB", module: "market", uploadDate: "2024-01-19", modifiedDate: "2024-01-19", uploadedBy: "Sarah Johnson", tags: ["strategy", "market", "expansion"], starred: false, pinned: true, status: "Draft", description: "Strategic plan for market expansion initiatives" },
  { id: 3, name: "Business_Forecast_Model_2024.xlsx", type: "xlsx", size: "1.2 MB", module: "business", uploadDate: "2024-01-18", modifiedDate: "2024-01-18", uploadedBy: "Michael Brown", tags: ["forecast", "model", "planning"], starred: true, pinned: false, status: "Final", description: "Advanced business forecasting model with scenario analysis" },
  { id: 4, name: "SOX_Compliance_Audit_2023.pdf", type: "pdf", size: "3.1 MB", module: "compliance", uploadDate: "2024-01-17", modifiedDate: "2024-01-17", uploadedBy: "Emily Davis", tags: ["sox", "compliance", "audit"], starred: false, pinned: false, status: "Final", description: "Sarbanes-Oxley compliance audit results" },
  { id: 5, name: "Tax_Optimization_Strategy.pdf", type: "pdf", size: "1.8 MB", module: "tax", uploadDate: "2024-01-16", modifiedDate: "2024-01-16", uploadedBy: "Robert Wilson", tags: ["tax", "optimization", "strategy"], starred: false, pinned: false, status: "Review", description: "Corporate tax optimization strategy" },
  { id: 6, name: "Growth_Planning_Framework.pptx", type: "pptx", size: "4.2 MB", module: "strategy", uploadDate: "2024-01-15", modifiedDate: "2024-01-16", uploadedBy: "Lisa Anderson", tags: ["growth", "planning", "framework"], starred: true, pinned: true, status: "Final", description: "Comprehensive growth planning framework" },
  { id: 7, name: "Policy_Impact_Analysis_GDPR.docx", type: "docx", size: "987 KB", module: "policy", uploadDate: "2024-01-14", modifiedDate: "2024-01-15", uploadedBy: "David Chen", tags: ["policy", "gdpr", "impact"], starred: false, pinned: false, status: "Draft", description: "GDPR policy impact analysis" },
  { id: 8, name: "Operational_Efficiency_Report.pdf", type: "pdf", size: "2.1 MB", module: "operations", uploadDate: "2024-01-13", modifiedDate: "2024-01-13", uploadedBy: "Maria Garcia", tags: ["operations", "efficiency", "report"], starred: false, pinned: false, status: "Final", description: "Operational efficiency analysis and recommendations" },
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-7 w-7 text-red-500" />,
  doc: <FileText className="h-7 w-7 text-blue-500" />,
  docx: <FileText className="h-7 w-7 text-blue-500" />,
  xls: <FileSpreadsheet className="h-7 w-7 text-green-600" />,
  xlsx: <FileSpreadsheet className="h-7 w-7 text-green-600" />,
  csv: <FileSpreadsheet className="h-7 w-7 text-emerald-500" />,
  ppt: <Presentation className="h-7 w-7 text-orange-500" />,
  pptx: <Presentation className="h-7 w-7 text-orange-500" />,
  json: <FileCode className="h-7 w-7 text-yellow-500" />,
  xml: <FileCode className="h-7 w-7 text-purple-500" />,
  png: <Image className="h-7 w-7 text-teal-500" />,
  jpg: <Image className="h-7 w-7 text-teal-500" />,
  zip: <Archive className="h-7 w-7 text-gray-500" />,
  eml: <Mail className="h-7 w-7 text-indigo-500" />,
  txt: <FileText className="h-7 w-7 text-gray-500" />,
};

const STATUS_COLORS: Record<string, string> = {
  Final: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DocumentManager: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<DocumentRecord[]>(DOCUMENTS);

  const activeModule = MODULES.find((m) => m.id === selectedModule);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesModule = selectedModule === "all" || doc.module === selectedModule;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));
      return matchesModule && matchesSearch;
    });
  }, [documents, selectedModule, searchTerm]);

  const pinned = filtered.filter((d) => d.pinned);
  const regular = filtered.filter((d) => !d.pinned);

  const stats = [
    { label: "Total Docs", value: filtered.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", icon: <File className="h-4 w-4" /> },
    { label: "Final", value: filtered.filter((d) => d.status === "Final").length, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Starred", value: filtered.filter((d) => d.starred).length, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", icon: <Star className="h-4 w-4" /> },
    { label: "Pinned", value: filtered.filter((d) => d.pinned).length, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30", icon: <Pin className="h-4 w-4" /> },
  ];

  const toggleStar = (id: number) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d)),
    );
  };

  const togglePin = (id: number) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d)),
    );
  };

  const removeDoc = (id: number) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // ── Shared card rendering ──────────────────────────────────────────────────

  const GridCard = ({ doc }: { doc: DocumentRecord }) => {
    const mod = MODULES.find((m) => m.id === doc.module);
    return (
      <Card className="transition-all hover:shadow-lg cursor-pointer group border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-muted/60 rounded-xl group-hover:bg-muted transition-colors">
              {FILE_ICONS[doc.type] || <File className="h-7 w-7 text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-1">
              {doc.pinned && (
                <button onClick={() => togglePin(doc.id)} title="Unpin">
                  <Pin className="h-4 w-4 text-violet-500 hover:text-violet-700" />
                </button>
              )}
              <button onClick={() => toggleStar(doc.id)} title={doc.starred ? "Unstar" : "Star"}>
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
            {mod && (
              <Badge className={cn("text-xs", mod.color)}>
                {mod.name.split(" ")[0]}
              </Badge>
            )}
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
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <Download className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <Share className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs text-destructive hover:bg-destructive/10"
              onClick={() => removeDoc(doc.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ListRow = ({ doc }: { doc: DocumentRecord }) => {
    const mod = MODULES.find((m) => m.id === doc.module);
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
              {mod && <Badge className={cn("text-xs hidden sm:flex", mod.color)}>{mod.name}</Badge>}
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => removeDoc(doc.id)}
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<FolderOpen className="h-6 w-6" />}
        title="Document Management Center"
        description="Centralized document storage and organization across all business modules"
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

        {/* Module Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all whitespace-nowrap text-sm flex-shrink-0",
                selectedModule === mod.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card border-border hover:bg-muted/60",
              )}
            >
              <span className={selectedModule === mod.id ? "text-primary-foreground" : "text-muted-foreground"}>
                {mod.icon}
              </span>
              <div>
                <div className="font-medium text-xs">{mod.name}</div>
                <div className={cn("text-[10px]", selectedModule === mod.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {mod.count} docs
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active module description */}
        {selectedModule !== "all" && activeModule && (
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", activeModule.color)}>{activeModule.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{activeModule.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeModule.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search + View Toggle */}
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

        {/* Documents */}
        <div className="space-y-6">
          {/* Pinned */}
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

          {/* Regular */}
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

          {/* Empty state */}
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? `No documents match "${searchTerm}"`
                    : `No documents in ${activeModule?.name || "this module"}`}
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
