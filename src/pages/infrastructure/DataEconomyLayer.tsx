import { Card, CardContent } from "../../components/ui/card";
export default function DataEconomyLayer() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Data Economy Layer</h1>
      <p className="mb-6 text-muted-foreground">
        Connect and monetize your business data securely. Enable new revenue streams with flexible data sharing and automated, on-chain licensing.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Dataset Management</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Upload data (sales, analytics, supply chain, etc.) with privacy consent</li>
            <li>Granular sharing and permissions management</li>
            <li>Connect with data buyers directly in-app</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Upload Dataset</button>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Tokenize your data license using StarkNet for traceable ownership</li>
            <li>Grant permissioned access with on-chain proofs</li>
            <li>Monetize data and verify licenses using NFT or ERC-1155 logic</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://sepolia.voyager.online/tokens?ps=25&p=1&type=erc20&erc20=all&attribute=transfers", "_blank", "noopener")}
          >
            Tokenize Data License
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
