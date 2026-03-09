import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function OpportunitiesMarketplace() {
  const [query, setQuery] = React.useState("");
  const opportunities = [
    { id: "OP-001", title: "SME Logistics Grant", type: "Grant", org: "TradeDev Africa", location: "Lagos, NG", deadline: "2025-12-01" },
    { id: "OP-002", title: "E-commerce Product Photography Gig", type: "Gig", org: "RetailX Studio", location: "Remote", deadline: "2025-11-15" },
    { id: "OP-003", title: "Cross-border Fulfilment Tender", type: "Tender", org: "PanAfrica Logistics", location: "Nairobi, KE", deadline: "2025-12-10" },
  ];

  const filtered = opportunities.filter(o =>
    [o.title, o.type, o.org, o.location].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Opportunities Marketplace</h1>
      </div>
      <div className="mb-6">
        <Input
          placeholder="Search opportunities (title, type, org, location)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(op => (
          <Card key={op.id}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">{op.type}</div>
              <div className="font-semibold mb-1">{op.title}</div>
              <div className="text-sm">{op.org}</div>
              <div className="text-sm mb-2">{op.location}</div>
              <div className="text-xs text-muted-foreground">Deadline: {op.deadline}</div>
              <button className="mt-3 w-full px-3 py-2 bg-primary text-white rounded text-sm">View Details</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


