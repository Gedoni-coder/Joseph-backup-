import { Card, CardContent } from "../../components/ui/card";

export default function Networks() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Networks</h1>
      <p className="mb-6 text-muted-foreground">
        Unlock the future of business collaboration. Connect in-app and on StarkNet for global, verifiable networks with portable on-chain identity and reputation.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Network Dashboard</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Network Directory:</b> Discover and join business networks and collaborations</li>
            <li><b>Invitations Interface:</b> Manage invites, requests, messaging, identity matching</li>
            <li><b>Auto-Alerts:</b> Email & in-app notifications for network activity & invites</li>
            <li><b>Profile/Matching:</b> Find the right partners and group up for growth</li>
          </ul>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Connect/Invite</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.facebook.com/", "_blank", "noopener")}
            >
              Open Facebook
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.linkedin.com/", "_blank", "noopener")}
            >
              Open LinkedIn
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Submodules (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>On-chain Network Membership:</b> Join/leave networks immutably using StarkNet</li>
            <li><b>Portable Identity:</b> One wallet = one portable reputation across dApps</li>
            <li><b>Verify Membership:</b> Publicly check network status + total members on-chain</li>
          </ul>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet.io/online-communities/", "_blank", "noopener")}
          >
            Join Network (StarkNet)
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
