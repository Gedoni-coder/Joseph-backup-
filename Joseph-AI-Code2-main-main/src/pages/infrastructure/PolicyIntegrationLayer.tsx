import { Card, CardContent } from "../../components/ui/card";
export default function PolicyIntegrationLayer() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Policy Integration Layer</h1>
      <p className="mb-6 text-muted-foreground">
        Stay ahead of policy shifts and instantly prove compliance using a bridge between Web2 dashboards and immutable, on-chain attestations.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Compliance Tools</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Sync latest regulatory and compliance templates to your business systems</li>
            <li>Centralized repository of all active policies and updates</li>
            <li>Dashboard for tracking and self-auditing compliance readiness</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Sync Compliance Rules</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">View Policy Repo</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Register compliance/attestation document hashes immutably on StarkNet</li>
            <li>Issue and verify credentials that prove regulatory compliance to any partner</li>
            <li>View the full audit trail, policy hash, and timestamped proofs</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://governance.starknet.io/staked-strk", "_blank", "noopener")}
          >
            Register Compliance Attestation
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://voyager.online/staking-dashboard", "_blank", "noopener")}
          >
            Verify Credential
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
