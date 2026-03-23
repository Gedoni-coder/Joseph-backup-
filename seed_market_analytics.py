#!/usr/bin/env python
"""
Seed script for Market Analysis Module
Populates the database with initial market analysis data
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import (
    Competitor, MarketTrend,
    MarketSize, CustomerSegmentData, MarketDemandForecast, IndustryInsight,
    MarketSummary, MarketRecommendation, MarketActionItem, MarketNextStep,
    SWOTAnalysis, ProductComparison, MarketPosition, CompetitiveAdvantage,
    MarketStrategyRecommendation, ReportNote
)


def seed_competitors():
    """Seed competitor data for overview and competitive tabs"""
    if Competitor.objects.exists():
        print("Competitors already exist, skipping...")
        return

    competitors = [
        Competitor(
            name="GlobalTech Inc",
            description="Global enterprise commerce and marketplace platform",
            competitor_type="direct",
            market_share=25.5,
            strengths="Brand recognition, enterprise integrations, scale",
            weaknesses="High implementation cost, slower support",
            website="https://globaltech.example.com",
        ),
        Competitor(
            name="StartupX",
            description="Fast-moving digital commerce platform for SMBs",
            competitor_type="direct",
            market_share=12.3,
            strengths="Agility, modern UX, low setup friction",
            weaknesses="Limited enterprise capabilities",
            website="https://startupx.example.com",
        ),
        Competitor(
            name="Enterprise Solutions Ltd",
            description="Enterprise-focused B2B/B2C commerce suite",
            competitor_type="direct",
            market_share=18.7,
            strengths="Industry vertical templates, partner ecosystem",
            weaknesses="Complex onboarding",
            website="https://enterprise-solutions.example.com",
        ),
    ]

    for competitor in competitors:
        competitor.save()
    print(f"✓ Created {len(competitors)} competitor records")


def seed_market_trends():
    """Seed market trend data for overview tab"""
    if MarketTrend.objects.exists():
        print("Market trends already exist, skipping...")
        return

    trends = [
        MarketTrend(
            name="Digital Transformation",
            description="Organizations continue accelerating digital-first commerce capabilities.",
            category="technology",
            impact="high",
            direction="positive",
            timeframe="2025",
            sources=["Gartner Research", "McKinsey Digital"],
            confidence=80,
        ),
        MarketTrend(
            name="Remote Work Revolution",
            description="Distributed teams are increasing demand for cloud-native commerce operations.",
            category="consumer_behavior",
            impact="high",
            direction="positive",
            timeframe="2025",
            sources=["Forrester", "Global Workplace Analytics"],
            confidence=80,
        ),
        MarketTrend(
            name="Data Privacy Regulations",
            description="Privacy and compliance requirements shape platform architecture decisions.",
            category="regulatory",
            impact="medium",
            direction="negative",
            timeframe="2025",
            sources=["IAPP", "EU Regulatory Briefing"],
            confidence=80,
        ),
    ]

    for trend in trends:
        trend.save()
    print(f"✓ Created {len(trends)} market trend records")

def seed_market_sizes():
    """Seed market size data"""
    if MarketSize.objects.exists():
        print("Market sizes already exist, skipping...")
        return
    
    sizes = [
        MarketSize(
            name="Total Market - E-commerce Platform",
            description="Complete addressable market for e-commerce platforms",
            tam=8500.0,  # $8.5B
            sam=2500.0,  # $2.5B
            som=500.0,   # $500M
            growth_rate=18.5,
            timeframe="2025",
            currency="USD",
            region="Global"
        ),
    ]
    
    for size in sizes:
        size.save()
    print(f"✓ Created {len(sizes)} market size records")


def seed_customer_segments():
    """Seed customer segment data"""
    if CustomerSegmentData.objects.exists():
        print("Customer segments already exist, skipping...")
        return
    
    segments = [
        CustomerSegmentData(
            name="Enterprise E-commerce",
            description="Large organizations with complex multi-channel needs",
            market_size=1200.0,
            percentage_of_total=48.0,
            avg_spending=150000.0,
            growth_rate=14.2,
            characteristics=["High volume", "Complex integrations", "Premium support required"],
            region="Global",
            priority="high"
        ),
        CustomerSegmentData(
            name="Mid-Market Retailers",
            description="Mid-sized retailers expanding online presence",
            market_size=800.0,
            percentage_of_total=32.0,
            avg_spending=50000.0,
            growth_rate=22.5,
            characteristics=["Growing omnichannel", "Mobile-first", "Cost-sensitive"],
            region="Global",
            priority="high"
        ),
        CustomerSegmentData(
            name="Small & Growing Businesses",
            description="Small businesses and startups launching online",
            market_size=500.0,
            percentage_of_total=20.0,
            avg_spending=15000.0,
            growth_rate=35.0,
            characteristics=["Startup mentality", "Budget-conscious", "Modern tech stack"],
            region="Global",
            priority="medium"
        ),
    ]
    
    for segment in segments:
        segment.save()
    print(f"✓ Created {len(segments)} customer segment records")


def seed_demand_forecasts():
    """Seed demand forecast data"""
    if MarketDemandForecast.objects.exists():
        print("Demand forecasts already exist, skipping...")
        return
    
    forecasts = [
        MarketDemandForecast(
            segment="Enterprise E-commerce",
            period="Q1 2025",
            current_demand=250.0,
            forecasted_demand=285.0,
            confidence_level=85,
            assumptions="Based on historical growth and market expansion",
            key_factors=[
                {"name": "Expansion in cross-border commerce", "impact": 14.5, "weight": 0.4},
                {"name": "AI-assisted merchandising", "impact": 9.2, "weight": 0.35},
                {"name": "Integration complexity", "impact": -4.8, "weight": 0.25},
            ],
            scenarios=[
                {"name": "Base Case", "probability": 60, "demand": 285},
                {"name": "Upside", "probability": 25, "demand": 320},
                {"name": "Downside", "probability": 15, "demand": 250},
            ],
            seasonality_factor=1.1
        ),
        MarketDemandForecast(
            segment="Mid-Market Retailers",
            period="Q1 2025",
            current_demand=160.0,
            forecasted_demand=195.0,
            confidence_level=80,
            assumptions="Increased adoption of omnichannel solutions",
            key_factors=[
                {"name": "Omnichannel rollout", "impact": 17.0, "weight": 0.45},
                {"name": "Mobile-first checkout", "impact": 11.3, "weight": 0.3},
                {"name": "Cost pressure", "impact": -6.1, "weight": 0.25},
            ],
            scenarios=[
                {"name": "Base Case", "probability": 55, "demand": 195},
                {"name": "Upside", "probability": 30, "demand": 225},
                {"name": "Downside", "probability": 15, "demand": 170},
            ],
            seasonality_factor=1.15
        ),
        MarketDemandForecast(
            segment="Small & Growing Businesses",
            period="Q1 2025",
            current_demand=130.0,
            forecasted_demand=165.0,
            confidence_level=75,
            assumptions="Rising mobile commerce and startup activity",
            key_factors=[
                {"name": "Startup formation growth", "impact": 18.6, "weight": 0.4},
                {"name": "Low-code platform adoption", "impact": 12.0, "weight": 0.35},
                {"name": "Funding volatility", "impact": -5.7, "weight": 0.25},
            ],
            scenarios=[
                {"name": "Base Case", "probability": 60, "demand": 165},
                {"name": "Upside", "probability": 20, "demand": 190},
                {"name": "Downside", "probability": 20, "demand": 145},
            ],
            seasonality_factor=1.2
        ),
    ]
    
    for forecast in forecasts:
        forecast.save()
    print(f"✓ Created {len(forecasts)} demand forecast records")


def seed_industry_insights():
    """Seed industry insight data"""
    if IndustryInsight.objects.exists():
        print("Industry insights already exist, skipping...")
        return
    
    insights = [
        IndustryInsight(
            title="Digital Transformation Accelerating",
            description="The shift to digital-first commerce continues to accelerate with mobile commerce representing 45% of all online sales",
            insight_type="trend",
            impact_level="high",
            timeframe="Q1 2025",
            probability=88,
            action_items=[
                "Prioritize mobile-first checkout optimization",
                "Expand digital onboarding for merchants",
            ],
            sources=["Gartner Research", "eMarketer"]
        ),
        IndustryInsight(
            title="AI-Powered Personalization Becoming Standard",
            description="Leading platforms are implementing AI-driven personalization engines, creating competitive pressure across the market",
            insight_type="trend",
            impact_level="high",
            timeframe="Q1 2025",
            probability=83,
            action_items=[
                "Launch recommendation engine MVP",
                "Instrument user behavior for training data",
            ],
            sources=["Forrester Wave", "Industry Reports"]
        ),
        IndustryInsight(
            title="Customer Retention Costs Rising",
            description="Customer acquisition costs continue to rise while retention becomes more critical for profitability",
            insight_type="opportunity",
            impact_level="high",
            timeframe="Q1 2025",
            probability=79,
            action_items=[
                "Build loyalty and retention playbooks",
                "Improve lifecycle messaging automation",
            ],
            sources=["McKinsey", "HubSpot Research"]
        ),
        IndustryInsight(
            title="Regional Market Consolidation",
            description="Expect continued consolidation among regional players seeking to compete with global platforms",
            insight_type="threat",
            impact_level="medium",
            timeframe="Q1 2025",
            probability=72,
            action_items=[
                "Track M&A activity by region",
                "Evaluate strategic partnerships in key geographies",
            ],
            sources=["Industry Analysis", "M&A Trends"]
        ),
    ]
    
    for insight in insights:
        insight.save()
    print(f"✓ Created {len(insights)} industry insight records")


def seed_market_summary():
    """Seed market summary"""
    if MarketSummary.objects.exists():
        print("Market summary already exists, skipping...")
        return
    
    summary = MarketSummary(
        title="Market Analysis Summary",
        content="""MARKET OVERVIEW
Total addressable market (TAM) stands at approximately $8.5B with an average growth rate of 18.5% across segments. The market is characterized by strong growth momentum, digital transformation, and increasing consolidation among mid-market players.

CUSTOMER SEGMENTATION
Three distinct customer segments have been identified with varying needs and willingness to pay:
- Enterprise E-commerce (48% market share): Focus on complex integrations and premium support
- Mid-Market Retailers (32% market share): Growing omnichannel requirements
- Small & Growing Businesses (20% market share): Rapid growth at 35% CAGR, cost-sensitive

COMPETITIVE LANDSCAPE
The market shows differentiation between pure-play digital-first platforms and diversified incumbents transitioning to e-commerce. Our unique value proposition addresses underserved mid-market segments with strong growth potential.

MARKET TRENDS
Key trends shaping the market:
- Digital transformation at 18.5% CAGR
- AI-powered personalization becoming standard
- Rising customer acquisition costs
- Increasing regional consolidation
- Mobile-first solutions commanding premium valuations

STRATEGIC POSITIONING
Our competitive position is differentiated through superior customer service, faster innovation cycles, and specialized focus on mid-market needs. Market share growth is achievable through selective expansion into adjacent segments and vertical specialization.""",
        key_points=[
            "TAM of $8.5B with 18.5% growth rate",
            "Strongest growth in Small & Growing Business segment (35% CAGR)",
            "Digital transformation and AI personalization driving competitive differentiation",
            "Consolidation opportunity in underserved mid-market segment"
        ]
    )
    summary.save()
    print("✓ Created market summary")


def seed_recommendations():
    """Seed market recommendations"""
    if MarketRecommendation.objects.exists():
        print("Recommendations already exist, skipping...")
        return
    
    recommendations = [
        MarketRecommendation(
            title="Accelerate Mid-Market Expansion",
            description="Focus go-to-market efforts on mid-market retailers experiencing 22.5% CAGR growth. This segment has the highest growth potential with lower competitive intensity than enterprise segment.",
            priority="high",
            implementation_timeline="Q1-Q2 2025",
            expected_impact="25-30% revenue growth from segment"
        ),
        MarketRecommendation(
            title="Build AI-Powered Personalization",
            description="Invest in AI-driven personalization engine to match competitor capabilities and meet market expectations. This is becoming table-stakes for competitive positioning.",
            priority="high",
            implementation_timeline="Q2-Q3 2025",
            expected_impact="15-20% improvement in customer retention"
        ),
        MarketRecommendation(
            title="Develop Vertical Solutions",
            description="Create specialized solutions for vertical markets (fashion, home & garden, electronics) to differentiate from horizontal platforms",
            priority="medium",
            implementation_timeline="Q3-Q4 2025",
            expected_impact="10-15% improvement in win rates"
        ),
        MarketRecommendation(
            title="Strengthen Customer Retention Programs",
            description="Rising acquisition costs make retention increasingly important. Implement proactive customer success programs and loyalty initiatives.",
            priority="high",
            implementation_timeline="Q1 2025",
            expected_impact="20% improvement in customer lifetime value"
        ),
    ]
    
    for rec in recommendations:
        rec.save()
    print(f"✓ Created {len(recommendations)} recommendation records")


def seed_action_items():
    """Seed action items"""
    if MarketActionItem.objects.exists():
        print("Action items already exist, skipping...")
        return
    
    actions = [
        MarketActionItem(
            title="Market Segmentation Study",
            description="Conduct detailed market segmentation analysis to identify highest-value customer segments and prioritize go-to-market strategy",
            priority="high",
            timeline="Q1 2025",
            owner="Strategy Team"
        ),
        MarketActionItem(
            title="Competitive Benchmarking",
            description="Establish quarterly competitive benchmarking process to track competitor performance, pricing, and customer perception",
            priority="high",
            timeline="Q1 2025",
            owner="Competitive Intel Team"
        ),
        MarketActionItem(
            title="Value Proposition Enhancement",
            description="Refine and communicate unique value proposition through updated marketing materials and customer-facing messaging",
            priority="medium",
            timeline="Q1-Q2 2025",
            owner="Product Marketing"
        ),
        MarketActionItem(
            title="Customer Win/Loss Analysis",
            description="Conduct win/loss interviews with customers and prospects to understand decision drivers and competitive strengths/weaknesses",
            priority="medium",
            timeline="Q2 2025",
            owner="Sales Leadership"
        ),
    ]
    
    for action in actions:
        action.save()
    print(f"✓ Created {len(actions)} action item records")


def seed_next_steps():
    """Seed next steps"""
    if MarketNextStep.objects.exists():
        print("Next steps already exist, skipping...")
        return
    
    steps = [
        MarketNextStep(
            step="Complete market sizing and TAM/SAM/SOM analysis",
            owner="Strategy Team",
            due_date="End of Week 2",
            status="pending"
        ),
        MarketNextStep(
            step="Conduct competitor SWOT analysis for top 5 competitors",
            owner="Competitive Intel Team",
            due_date="End of Week 3",
            status="pending"
        ),
        MarketNextStep(
            step="Develop customer persona profiles by segment",
            owner="Product Marketing",
            due_date="End of Month",
            status="pending"
        ),
        MarketNextStep(
            step="Present market recommendations to executive team",
            owner="Chief Strategist",
            due_date="Mid-Month Review",
            status="pending"
        ),
    ]
    
    for step in steps:
        step.save()
    print(f"✓ Created {len(steps)} next step records")


def seed_swot_analyses():
    """Seed SWOT analyses for competitors"""
    if SWOTAnalysis.objects.exists():
        print("SWOT analyses already exist, skipping...")
        return
    
    analyses = [
        SWOTAnalysis(
            competitor_name="Shopify",
            strengths=["Strong brand recognition", "Extensive app ecosystem", "Good pricing for SMBs"],
            weaknesses=["Transaction fees can be expensive", "Limited for enterprise complexity"],
            opportunities=["B2B expansion", "Vertical specialization", "Enterprise market"],
            threats=["Amazon competition", "Self-hosted alternatives", "Emerging AI platforms"],
            overall_score=78
        ),
        SWOTAnalysis(
            competitor_name="SAP Commerce Cloud",
            strengths=["Enterprise-grade reliability", "Deep ERP integration", "Global support"],
            weaknesses=["High implementation costs", "Slower innovation", "Complex to customize"],
            opportunities=["Mid-market expansion", "Emerging markets", "Subscription models"],
            threats=["Cloud-native competitors", "Pricing pressure", "Specialist platforms"],
            overall_score=72
        ),
        SWOTAnalysis(
            competitor_name="WooCommerce",
            strengths=["Open source flexibility", "Large community", "Cost-effective"],
            weaknesses=["Requires technical expertise", "Limited native features", "Support variability"],
            opportunities=["Managed hosting services", "AI integrations", "Vertical solutions"],
            threats=["SaaS platform advantages", "Enterprise lock-in", "Consolidation"],
            overall_score=65
        ),
    ]
    
    for swot in analyses:
        swot.save()
    print(f"✓ Created {len(analyses)} SWOT analysis records")


def seed_competitive_advantages():
    """Seed our competitive advantages"""
    if CompetitiveAdvantage.objects.exists():
        print("Competitive advantages already exist, skipping...")
        return
    
    advantages = [
        CompetitiveAdvantage(
            advantage="AI-Powered Personalization Engine",
            description="Built-in ML engine providing real-time product recommendations and personalized shopping experiences",
            advantage_type="technology",
            strength_level="high",
            sustainability=85
        ),
        CompetitiveAdvantage(
            advantage="Vertical Industry Solutions",
            description="Pre-built templates and workflows for fashion, home & garden, electronics, and other high-growth verticals",
            advantage_type="product",
            strength_level="high",
            sustainability=75
        ),
        CompetitiveAdvantage(
            advantage="Superior Customer Success",
            description="Industry-leading 98% customer satisfaction with dedicated success managers for all accounts",
            advantage_type="service",
            strength_level="high",
            sustainability=80
        ),
        CompetitiveAdvantage(
            advantage="Transparent, Simple Pricing",
            description="No hidden fees, transaction-based pricing aligned with customer success, no lock-in contracts",
            advantage_type="price",
            strength_level="medium",
            sustainability=70
        ),
        CompetitiveAdvantage(
            advantage="Fastest Implementation Time",
            description="Average 2-week implementation vs 3-6 months for competitors, 50% faster time-to-value",
            advantage_type="service",
            strength_level="medium",
            sustainability=65
        ),
    ]
    
    for adv in advantages:
        adv.save()
    print(f"✓ Created {len(advantages)} competitive advantage records")


def seed_report_notes():
    """Seed report notes"""
    if ReportNote.objects.exists():
        print("Report notes already exist, skipping...")
        return
    
    notes = [
        ReportNote(
            title="Market Growth Accelerating",
            content="Market growth is accelerating above historical 15% baseline to 18.5% CAGR. This acceleration is driven by digital transformation initiatives and rising e-commerce penetration rates.",
            category="overview",
            importance="high"
        ),
        ReportNote(
            title="Mid-Market is Prime Target",
            content="Mid-market retailers (32% of market) are experiencing 22.5% growth - faster than enterprise (14.2%) and only slightly slower than SMB (35%). This segment offers best ROI for our sales and marketing investments.",
            category="market",
            importance="critical"
        ),
        ReportNote(
            title="AI Personalization is Table Stakes",
            content="Every major competitor now offers AI-powered recommendations. This feature is essential for competitive positioning and directly impacts customer satisfaction and retention.",
            category="competitive",
            importance="high"
        ),
        ReportNote(
            title="Customer Acquisition Costs Rising",
            content="CAC continues to rise 8-12% annually across all segments. This trend makes customer retention and LTV expansion critical for profitability.",
            category="strategy",
            importance="high"
        ),
        ReportNote(
            title="Consolidation Opportunity",
            content="3-5 regional players in key markets are seeking exit opportunities or partnerships. These present acquisition targets for market expansion.",
            category="recommendation",
            importance="medium"
        ),
    ]
    
    for note in notes:
        note.save()
    print(f"✓ Created {len(notes)} report note records")


def main():
    """Main seeding function"""
    print("\n🌱 Starting Market Analysis data seeding...\n")
    
    try:
        seed_competitors()
        seed_market_trends()
        seed_market_sizes()
        seed_customer_segments()
        seed_demand_forecasts()
        seed_industry_insights()
        seed_market_summary()
        seed_recommendations()
        seed_action_items()
        seed_next_steps()
        seed_swot_analyses()
        seed_competitive_advantages()
        seed_report_notes()
        
        print("\n✅ All market analysis data seeded successfully!\n")
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
