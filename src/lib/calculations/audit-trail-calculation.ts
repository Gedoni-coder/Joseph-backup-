/**
 * Audit Trail Calculation Utilities
 * Contains business logic for audit trail analysis and filtering
 */

import { AuditEvent } from "@/lib/tax-compliance-data";

/**
 * Get events by outcome
 */
export function getEventsByOutcome(events: AuditEvent[]): Record<string, AuditEvent[]> {
  return events.reduce((acc, event) => {
    const outcome = event.outcome || "warning";
    if (!acc[outcome]) acc[outcome] = [];
    acc[outcome].push(event);
    return acc;
  }, {} as Record<string, AuditEvent[]>);
}

/**
 * Get events by category
 */
export function getEventsByCategory(events: AuditEvent[]): Record<string, AuditEvent[]> {
  return events.reduce((acc, event) => {
    const category = event.category || "calculation";
    if (!acc[category]) acc[category] = [];
    acc[category].push(event);
    return acc;
  }, {} as Record<string, AuditEvent[]>);
}

/**
 * Get events by user
 */
export function getEventsByUser(events: AuditEvent[]): Record<string, AuditEvent[]> {
  return events.reduce((acc, event) => {
    const user = event.user || "unknown";
    if (!acc[user]) acc[user] = [];
    acc[user].push(event);
    return acc;
  }, {} as Record<string, AuditEvent[]>);
}

/**
 * Get events by entity
 */
export function getEventsByEntity(events: AuditEvent[]): Record<string, AuditEvent[]> {
  return events.reduce((acc, event) => {
    const entity = event.entity || "other";
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(event);
    return acc;
  }, {} as Record<string, AuditEvent[]>);
}

/**
 * Get failed events
 */
export function getFailedEvents(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e => e.outcome === "failure");
}

/**
 * Get warning events
 */
export function getWarningEvents(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e => e.outcome === "warning");
}

/**
 * Get events within date range
 */
export function getEventsByDateRange(events: AuditEvent[], startDate: Date, endDate: Date): AuditEvent[] {
  return events.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

/**
 * Get recent events (last 24 hours)
 */
export function getRecentEvents(events: AuditEvent[]): AuditEvent[] {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return events.filter(e => new Date(e.timestamp) >= oneDayAgo);
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate(events: AuditEvent[]): number {
  if (events.length === 0) return 0;
  const successCount = events.filter(e => e.outcome === "success").length;
  return Math.round((successCount / events.length) * 100);
}

/**
 * Get most active users
 */
export function getMostActiveUsers(events: AuditEvent[], limit: number = 5): { user: string; count: number }[] {
  const userCounts = getEventsByUser(events);
  return Object.entries(userCounts)
    .map(([user, userEvents]) => ({ user, count: userEvents.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get audit summary
 */
export function getAuditSummary(events: AuditEvent[]) {
  return {
    totalEvents: events.length,
    successCount: events.filter(e => e.outcome === "success").length,
    failureCount: events.filter(e => e.outcome === "failure").length,
    warningCount: events.filter(e => e.outcome === "warning").length,
    successRate: calculateSuccessRate(events),
    recentEvents: getRecentEvents(events).length,
    mostActiveUsers: getMostActiveUsers(events),
  };
}

