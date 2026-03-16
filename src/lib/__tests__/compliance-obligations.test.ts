/**
 * Tests for compliance obligations linkage between the static data source
 * (baseObligations / generateComplianceObligations) and the UI layer.
 */

import { describe, it, expect } from "vitest";
import {
  generateComplianceObligations,
  calculateObligationStatus,
  calculateNextDueDate,
  getCalendarStats,
  filterObligationsByStatus,
} from "../calculations/compliance-calendar-calculation";

describe("generateComplianceObligations", () => {
  it("returns all base obligations", () => {
    const obligations = generateComplianceObligations();
    expect(obligations.length).toBeGreaterThan(0);
  });

  it("uses underscore status values compatible with the UI type", () => {
    const obligations = generateComplianceObligations();
    const validStatuses = ["completed", "pending", "at_risk", "overdue"];
    obligations.forEach((o) => {
      expect(validStatuses).toContain(o.status);
      // Specifically ensure legacy hyphen form is NOT used
      expect(o.status).not.toBe("at-risk");
    });
  });

  it("uses underscore frequency values compatible with the UI type", () => {
    const obligations = generateComplianceObligations();
    const validFrequencies = ["monthly", "quarterly", "annually", "event_based"];
    obligations.forEach((o) => {
      expect(validFrequencies).toContain(o.frequency);
      // Specifically ensure legacy hyphen form is NOT used
      expect(o.frequency).not.toBe("event-based");
    });
  });

  it("marks explicitly completed obligations as completed", () => {
    const firstId = generateComplianceObligations()[0].id;
    const obligations = generateComplianceObligations([firstId]);
    const first = obligations.find((o) => o.id === firstId);
    expect(first?.status).toBe("completed");
  });

  it("each obligation has required fields for the ComplianceCalendar component", () => {
    const obligations = generateComplianceObligations();
    obligations.forEach((o) => {
      expect(o).toHaveProperty("id");
      expect(o).toHaveProperty("name");
      expect(o).toHaveProperty("description");
      expect(o).toHaveProperty("dueDate");
      expect(o).toHaveProperty("agency");
      expect(o).toHaveProperty("assignedTo");
      expect(o).toHaveProperty("consequence");
      expect(o).toHaveProperty("dependencies");
      expect(Array.isArray(o.dependencies)).toBe(true);
      expect(o).toHaveProperty("documentationRequired");
      expect(Array.isArray(o.documentationRequired)).toBe(true);
    });
  });
});

describe("calculateObligationStatus", () => {
  it("returns overdue for past dates", () => {
    const past = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    expect(calculateObligationStatus(past)).toBe("overdue");
  });

  it("returns at_risk (underscore) for dates within 7 days", () => {
    const soon = new
     Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    expect(calculateObligationStatus(soon)).toBe("at_risk");
  });

  it("returns pending for future dates beyond 7 days", () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    expect(calculateObligationStatus(future)).toBe("pending");
  });
});

describe("calculateNextDueDate", () => {
  it("advances a past monthly date to a future date", () => {
    const pastDate = new Date(2020, 0, 1);
    const now = new Date();
    const next = calculateNextDueDate(pastDate, "monthly", now);
    expect(next.getTime()).toBeGreaterThanOrEqual(now.getTime());
  });

  it("returns the base date unchanged for event_based frequency", () => {
    const base = new Date(2025, 6, 1);
    const result = calculateNextDueDate(base, "event_based", new Date(2025, 5, 1));
    expect(result.getTime()).toBe(base.getTime());
  });
});

describe("getCalendarStats", () => {
  it("counts at_risk obligations correctly", () => {
    const obligations = generateComplianceObligations();
    const stats = getCalendarStats(obligations);
    const manualAtRisk = obligations.filter((o) => o.status === "at_risk").length;
    expect(stats.atRisk).toBe(manualAtRisk);
  });
});

describe("filterObligationsByStatus", () => {
  it("filters by at_risk status without legacy hyphen value", () => {
    const obligations = generateComplianceObligations();
    const atRisk = filterObligationsByStatus(obligations, "at_risk");
    atRisk.forEach((o) => expect(o.status).toBe("at_risk"));
  });

  it("returns all obligations when status is all", () => {
    const obligations = generateComplianceObligations();
    const all = filterObligationsByStatus(obligations, "all");
    expect(all.length).toBe(obligations.length);
  });
});
