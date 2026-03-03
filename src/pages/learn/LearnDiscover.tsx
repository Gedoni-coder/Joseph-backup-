import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

const topics = [
  "Microeconomics Fundamentals",
  "Macroeconomics & Policy",
  "Market Structures & Competition",
  "Supply & Demand Dynamics",
  "Economic Indicators & Forecasting",
  "Connected Economy Principles",
  "Digital Marketplaces & E-commerce",
  "Value Exchange & Payment Systems",
  "Network Effects & Platform Economics",
  "Business Ecosystems & Partnerships",
  "Digital Identity in Economics",
  "Data Economy & Monetization",
  "Cross-border Trade & Finance",
  "Economic Inclusion & Access",
  "Supply Chain Economics",
  "Economic Governance & Transparency",
  "Innovation & Economic Growth",
  "Financial Markets & Instruments",
];

export default function LearnDiscover() {
  const [query, setQuery] = React.useState("");

  const filteredTopics = topics.filter(topic =>
    topic.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Discover</h1>
      <p className="mb-6 text-muted-foreground">
        Explore topics about the connected economy. Search for specific areas or browse curated content.
      </p>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search topics about the connected economy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredTopics.map((topic, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{topic}</h3>
              <p className="text-sm text-muted-foreground">
                Learn more about {topic.toLowerCase()} and its role in the connected economy.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No topics found matching your search.</p>
        </div>
      )}
    </div>
  );
}

