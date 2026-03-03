import { Card, CardContent } from "../../components/ui/card";
export default function GovernanceTrustMechanisms() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Governance & Trust Mechanisms</h1>
      <p className="mb-6 text-muted-foreground">Create, propose, and audit business decisions with off-chain and on-chain voting and trust protocols.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Off-chain Voting</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Create and vote on business proposals quickly and securely in-app</li>
            <li>Off-chain voting, fast results, and internal audit trail</li>
            <li>Polls, surveys, and democratic participation tools</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Propose Off-chain Vote</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Transparent, on-chain proposal and DAO voting contract</li>
            <li>Votes are public, weighted, and auditable immutably</li>
            <li>Automated result calculation and record keeping</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://governance.starknet.io/", "_blank", "noopener")}
          >
            On-chain Vote
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
