#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import CompetitiveAdvantage, MarketStrategyRecommendation

# Re-seed deterministic records for the Strategy & Advantages tab.
CompetitiveAdvantage.objects.all().delete()
MarketStrategyRecommendation.objects.all().delete()

advantages = [
    {
        "advantage": "Transparent, Simple Pricing",
        "description": "No hidden fees, transaction-based pricing aligned with customer success, no lock-in contracts",
        "advantage_type": "price",
        "strength_level": "high",
        "sustainability": 80,
        "competitor_response": [
            "Launch temporary discount campaigns",
            "Bundle add-ons to mask pricing complexity",
        ],
        "time_to_replicate": 8,
        "strategic_importance": "important",
    },
    {
        "advantage": "Fastest Implementation Time",
        "description": "Average 2-week implementation vs 3-6 months for competitors, 50% faster time-to-value",
        "advantage_type": "service",
        "strength_level": "medium",
        "sustainability": 60,
        "competitor_response": [
            "Create rapid-onboarding task force",
            "Offer implementation credits through partners",
        ],
        "time_to_replicate": 12,
        "strategic_importance": "important",
    },
    {
        "advantage": "AI-Powered Personalization Engine",
        "description": "Built-in ML engine providing real-time product recommendations and personalized shopping experiences",
        "advantage_type": "technology",
        "strength_level": "high",
        "sustainability": 90,
        "competitor_response": [
            "Acquire recommendation startups",
            "Invest in first-party data infrastructure",
        ],
        "time_to_replicate": 18,
        "strategic_importance": "critical",
    },
    {
        "advantage": "Superior Customer Success",
        "description": "Industry-leading 98% customer satisfaction with dedicated success managers for all accounts",
        "advantage_type": "service",
        "strength_level": "high",
        "sustainability": 82,
        "competitor_response": [
            "Expand customer success headcount",
            "Introduce premium support tiers",
        ],
        "time_to_replicate": 10,
        "strategic_importance": "critical",
    },
    {
        "advantage": "Vertical Industry Solutions",
        "description": "Pre-built templates and workflows for fashion, home & garden, electronics, and other high-growth verticals",
        "advantage_type": "product",
        "strength_level": "high",
        "sustainability": 84,
        "competitor_response": [
            "Publish vertical playbooks for top segments",
            "Partner with niche implementation agencies",
        ],
        "time_to_replicate": 14,
        "strategic_importance": "critical",
    },
]

strategies = [
    {
        "title": "Defend Pricing Simplicity Positioning",
        "strategy_type": "positioning",
        "description": "Message transparent pricing as a trust and TCO advantage across all funnel touchpoints.",
        "rationale": "Competitors rely on complex packaging that creates friction and hidden cost perception.",
        "expected_impact": "high",
        "implementation_complexity": "low",
        "timeframe": "immediate",
        "expected_outcomes": [
            "Higher win rate in price-sensitive deals",
            "Reduced late-stage procurement objections",
        ],
        "implementation_steps": [
            "Refresh pricing page with TCO calculator",
            "Enable sales battlecards for pricing objections",
            "Track objection conversion rate weekly",
        ],
        "success_metrics": [
            "Win rate +6% in SMB/mid-market",
            "Pricing objection rate -20%",
        ],
        "risks": [
            "Competitors trigger short-term price wars",
            "Margin compression in entry tiers",
        ],
    },
    {
        "title": "Scale Fast-Start Implementation Program",
        "strategy_type": "product",
        "description": "Productize a guided launch path to preserve two-week implementation lead as volume scales.",
        "rationale": "Implementation speed is a core differentiator but operationally hard to sustain at growth stage.",
        "expected_impact": "high",
        "implementation_complexity": "medium",
        "timeframe": "short-term",
        "expected_outcomes": [
            "Maintain launch SLA under demand growth",
            "Improve first-30-day retention",
        ],
        "implementation_steps": [
            "Create onboarding automation checklist",
            "Template top 3 vertical launch playbooks",
            "Set escalation policy for blocked launches",
        ],
        "success_metrics": [
            "Median go-live <= 14 days",
            "Onboarding CSAT >= 95%",
        ],
        "risks": [
            "Quality issues under high onboarding load",
            "Playbook drift across segments",
        ],
    },
    {
        "title": "Expand AI Personalization Feature Depth",
        "strategy_type": "product",
        "description": "Deepen recommendation quality with real-time behavioral signals and vertical-specific models.",
        "rationale": "AI personalization is becoming table stakes; depth and measurable uplift will differentiate.",
        "expected_impact": "high",
        "implementation_complexity": "high",
        "timeframe": "long-term",
        "expected_outcomes": [
            "Higher conversion from personalized sessions",
            "Improved average order value",
        ],
        "implementation_steps": [
            "Unify event stream and profile model",
            "Ship model evaluation dashboards",
            "Roll out A/B testing by segment",
        ],
        "success_metrics": [
            "Conversion uplift >= 12%",
            "AOV uplift >= 8%",
        ],
        "risks": [
            "Model bias and explainability concerns",
            "Privacy compliance overhead",
        ],
    },
]

for row in advantages:
    CompetitiveAdvantage.objects.create(**row)

for row in strategies:
    MarketStrategyRecommendation.objects.create(**row)

print({
    "advantages_created": len(advantages),
    "strategies_created": len(strategies),
})
