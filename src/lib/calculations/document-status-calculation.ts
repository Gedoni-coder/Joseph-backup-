/**
 * Document Status Calculation Utilities
 * Contains business logic for document tracking and status calculations
 */

import { ComplianceDocument } from "@/lib/tax-compliance-data";

/**
 * Get documents by status
 */
export function getDocumentsByStatus(documents: ComplianceDocument[]): Record<string, ComplianceDocument[]> {
  return documents.reduce((acc, doc) => {
    const status = doc.status || "pending";
    if (!acc[status]) acc[status] = [];
    acc[status].push(doc);
    return acc;
  }, {} as Record<string, ComplianceDocument[]>);
}

/**
 * Get documents by type
 */
export function getDocumentsByType(documents: ComplianceDocument[]): Record<string, ComplianceDocument[]> {
  return documents.reduce((acc, doc) => {
    const type = doc.type || "supporting_doc";
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, ComplianceDocument[]>);
}

/**
 * Get documents by entity
 */
export function getDocumentsByEntity(documents: ComplianceDocument[]): Record<string, ComplianceDocument[]> {
  return documents.reduce((acc, doc) => {
    const entity = doc.entity || "other";
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(doc);
    return acc;
  }, {} as Record<string, ComplianceDocument[]>);
}

/**
 * Get pending documents
 */
export function getPendingDocuments(documents: ComplianceDocument[]): ComplianceDocument[] {
  return documents.filter(d => d.status === "pending");
}

/**
 * Get processed documents
 */
export function getProcessedDocuments(documents: ComplianceDocument[]): ComplianceDocument[] {
  return documents.filter(d => d.status === "processed");
}

/**
 * Get rejected documents
 */
export function getRejectedDocuments(documents: ComplianceDocument[]): ComplianceDocument[] {
  return documents.filter(d => d.status === "rejected");
}

/**
 * Get documents expiring soon (within 30 days)
 */
export function getExpiringDocuments(documents: ComplianceDocument[]): ComplianceDocument[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return documents.filter(d => 
    d.retention && 
    new Date(d.retention) <= thirtyDaysFromNow &&
    new Date(d.retention) > now
  );
}

/**
 * Get expired documents
 */
export function getExpiredDocuments(documents: ComplianceDocument[]): ComplianceDocument[] {
  const now = new Date();
  return documents.filter(d => 
    d.retention && 
    new Date(d.retention) < now
  );
}

/**
 * Calculate processing completion rate
 */
export function calculateProcessingRate(documents: ComplianceDocument[]): number {
  if (documents.length === 0) return 0;
  const processed = documents.filter(d => d.status === "processed" || d.status === "approved").length;
  return Math.round((processed / documents.length) * 100);
}

/**
 * Calculate total document size in MB
 */
export function calculateTotalSize(documents: ComplianceDocument[]): number {
  const totalBytes = documents.reduce((sum, d) => sum + (d.size || 0), 0);
  return Math.round(totalBytes / (1024 * 1024) * 100) / 100;
}

/**
 * Get document summary
 */
export function getDocumentSummary(documents: ComplianceDocument[]) {
  return {
    totalDocuments: documents.length,
    pendingCount: getPendingDocuments(documents).length,
    processedCount: getProcessedDocuments(documents).length,
    approvedCount: documents.filter(d => d.status === "approved").length,
    rejectedCount: getRejectedDocuments(documents).length,
    processingRate: calculateProcessingRate(documents),
    totalSizeMB: calculateTotalSize(documents),
    expiringSoon: getExpiringDocuments(documents).length,
    expired: getExpiredDocuments(documents).length,
  };
}

