import { djangoDelete, djangoGet, djangoPatch, djangoPost } from "./django-client";

const DJANGO_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export interface DocumentRecord {
  id: number;
  title: string;
  file: string;
  file_url?: string;
  file_type: string;
  size: number;
  uploaded_by: number | null;
  uploaded_by_name?: string;
  uploaded_at: string;
  metadata: Record<string, unknown>;
  status?: "Processing" | "Processed" | "Failed";
  category?: string;
  tags?: string[];
}

function getDocumentMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.detail === "string" && record.detail.trim()) {
    return record.detail;
  }
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  const fieldErrors = Object.entries(record)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" | ");

  return fieldErrors || fallback;
}

export interface DocumentProcessingEvent {
  id: number;
  document: number;
  document_title: string;
  user: number;
  stage:
    | "uploaded"
    | "ingest"
    | "extract"
    | "normalize"
    | "metadata"
    | "storage"
    | "trigger"
    | "complete"
    | "error";
  level: "info" | "success" | "warning" | "error";
  message: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface DocumentInsightRecord {
  id: number;
  document: number;
  summary: string;
  key_points: string[];
  keywords: string[];
  entities: {
    people?: string[];
    dates?: string[];
    places?: string[];
    organizations?: string[];
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function normalizeRecords(payload: DocumentRecord[] | PaginatedResponse<DocumentRecord>): DocumentRecord[] {
  return Array.isArray(payload) ? payload : payload.results;
}

export async function listDocuments(): Promise<DocumentRecord[]> {
  const payload = await djangoGet<DocumentRecord[] | PaginatedResponse<DocumentRecord>>(
    "/api/business/documents/",
  );
  return normalizeRecords(payload);
}

export async function deleteDocumentRecord(id: number): Promise<void> {
  await djangoDelete(`/api/business/documents/${id}/`);
}

export async function updateDocumentMetadata(
  id: number,
  metadata: Record<string, unknown>,
): Promise<DocumentRecord> {
  return djangoPatch<DocumentRecord>(`/api/business/documents/${id}/`, {
    metadata,
  });
}

export async function updateDocumentStatus(
  id: number,
  status: "Processing" | "Processed" | "Failed",
  message?: string,
): Promise<DocumentRecord> {
  return djangoPost<DocumentRecord>(`/api/business/documents/${id}/status/`, {
    status,
    message,
  });
}

export async function reprocessDocumentRecord(
  id: number,
): Promise<{ document: DocumentRecord }> {
  return djangoPost<{ document: DocumentRecord }>(
    `/api/business/documents/${id}/reprocess/`,
    {},
  );
}

export async function listDocumentEvents(id: number): Promise<DocumentProcessingEvent[]> {
  return djangoGet<DocumentProcessingEvent[]>(`/api/business/documents/${id}/events/`);
}

export async function getDocumentInsights(id: number): Promise<DocumentInsightRecord> {
  return djangoGet<DocumentInsightRecord>(`/api/business/documents/${id}/insights/`);
}

export async function listAllDocumentEvents(): Promise<DocumentProcessingEvent[]> {
  return djangoGet<DocumentProcessingEvent[]>(`/api/business/documents/events/`);
}

export async function uploadDocumentRecord(
  file: File,
  options: {
    category?: string;
    tags?: string[];
    onProgress?: (percent: number) => void;
  } = {},
): Promise<DocumentRecord> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required to upload documents.");
  }

  const formData = new FormData();
  const ext = file.name.split(".").pop()?.toLowerCase() || "other";
  const mappedType =
    ext === "pdf"
      ? "pdf"
      : ["xls", "xlsx", "csv"].includes(ext)
        ? "excel"
        : ["doc", "docx"].includes(ext)
          ? "word"
          : ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
            ? "image"
            : "other";
  formData.append("title", file.name);
  formData.append("file", file);
  formData.append("file_type", mappedType);
  formData.append("size", String(file.size));
  formData.append(
    "metadata",
    JSON.stringify({
      category: options.category || "General",
      tags: options.tags || [ext, "uploaded"],
      status: "Processing",
    }),
  );

  return await new Promise<DocumentRecord>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${DJANGO_API_BASE}/api/business/documents/`);
    xhr.setRequestHeader("Authorization", `Token ${token}`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !options.onProgress) {
        return;
      }
      const percent = Math.max(1, Math.round((event.loaded / event.total) * 100));
      options.onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as DocumentRecord;
          resolve(data);
        } catch {
          reject(new Error("Upload succeeded but response parsing failed."));
        }
        return;
      }

      let message = `Upload failed with status ${xhr.status}`;
      try {
        const body = JSON.parse(xhr.responseText) as unknown;
        message = getDocumentMessage(body, message);
      } catch {
        // Keep default message.
      }
      reject(new Error(message));
    };

    xhr.onerror = () => reject(new Error("Upload failed due to a network error."));
    xhr.send(formData);
  });
}
