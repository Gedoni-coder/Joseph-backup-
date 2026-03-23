# Dynamic Business Tables Integration
Approved plan to replace hardcoded data with Django API data for Business Metrics & Performance Table.

## Steps:
- [x] **1. Create this TODO.md** ✅
- [ ] **2. Edit `src/components/business/business-metrics-table.tsx`**  
  Remove static `businessMetrics` array (~1000+ lines). Add `interface BusinessMetricsTableProps { metrics?: BusinessMetric[]; title?: string; }`. Use `props.metrics || []`. Keep all formatting/status logic.
- [ ] **3. Edit `src/pages/BusinessForecast.tsx`**  
  In `<TabsContent value=\"tables\">` section, change `<BusinessMetricsTable />` → `<BusinessMetricsTable metrics={businessMetrics} />` (pass from hook).
- [ ] **4. Seed Django data**  
  `cd Joseph-backup- && python seed_business_metrics.py` (populates /api/business/business-metrics/).
- [ ] **5. Test integration**  
  Refresh page → Tables use live Django data, no hardcoded fallback.
- [ ] **6. Audit other tables** (FinancialLayout, etc.)  
  Use search_files for similar hardcoded arrays, repeat process.

**Progress**: Starting frontend edits → Django data flow complete.

