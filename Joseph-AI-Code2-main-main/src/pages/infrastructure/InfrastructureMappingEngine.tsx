import { Card, CardContent } from "../../components/ui/card";
export default function InfrastructureMappingEngine() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Infrastructure Mapping Engine</h1>
      <p className="mb-6 text-muted-foreground">Map and synchronize your business infrastructure with visual dashboards and on-chain proofs for ultimate transparency and trust.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Mapping & Analytics</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Generate business maps—networks, value chains, geographical hotspots</li>
            <li>Dashboards for infrastructure analytics and performance</li>
            <li>Export and share visual infrastructure reports</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Generate Map</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Anchor map snapshots to StarkNet for immutable record-keeping</li>
            <li>Time-stamped blockchain proof of infrastructure mapping activity</li>
            <li>Global partners verify map authenticity without intermediaries</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet-monitor.com/", "_blank", "noopener")}
          >
            Anchor Map Snapshot
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
