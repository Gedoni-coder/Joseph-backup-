import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";

export default function Opportunities() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
      <p className="mb-6 text-muted-foreground">
        Discover, manage, and publish opportunities like grants, gigs, tenders, and investments. Use Web2 tools for in-app marketplace
        workflows, and Web3 to anchor listings immutably on StarkNet for public verifiability.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card>
          <CardContent className="py-6 px-4">
            <h2 className="text-xl font-semibold mb-2">Web2</h2>
            <ul className="list-disc list-inside text-sm space-y-1 mb-3">
              <li><b>View Marketplace:</b> Browse, search, and manage opportunities in-app</li>
            </ul>
            <button
              className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
              onClick={() => navigate("/infrastructure/opportunities/marketplace")}
            >
              View Marketplace
            </button>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                className="px-3 py-2 bg-muted text-primary rounded border text-sm"
                onClick={() => window.open("https://jiji.ng/", "_blank", "noopener")}
              >
                Open Jiji
              </button>
              <button
                className="px-3 py-2 bg-muted text-primary rounded border text-sm"
                onClick={() => window.open("https://www.linkedin.com/", "_blank", "noopener")}
              >
                Open LinkedIn
              </button>
              <button
                className="px-3 py-2 bg-muted text-primary rounded border text-sm"
                onClick={() => window.open("https://ng.indeed.com/", "_blank", "noopener")}
              >
                Open Indeed
              </button>
              <button
                className="px-3 py-2 bg-muted text-primary rounded border text-sm"
                onClick={() => window.open("https://www.grantwatch.com/", "_blank", "noopener")}
              >
                Open GrantWatch
              </button>
            </div>
          </CardContent>
        </Card>
        {/* Web3 */}
        <Card>
          <CardContent className="py-6 px-4">
            <h2 className="text-xl font-semibold mb-2">Web3 (StarkNet)</h2>
            <ul className="list-disc list-inside text-sm space-y-1 mb-3">
              <li><b>Publish On-chain Listing:</b> Anchor a listing on StarkNet registry for immutability and public verifiability</li>
            </ul>
            <button
              className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
              onClick={() => window.open("https://www.starknet.org/", "_blank", "noopener")}
            >
              Publish On-chain Listing
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
