import { Card, CardContent } from "../../components/ui/card";

export default function FundingLayer() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Funding Layer</h1>
      <p className="mb-6 text-muted-foreground">
        Democratize access to capital with transparent Web2 flows and trustless, programmatic Web3 disbursement.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2 Submodules</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Funding Dashboard:</b> List grants, loans, investment opportunities</li>
            <li><b>Application Portal:</b> Digital forms; attach profiles & supporting docs</li>
            <li><b>Reputation Display:</b> Badges (e.g., Reliable Borrower)</li>
            <li><b>Notifications:</b> Status updates (applied, reviewed, funded)</li>
            <li><b>Analytics/Portfolio:</b> Funder portfolio stats & repayment rates</li>
          </ul>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">New Funding Application</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">Portfolio Analytics</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.boi.ng/", "_blank", "noopener")}
            >
              Open Bank of Industry
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.grantwatch.com/", "_blank", "noopener")}
            >
              Open GrantWatch
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.boi.ng/", "_blank", "noopener")}
            >
              Open Bank of Industry
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://smedan.gov.ng/", "_blank", "noopener")}
            >
              Open SMEDAN
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.grantwatch.com/", "_blank", "noopener")}
            >
              Open GrantWatch
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Submodules (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Funding Pool Contract:</b> Pool/disburse capital via wallet</li>
            <li><b>Loan Escrow Contract:</b> Lock funds until milestones/KPIs verified</li>
            <li><b>On-chain Reputation Reading:</b> Integrate Joseph AI on-chain metrics</li>
            <li><b>Investor Direct Access:</b> Eligible wallets contribute or audit activity</li>
          </ul>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet.io/grants/", "_blank", "noopener")}
          >
            Pool/Distribute Capital
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://starknet.notion.site/Starknet-Programs-d18c3ccbf7d94ff89ea0157115824afd", "_blank", "noopener")}
          >
            Escrow/Release by Milestone
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}


