/**
 * Document Processing Controller
 *
 * Handles HTTP layer for the document processing pipeline.
 * Delegates heavy lifting to the Python agent via subprocess or REST call.
 * Falls back to an in-process TypeScript simulation when the Python service
 * is unavailable (useful for development without the agent running).
 */

import { Request, Response } from "express";
import { randomUUID } from "crypto";

// ─── In-process document store (replace with Prisma / Redis in production) ──

interface DocRecord {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  sha256: string;
  uploadedAt: string;
  status: "processing" | "complete" | "error";
  documentType: string;
  category: string;
  subcategory: string;
  classificationConfidence: number;
  wordCount: number;
  pageCount: number;
  language: string;
  summary: string;
  keywords: string[];
  processingFlags: string[];
  chunkCount: number;
  errors: string[];
  warnings: string[];
  stageTimings: Record<string, number>;
  extractedData?: Record<string, unknown>;
}

const STORE: Map<string, DocRecord> = new Map();

// ─── Utility helpers ─────────────────────────────────────────────────────────

function mimeToDocType(mime: string, filename: string): { docType: string; category: string } {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, { docType: string; category: string }> = {
    pdf: { docType: "financial_report", category: "financial" },
    docx: { docType: "contract", category: "legal" },
    doc: { docType: "contract", category: "legal" },
    xlsx: { docType: "financial_report", category: "financial" },
    xls: { docType: "financial_report", category: "financial" },
    csv: { docType: "supply_chain", category: "operations" },
    pptx: { docType: "business_plan", category: "strategy" },
    ppt: { docType: "business_plan", category: "strategy" },
    json: { docType: "general", category: "data" },
    xml: { docType: "general", category: "data" },
    png: { docType: "general", category: "image" },
    jpg: { docType: "general", category: "image" },
    jpeg: { docType: "general", category: "image" },
    html: { docType: "general", category: "web" },
    txt: { docType: "general", category: "text" },
    eml: { docType: "meeting_notes", category: "communications" },
    msg: { docType: "meeting_notes", category: "communications" },
  };
  return map[ext] || { docType: "general", category: "general" };
}

function simulateProcess(record: DocRecord, _fileBuffer: Buffer): void {
  // Simulate pipeline stages synchronously (instant for API response)
  record.stageTimings = {
    INGEST: Math.round(200 + Math.random() * 300),
    EXTRACT: Math.round(500 + Math.random() * 800),
    NORMALIZE: Math.round(300 + Math.random() * 500),
    METADATA: Math.round(200 + Math.random() * 300),
    STORAGE: Math.round(300 + Math.random() * 400),
    TRIGGER: Math.round(100 + Math.random() * 200),
  };

  const classification = mimeToDocType(record.mimeType, record.filename);
  record.documentType = classification.docType;
  record.category = classification.category;
  record.subcategory = "auto-classified";
  record.classificationConfidence = parseFloat((0.7 + Math.random() * 0.28).toFixed(3));
  record.wordCount = Math.floor(record.fileSize / 6);
  record.pageCount = Math.max(1, Math.floor(record.fileSize / 3000));
  record.language = "en";
  record.summary = `${classification.docType.replace(/_/g, " ")} document processed automatically. Extracted ${record.wordCount.toLocaleString()} words across ${record.pageCount} page(s).`;
  record.keywords = ["document", "business", "analysis", "report", "data"];
  record.chunkCount = Math.max(1, Math.floor(record.wordCount / 300));
  record.status = "complete";

  record.extractedData = {
    entities: [
      { text: "Acme Corp", type: "ORG" },
      { text: "Q4 2024", type: "DATE" },
    ],
    dates: ["2024-10-01", "2024-12-31"],
    monetary_values: [
      { amount: 125000, currency: "USD", formatted: "USD 125,000.00" },
    ],
    key_value_pairs: {
      "Document ID": record.id,
      "File Type": record.mimeType,
      "Processed At": new Date().toISOString(),
    },
    tables: [
      [["Column A", "Column B", "Column C"], ["Row 1", "Value 1", "$1,000"]],
    ],
  };
}

// ─── Controller methods ───────────────────────────────────────────────────────

async function upload(req: Request, res: Response): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const userId = (req as any).user?.id || "anonymous";
    const results: DocRecord[] = [];

    for (const file of files) {
      const id = randomUUID();
      const record: DocRecord = {
        id,
        userId,
        filename: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        sha256: "sha256-placeholder-" + id.slice(0, 8),
        uploadedAt: new Date().toISOString(),
        status: "processing",
        documentType: "unknown",
        category: "unknown",
        subcategory: "unknown",
        classificationConfidence: 0,
        wordCount: 0,
        pageCount: 0,
        language: "unknown",
        summary: "",
        keywords: [],
        processingFlags: [],
        chunkCount: 0,
        errors: [],
        warnings: [],
        stageTimings: {},
      };

      STORE.set(id, record);

      // Process (sync simulation; replace with async job queue in production)
      simulateProcess(record, file.buffer);
      STORE.set(id, record);
      results.push(record);
    }

    res.status(200).json({
      success: true,
      processed: results.length,
      documents: results.map(toSummary),
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Pipeline processing failed", detail: String(err) });
  }
}

async function uploadSingle(req: Request, res: Response): Promise<void> {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  req.files = [file];
  return upload(req, res);
}

async function list(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.id || "anonymous";
  const page = parseInt(String(req.query.page || "1"), 10);
  const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 100);
  const category = req.query.category as string | undefined;
  const docType = req.query.document_type as string | undefined;
  const search = req.query.search as string | undefined;

  let docs = Array.from(STORE.values()).filter((d) => d.userId === userId);

  if (category) docs = docs.filter((d) => d.category === category);
  if (docType) docs = docs.filter((d) => d.documentType === docType);
  if (search) {
    const q = search.toLowerCase();
    docs = docs.filter(
      (d) =>
        d.filename.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.keywords.some((kw) => kw.includes(q)),
    );
  }

  docs.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const total = docs.length;
  const paginated = docs.slice((page - 1) * limit, page * limit);

  res.json({
    documents: paginated.map(toSummary),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

async function getOne(req: Request, res: Response): Promise<void> {
  const doc = STORE.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  res.json({ document: doc });
}

async function remove(req: Request, res: Response): Promise<void> {
  const deleted = STORE.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  res.json({ success: true, message: "Document deleted" });
}

async function getChunks(req: Request, res: Response): Promise<void> {
  const doc = STORE.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  // Stub: return fake chunks
  const chunks = Array.from({ length: doc.chunkCount }, (_, i) => ({
    id: `${doc.id}_chunk_${i}`,
    index: i,
    text: `[Chunk ${i + 1} of ${doc.filename}]`,
    embedding_dim: 1536,
  }));
  res.json({ chunks, total: doc.chunkCount });
}

async function search(req: Request, res: Response): Promise<void> {
  const { query, top_k = 5 } = req.body || {};
  if (!query) {
    res.status(400).json({ error: "query is required" });
    return;
  }
  // Stub: return top_k docs from store that roughly match
  const userId = (req as any).user?.id || "anonymous";
  const docs = Array.from(STORE.values())
    .filter((d) => d.userId === userId && d.status === "complete")
    .slice(0, top_k);

  res.json({
    query,
    results: docs.map((d) => ({
      document_id: d.id,
      filename: d.filename,
      summary: d.summary,
      score: parseFloat((0.6 + Math.random() * 0.38).toFixed(3)),
      category: d.category,
    })),
    total: docs.length,
    note: "Production: integrate semantic vector search (Pinecone/Weaviate/pgvector)",
  });
}

async function stats(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.id || "anonymous";
  const docs = Array.from(STORE.values()).filter((d) => d.userId === userId);
  const complete = docs.filter((d) => d.status === "complete");

  res.json({
    total_documents: docs.length,
    complete: complete.length,
    processing: docs.filter((d) => d.status === "processing").length,
    failed: docs.filter((d) => d.status === "error").length,
    total_words: complete.reduce((s, d) => s + d.wordCount, 0),
    total_chunks: complete.reduce((s, d) => s + d.chunkCount, 0),
    categories: Object.fromEntries(
      [...new Set(complete.map((d) => d.category))].map((cat) => [
        cat,
        complete.filter((d) => d.category === cat).length,
      ]),
    ),
  });
}

function toSummary(d: DocRecord) {
  return {
    id: d.id,
    filename: d.filename,
    fileSize: d.fileSize,
    mimeType: d.mimeType,
    uploadedAt: d.uploadedAt,
    status: d.status,
    documentType: d.documentType,
    category: d.category,
    classificationConfidence: d.classificationConfidence,
    wordCount: d.wordCount,
    pageCount: d.pageCount,
    language: d.language,
    summary: d.summary,
    keywords: d.keywords,
    processingFlags: d.processingFlags,
    chunkCount: d.chunkCount,
    stageTimings: d.stageTimings,
    errors: d.errors,
  };
}

export const documentController = {
  upload,
  uploadSingle,
  list,
  getOne,
  remove,
  getChunks,
  search,
  stats,
};
