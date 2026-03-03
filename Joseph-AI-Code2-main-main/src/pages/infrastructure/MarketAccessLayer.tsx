import { Card, CardContent } from "../../components/ui/card";

export default function MarketAccessLayer() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Market Access Layer</h1>
      <p className="mb-6 text-muted-foreground">
        Connect producers, service providers, and consumers directly—frictionless Web2 experience with immutable Web3 trust.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2 Submodules</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>Marketplace Dashboard:</b> Browse/List/Search products and services</li>
            <li><b>Search & Filter Engine:</b> Category, region, and reputation filters</li>
            <li><b>Listings Interface:</b> Photos, descriptions, pricing; edit/delete listings</li>
            <li><b>Messaging System:</b> Chat with buyers/sellers; notifications</li>
            <li><b>Verification System:</b> "Verified on Blockchain" badge on confirmed listings</li>
          </ul>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Open Marketplace</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">Create Listing</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.konga.com/", "_blank", "noopener")}
            >
              Open Konga
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://jiji.ng/", "_blank", "noopener")}
            >
              Open Jiji
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.temu.com/", "_blank", "noopener")}
            >
              Open Temu
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://www.jumia.com.ng/", "_blank", "noopener")}
            >
              Open Jumia
            </button>
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://smemarketplace.ng/", "_blank", "noopener")}
            >
              Open SME Marketplace
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Submodules (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><b>On-chain Listing Registry:</b> Publish listing immutably; view timestamps/history</li>
            <li><b>Data License NFT:</b> Tokenize listing data; transfer/verify ownership on-chain</li>
            <li><b>On-chain Reputation:</b> Assign/verify seller identity & past success</li>
          </ul>
          <button
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://www.starknet.io/starknet-defi/", "_blank", "noopener")}
          >
            Publish On-chain Listing
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://www.starknet.io/dapps/", "_blank", "noopener")}
          >
            Tokenize Listing Data
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}


