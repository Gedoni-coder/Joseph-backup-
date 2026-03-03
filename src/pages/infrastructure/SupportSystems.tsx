import { Card, CardContent } from "../../components/ui/card";

export default function SupportSystems() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Services & Support System Layer</h1>
      <p className="mb-6 text-muted-foreground">
        A continuous ecosystem of mentorship, services, and learning—verified and rewarded on-chain.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2 Submodules</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Support Hub:</b> Request mentorship/help (ticket system); forums/discussions</li>
            <li><b>Service Marketplace:</b> Offer/request services, skills, or advice</li>
            <li><b>Gamified Mentorship:</b> Earn points/levels for helping (Reward Contributor)</li>
            <li><b>Training Library:</b> AI-powered tutorials and lessons</li>
          </ul>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Request Service/Mentorship</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">Reward Contributor</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.smedan.gov.ng/", "_blank", "noopener")}
            >
              Open SMEDAN
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Submodules (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Reputation Badge Contract:</b> Mint SBTs for verified service/help/tasks</li>
            <li><b>Task Bounty/Escrow Contract:</b> Create bounties, lock & release funds on outcome</li>
            <li><b>Proof-of-Learning:</b> Mint skill/achievement NFTs upon verified learning</li>
            <li><b>Tokenized Incentives:</b> Earn tokens or non-transferable credits for contributions</li>
          </ul>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet.io/ambassadors-program/", "_blank", "noopener")}
          >
            Mint Verified Reputation Badge
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://airtable.com/app76uLFJv2YscleR/pago7MLsjxdGbLDes/form", "_blank", "noopener")}
          >
            Launch Task Bounty/Escrow
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}


