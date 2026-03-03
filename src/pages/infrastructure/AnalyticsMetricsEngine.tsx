import { Card, CardContent } from "../../components/ui/card";
export default function AnalyticsMetricsEngine() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Business Intelligence Layer</h1>
      <p className="mb-6 text-muted-foreground">
        Deliver verified analytics and insights—simple Web2 visuals backed by StarkNet proofs for credibility.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2 Submodules</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>BI Dashboard:</b> KPIs (revenue, growth, volume) in charts & timelines</li>
            <li><b>Benchmarking Engine:</b> Compare with sector/peer averages</li>
            <li><b>Report Generator:</b> Export PDFs/visuals (My Growth, My Impact)</li>
            <li><b>Mobile UI:</b> Full access to analytics from mobile</li>
          </ul>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Run KPI Report</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">Benchmark Performance</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.nigerianstat.gov.ng/", "_blank", "noopener")}
            >
              Open NBS (Nigeria Bureau of Statistics)
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Submodules (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>KPI Attestation Contract:</b> Record cryptographic KPI proofs</li>
            <li><b>On-chain Analytics Aggregator:</b> Collect & aggregate events for metrics</li>
            <li><b>Interoperable KPIs:</b> Share proofs across apps & partners</li>
          </ul>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet-monitor.com/", "_blank", "noopener")}
          >
            Attest KPI Proof
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://www.starknet-monitor.com/", "_blank", "noopener")}
          >
            Aggregate Analytics On-chain
          </button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.nigerianstat.gov.ng/", "_blank", "noopener")}
            >
              Open Nigeria Bureau of Statistics
            </button>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}
