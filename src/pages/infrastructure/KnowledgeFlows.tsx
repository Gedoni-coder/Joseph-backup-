import { Card, CardContent } from "../../components/ui/card";
export default function KnowledgeFlows() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Knowledge Flows</h1>
      <p className="mb-6 text-muted-foreground">Amplify your expertise and credentials with powerful learning and blockchain-verified skill systems.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2 Module</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Certificate/CV/skill dashboard</li>
            <li>Credential/doc verification by upload</li>
            <li>Micro-courses, tutorials, and mentoring content</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Upload Credential</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">Browse Courses</button>
        </CardContent></Card>
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>On-chain skill/achievement NFT credentials</li>
            <li>Learning history proofs (immutable)</li>
            <li>Employers/collaborators verify NFTs</li>
            <li>Reputation NFT for contributors</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet.io/tutorials/", "_blank", "noopener")}
          >
            Mint Skill NFT
          </button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">View Reputation Score</button>
        </CardContent></Card>
      </div>
    </div>
  )
}
