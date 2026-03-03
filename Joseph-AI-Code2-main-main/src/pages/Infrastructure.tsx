import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const infraModules = [
  {
    name: "Networks",
    slug: "networks",
    description: "Digital and human connections across users, partners, and enterprises."
  },
  {
    name: "Jobs",
    slug: "jobs",
    description: "Smart job-matching and opportunity systems powered by AI insights."
  },
  {
    name: "Opportunities",
    slug: "opportunities",
    description: "Access to growth programs, investments, tenders, and grants."
  },
  {
    name: "Services",
    slug: "services",
    description: "A suite of economic, financial, and compliance tools integrated into modules."
  },
  {
    name: "Support Systems",
    slug: "support-systems",
    description: "Mentorship, business advisory, and automated helpdesk via the AI."
  },
  {
    name: "Value Exchange Channels",
    slug: "value-exchange-channels",
    description: "Payment gateways, loan integrations, credit scoring, and settlements."
  },
  {
    name: "Knowledge Flows",
    slug: "knowledge-flows",
    description: "Data sharing, insights, and economic education modules."
  },
  {
    name: "Governance & Trust Mechanisms",
    slug: "governance-trust-mechanisms",
    description: "Transparent rules, user verification, and ethical AI protocols."
  },
  {
    name: "Social Capital & Inclusion",
    slug: "social-capital-inclusion",
    description: "Business communities, cooperative groups, and shared growth spaces."
  },
  {
    name: "Culture of Collaboration",
    slug: "culture-of-collaboration",
    description: "Networking rooms, co-project spaces, and peer-to-peer partnerships."
  },
  {
    name: "Business Intelligence Layer",
    slug: "business-intelligence-layer",
    description: "AI dashboards and forecasting tools for decision-making."
  },
  {
    name: "Policy Integration Layer",
    slug: "policy-integration-layer",
    description: "Real-time link between users and government economic frameworks."
  },
  {
    name: "Data Economy Layer",
    slug: "data-economy-layer",
    description: "Secure storage and trade of verified business data for insights."
  },
  {
    name: "Funding Layer",
    slug: "funding-layer",
    description: "Integration of MSME financing sources, venture opportunities, and micro-loans."
  },
  {
    name: "Market Access Layer",
    slug: "market-access-layer",
    description: "Local and international trade connection hubs with analytics."
  },
  {
    name: "Infrastructure Mapping Engine",
    slug: "infrastructure-mapping-engine",
    description: "Mapping where economic activities thrive and need support."
  },
  {
    name: "Education & Training Layer",
    slug: "education-training-layer",
    description: "Courses, simulations, and AI-guided upskilling."
  },
  {
    name: "Analytics & Metrics Engine",
    slug: "analytics-metrics-engine",
    description: "For tracking performance, growth, and sustainability in real time."
  },
  {
    name: "Community Governance Council",
    slug: "community-governance-council",
    description: "Moderation, feedback, and democratic improvement loops."
  }
];

export default function Infrastructure() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-2">Meet the Infrastructure that Drives Joseph AI</h1>
      <p className="mb-8 text-muted-foreground">
        Explore the connected, modular layers that enable business intelligence, jobs, funding, data flows, community, and more—all unified by Joseph AI.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {infraModules.map((mod, idx) => (
          <AccordionItem key={mod.slug} value={mod.slug}>
            <AccordionTrigger className="text-lg flex justify-between items-center">
              <span>{idx + 1}. {mod.name}</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="my-2"><CardContent className="py-4">
                <div className="text-sm mb-2 text-primary font-medium">{mod.name}</div>
                <div className="mb-2 text-muted-foreground">{mod.description}</div>
                <button
                  className="mt-2 px-3 py-1 rounded bg-primary text-white hover:bg-primary/80 text-xs"
                  onClick={() => navigate(`/infrastructure/${mod.slug}`)}
                >Access Module</button>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
