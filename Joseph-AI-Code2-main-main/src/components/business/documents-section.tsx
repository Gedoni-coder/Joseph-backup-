import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Copy,
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  extractTextFromFile,
  formatExtractedText,
  getFileTypeInfo,
} from "@/lib/document-processor";

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  description?: string;
  file_url?: string;
  file?: File;
  extractedText?: string;
  isExtracting?: boolean;
  extractionError?: string;
}

export function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business/documents/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        try {
          const data = await response.json();
          setDocuments(Array.isArray(data) ? data : data.results || []);
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          setDocuments([]);
        }
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mockDocument: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        file_type: file.type,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
        description: "",
        file: file,
        isExtracting: true,
      };

      setDocuments((prev) => [mockDocument, ...prev]);
      toast.success(`Processing ${file.name}...`);

      // Extract text from file
      try {
        const extractedText = await extractTextFromFile(file);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === mockDocument.id
              ? {
                  ...doc,
                  extractedText,
                  isExtracting: false,
                }
              : doc,
          ),
        );
        toast.success(`Text extracted from ${file.name}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === mockDocument.id
              ? {
                  ...doc,
                  isExtracting: false,
                  extractionError: errorMessage,
                }
              : doc,
          ),
        );
        toast.error(`Failed to process ${file.name}`);
      }
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast.success("Document deleted");
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Text copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleDownloadText = (doc: Document) => {
    if (!doc.extractedText) return;

    const element = document.createElement("a");
    const file = new Blob([doc.extractedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.name.replace(/\.[^/.]+$/, "")}_extracted.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Text downloaded");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType: string) => {
    const info = getFileTypeInfo(fileType);
    return info.icon;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/50 hover:border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-lg">
                <Upload className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Select Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, Excel, Word, Images, CSV, Text
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left text-xs">
              <p className="font-medium text-blue-900 mb-1">
                Automatic Text Extraction:
              </p>
              <ul className="text-blue-800 space-y-1">
                <li>✓ Text files & CSV - Full extraction</li>
                <li>✓ PDF, Word, Excel - Partial extraction</li>
                <li>✓ Images - OCR requires server processing</li>
              </ul>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.txt"
          />
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents ({documents.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => {
                  const isExpanded = expandedDocId === doc.id;
                  const fileInfo = getFileTypeInfo(doc.file_type);
                  const { displayText, isTruncated } = doc.extractedText
                    ? formatExtractedText(doc.extractedText)
                    : { displayText: "", isTruncated: false };

                  return (
                    <div
                      key={doc.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Document Header */}
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="text-2xl flex-shrink-0">
                            {getFileIcon(doc.file_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-sm">
                              {doc.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {formatFileSize(doc.file_size)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(doc.uploaded_at)}
                              </span>
                              {doc.isExtracting && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs gap-1"
                                >
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Extracting...
                                </Badge>
                              )}
                              {doc.extractedText && (
                                <>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-800"
                                  >
                                    ✓ Extracted
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {doc.extractedText.length} chars
                                  </span>
                                </>
                              )}
                              {doc.extractionError && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-orange-100 text-orange-800"
                                >
                                  ⚠ {doc.extractionError}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {doc.extractedText && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownloadText(doc)}
                              title="Download extracted text"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-destructive"
                            onClick={() => handleDelete(doc.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {doc.extractedText && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                setExpandedDocId(isExpanded ? null : doc.id)
                              }
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Extracted Text Preview */}
                      {isExpanded && doc.extractedText && (
                        <div className="border-t bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium text-sm">
                                Extracted Text
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {doc.extractedText.length} characters •{" "}
                                {doc.extractedText.split("\n").length} lines
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-2 text-xs"
                              onClick={() =>
                                handleCopyText(doc.id, doc.extractedText!)
                              }
                            >
                              {copiedId === doc.id ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy All
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="bg-white dark:bg-slate-950 rounded border p-4 max-h-96 overflow-y-auto text-xs font-mono whitespace-pre-wrap break-words">
                            {displayText}
                            {isTruncated && (
                              <div className="mt-4 text-center text-muted-foreground italic">
                                ... (text truncated for display)
                              </div>
                            )}
                          </div>

                          {isTruncated && (
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <AlertCircle className="h-3 w-3" />
                              Full text available ({
                                doc.extractedText.length
                              }{" "}
                              chars). Download to see complete content.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        !isLoading && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-2">
                Upload documents to extract and process text
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
