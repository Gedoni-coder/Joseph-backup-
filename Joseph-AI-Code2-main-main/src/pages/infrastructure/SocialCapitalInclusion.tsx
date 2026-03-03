import { Card, CardContent } from "../../components/ui/card";
export default function SocialCapitalInclusion() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Social Capital & Inclusion</h1>
      <p className="mb-6 text-muted-foreground">
        Unlock new business possibilities with vibrant communities and blockchain-verified reputation.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Community Organization</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Create and manage business community groups & networking collectives</li>
            <li>Organize events, resource sharing, and mentorship in-app</li>
            <li>Peer-to-peer moderation and group reputation displays</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Create Community Group</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Mint Soulbound badges for verified reputation: Mentor, Seller, Partner</li>
            <li>Your achievements are represented by on-chain, non-transferable proofs</li>
            <li>Portable trust and easy verification across business networks</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://governance.starknet.io/delegates", "_blank", "noopener")}
          >
            Mint Reputation Badge
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
