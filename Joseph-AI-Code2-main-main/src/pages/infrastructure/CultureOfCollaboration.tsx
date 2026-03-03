import { Card, CardContent } from "../../components/ui/card";
export default function CultureOfCollaboration() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Culture of Collaboration</h1>
      <p className="mb-6 text-muted-foreground">
        Empower your teams to work, earn, and collaborate—across borders—with seamless digital workspaces and on-chain guarantees of delivery.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Workspace & Collaboration</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Shared project/task boards for real-time collaboration</li>
            <li>Assign, discuss, and complete tasks in a digital workspace</li>
            <li>Integrated chat and alerts for every file/task/project</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Create Workspace</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Create a bounty or escrow for a specific task</li>
            <li>Funds remain locked until milestone/delivery is verified</li>
            <li>Blockchain settlement for instant, trustless reward distribution</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://community.starknet.io/", "_blank", "noopener")}
          >
            Open Bounty/Escrow
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
