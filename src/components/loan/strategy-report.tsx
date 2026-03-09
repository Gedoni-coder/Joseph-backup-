import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  type FundingStrategy,
  type LoanEligibility,
  type FundingOption,
} from "@/lib/loan-data";

interface StrategyReportProps {
  fundingStrategy: FundingStrategy;
  eligibility: LoanEligibility;
  fundingOptions: FundingOption[];
}

export function StrategyReportGenerator({
  fundingStrategy,
  eligibility,
  fundingOptions,
}: StrategyReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Get top 2 recommended funding options based on match with business stage
  const getRecommendedFunding = (): FundingOption[] => {
    const stageMapping: { [key: string]: string[] } = {
      startup: ["angel-capital", "crowdfunding", "government-grant"],
      early: ["angel-capital", "bank-loan", "government-grant"],
      growth: ["venture-capital", "bank-loan", "angel-capital"],
      mature: ["bank-loan", "cooperative"],
    };

    const stageTags =
      stageMapping[eligibility.businessStage.toLowerCase()] || [];
    const filtered = fundingOptions
      .filter((opt) => stageTags.includes(opt.type))
      .slice(0, 2);

    // Fallback if not enough matches
    if (filtered.length < 2) {
      return fundingOptions.slice(0, 2);
    }

    return filtered;
  };

  // Identify funding risks based on eligibility
  const getFundingRisks = (): { risk: string; fix: string }[] => {
    const risks: { risk: string; fix: string }[] = [];

    if (eligibility.eligibilityScore < 70) {
      risks.push({
        risk: "Eligibility Score is Low",
        fix: "Improve business financials, increase monthly revenue, and strengthen credit history. Consider working with a business advisor to develop stronger financial projections.",
      });
    }

    if (eligibility.creditScore < 700) {
      risks.push({
        risk: "Limited Credit History",
        fix: "Build credit over next 6-12 months. Pay all bills on time, reduce existing debt, and request credit limit increases from current lenders.",
      });
    }

    if (eligibility.timeInBusiness < 24) {
      risks.push({
        risk: "Limited Business History",
        fix: "Document consistent growth, maintain clean financial records, and develop a strong business track record for the next 6-12 months.",
      });
    }

    if (eligibility.collateralValue < eligibility.monthlyRevenue * 3) {
      risks.push({
        risk: "Insufficient Collateral",
        fix: "Acquire additional business assets, equipment, or inventory that can serve as collateral. Consider a smaller loan amount initially.",
      });
    }

    if (risks.length === 0) {
      risks.push({
        risk: "No Major Risks Identified",
        fix: "Your business is in a strong position. Focus on maintaining current financial performance and documenting growth metrics.",
      });
    }

    return risks;
  };

  // Identify business strengths
  const getBusinessStrengths = (): string[] => {
    const strengths: string[] = [];

    if (eligibility.eligibilityScore >= 80) {
      strengths.push(
        "Strong overall eligibility score justifies investor confidence",
      );
    }

    if (eligibility.creditScore >= 750) {
      strengths.push(
        "Excellent personal credit history demonstrates financial responsibility",
      );
    }

    if (eligibility.monthlyRevenue >= 100000) {
      strengths.push(
        "Strong monthly revenue indicates business traction and market validation",
      );
    }

    if (eligibility.timeInBusiness >= 24) {
      strengths.push(
        "Established business track record with proven operations",
      );
    }

    if (eligibility.collateralValue >= eligibility.yearlyRevenue) {
      strengths.push("Substantial asset base and collateral backing");
    }

    if (eligibility.qualifiedPrograms.length >= 4) {
      strengths.push(
        "Qualified for multiple funding programs increasing options",
      );
    }

    if (strengths.length === 0) {
      strengths.push("Solid business foundation with growth potential");
      strengths.push("Actively improving business operations and metrics");
    }

    return strengths;
  };

  // Get documentation checklist based on business type
  const getDocumentationChecklist = (): string[] => {
    const baseDocuments = [
      "12 months of business bank statements",
      "Business plan or pitch deck",
      "Tax ID documentation",
      "Cashflow projections (3-5 years)",
      "Credit history summary",
    ];

    const industrySpecific: { [key: string]: string[] } = {
      Technology: ["Product roadmap", "User acquisition metrics"],
      Retail: ["Inventory documents", "POS system reports"],
      Manufacturing: [
        "Equipment list and valuation",
        "Supply chain documentation",
      ],
      Services: ["Client contracts", "Service agreements"],
      default: ["Industry certifications", "Compliance documentation"],
    };

    const specific =
      industrySpecific[eligibility.industry] || industrySpecific.default;
    return [...baseDocuments, ...specific];
  };

  // Get capital requirement guidance
  const getCapitalGuidance = (): { range: string; uses: string[] } => {
    const minRevenue = eligibility.monthlyRevenue * 12;
    let capital = 0;

    if (eligibility.businessStage === "startup") {
      capital = minRevenue * 0.5;
    } else if (eligibility.businessStage === "early") {
      capital = minRevenue * 0.3;
    } else if (eligibility.businessStage === "growth") {
      capital = minRevenue * 0.15;
    }

    const min = capital * 0.75;
    const max = capital * 1.25;

    const uses = [
      "Operational expansion and inventory",
      "Team hiring and retention",
      "Technology and equipment upgrades",
      "Marketing and customer acquisition",
      "Working capital buffer",
    ];

    return {
      range: `₦${(min / 1000000).toFixed(1)}M – ₦${(max / 1000000).toFixed(1)}M`,
      uses,
    };
  };

  // Get funding fit summary
  const getFundingFitSummary = (): string => {
    const score = fundingStrategy.readinessScore;
    const stage = eligibility.businessStage;

    if (score >= 85) {
      return `Your ${stage} business is well-positioned for funding. Recommended approach: ${fundingStrategy.recommendedType.toUpperCase()}. With strong financials and ${getRecommendedFunding()[0]?.name || "suitable funding options"}, you can confidently raise ₦${getCapitalGuidance().range.split("–")[1].trim()} without stress.`;
    } else if (score >= 70) {
      return `Your ${stage} business shows good funding potential. Consider addressing key gaps before applying. ${fundingStrategy.recommendedType === "equity" ? "Angel or early-stage VC funding would be ideal." : "Bank loans or government programs are well-suited."} Target ₦${getCapitalGuidance().range.split("–")[0].trim()} – ₦${getCapitalGuidance().range.split("–")[1].trim()}.`;
    } else {
      return `Your ${stage} business has growth potential but needs strengthening before major funding rounds. Focus on improving key metrics, then revisit funding options. ${getRecommendedFunding()[0]?.name || "Government grants and microfinance"} may be good starting points.`;
    }
  };

  const recommendedFunding = getRecommendedFunding();
  const fundingRisks = getFundingRisks();
  const strengths = getBusinessStrengths();
  const capitalGuidance = getCapitalGuidance();
  const checklist = getDocumentationChecklist();

  const generatePDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;
      let pageCount = 1;

      const addText = (
        text: string,
        size: number,
        weight: "bold" | "normal" = "normal",
        color = "#000000",
      ) => {
        pdf.setFontSize(size);
        pdf.setFont(undefined, weight === "bold" ? "bold" : "normal");

        let r = 0,
          g = 0,
          b = 0;
        if (color !== "#000000") {
          r = parseInt(color.slice(1, 3), 16);
          g = parseInt(color.slice(3, 5), 16);
          b = parseInt(color.slice(5, 7), 16);
        }
        pdf.setTextColor(r, g, b);

        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 3;
      };

      const addSection = (title: string, content: string[]) => {
        if (yPosition > 250) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }

        addText(title, 14, "bold", "#0066cc");
        yPosition += 3;

        content.forEach((line) => {
          if (yPosition > 270) {
            pdf.addPage();
            pageCount += 1;
            yPosition = margin;
          }
          addText(line, 10);
        });

        yPosition += 5;
      };

      const addLine = () => {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 3;
      };

      // Title and Header
      pdf.setFontSize(24);
      pdf.setFont(undefined, "bold");
      pdf.setTextColor(25, 25, 112);
      pdf.text("FUNDING STRATEGY REPORT", margin, yPosition);
      yPosition += 12;

      // Subtitle and Score
      addText(
        `${eligibility.businessName} • ${eligibility.businessStage.charAt(0).toUpperCase() + eligibility.businessStage.slice(1)} Stage`,
        11,
      );
      addText(
        `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        9,
      );
      yPosition += 2;

      pdf.setFontSize(32);
      pdf.setFont(undefined, "bold");
      pdf.setTextColor(0, 102, 204);
      pdf.text(
        fundingStrategy.readinessScore.toString(),
        pageWidth - margin - 20,
        margin + 8,
      );
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Readiness Score", pageWidth - margin - 20, margin + 16);

      yPosition = margin + 25;
      addLine();

      // 1. Recommended Funding
      addSection("1. RECOMMENDED FUNDING APPROACH", [
        `For your ${eligibility.businessStage} stage business, the following strategies are recommended:`,
      ]);

      recommendedFunding.forEach((option, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }
        const lines = [
          `${index + 1}. ${option.name}`,
          `Provider: ${option.provider}`,
          `Range: ${formatCurrency(option.minAmount)} - ${formatCurrency(option.maxAmount)} | Processing: ${option.processingTime} days`,
        ];

        lines.forEach((line) => {
          addText(
            line,
            line.includes("Provider") ? 9 : 10,
            line.includes(`${index + 1}.`) ? "bold" : "normal",
          );
        });
        yPosition += 3;
      });

      // 2. Capital Requirement
      addSection("2. CAPITAL REQUIREMENT GUIDANCE", [
        `Recommended Funding Range: ${capitalGuidance.range}`,
        `Based on monthly revenue of ${formatCurrency(eligibility.monthlyRevenue)}, this range avoids over-raising.`,
        `\nUse of Funds:`,
        ...capitalGuidance.uses.map((use) => `• ${use}`),
      ]);

      // 3. Funding Risks
      addSection("3. FUNDING RISKS & WEAK POINTS", [
        `The following areas may impact funding approval:`,
      ]);

      fundingRisks.forEach((risk) => {
        if (yPosition > 250) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }
        addText(`Risk: ${risk.risk}`, 10, "bold", "#cc0000");
        addText(`Fix: ${risk.fix}`, 9);
        yPosition += 2;
      });

      // 4. Business Strengths
      addSection("4. BUSINESS STRENGTHS", [
        `Your business demonstrates the following strengths that justify investor confidence:`,
      ]);

      strengths.forEach((strength) => {
        if (yPosition > 270) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }
        addText(`✓ ${strength}`, 9);
      });

      // 5. Funding Timeline
      if (yPosition > 250) {
        pdf.addPage();
        pageCount += 1;
        yPosition = margin;
      }

      addSection("5. SUGGESTED FUNDING TIMELINE", []);

      fundingStrategy.timeline.forEach((phase, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }

        const phaseText = [
          `Month ${index + 1}: ${phase.phase}`,
          `Timeframe: ${phase.timeframe} | Target: ${formatCurrency(phase.amount)} | Type: ${phase.type}`,
        ];

        phaseText.forEach((text) => {
          addText(
            text,
            text.includes("Month") ? 10 : 9,
            text.includes("Month") ? "bold" : "normal",
          );
        });

        addText(`Milestones:`, 9, "bold");
        phase.milestones.forEach((milestone) => {
          if (yPosition > 270) {
            pdf.addPage();
            pageCount += 1;
            yPosition = margin;
          }
          addText(`• ${milestone}`, 9);
        });
        yPosition += 3;
      });

      // 6. Documentation Checklist
      if (yPosition > 250) {
        pdf.addPage();
        pageCount += 1;
        yPosition = margin;
      }

      addSection("6. DOCUMENTATION CHECKLIST", [
        `Prepare the following documents to support your applications:`,
      ]);

      checklist.forEach((doc) => {
        if (yPosition > 270) {
          pdf.addPage();
          pageCount += 1;
          yPosition = margin;
        }
        addText(`☐ ${doc}`, 9);
      });

      // 7. Funding Fit Summary
      if (yPosition > 240) {
        pdf.addPage();
        pageCount += 1;
        yPosition = margin;
      }

      pdf.setDrawColor(0, 150, 0);
      pdf.setFillColor(240, 255, 240);
      pdf.rect(margin - 5, yPosition - 5, contentWidth + 10, 40, "F");

      addText("7. FUNDING FIT SUMMARY", 12, "bold", "#006600");
      const summaryLines = pdf.splitTextToSize(
        `"${getFundingFitSummary()}"`,
        contentWidth - 5,
      );
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(summaryLines, margin + 2.5, yPosition + 3);

      // Save PDF
      pdf.save(
        `Funding-Strategy-Report-${eligibility.businessName}-${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generatePDF}
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Strategy Report
      </Button>

      {/* Hidden Report Content for PDF Generation */}
      <div
        ref={reportRef}
        className="hidden bg-white p-12 text-gray-900"
        style={{ width: "800px" }}
      >
        {/* Header */}
        <div className="mb-8 border-b-2 border-blue-600 pb-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            FUNDING STRATEGY REPORT
          </h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">
                  {eligibility.businessName}
                </span>
                {" • "}
                <span className="capitalize">
                  {eligibility.businessStage} Stage
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600">
                {fundingStrategy.readinessScore}
              </div>
              <p className="text-gray-600">Readiness Score</p>
            </div>
          </div>
        </div>

        {/* 1. Recommended Funding Approach */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            1. Recommended Funding Approach
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Based on your {eligibility.businessStage} stage business profile, we
            recommend the following funding strategies:
          </p>
          <div className="space-y-3 ml-4">
            {recommendedFunding.map((option, index) => (
              <div key={option.id} className="border-l-4 border-blue-600 pl-4">
                <p className="font-semibold text-gray-900 mb-1">
                  {index + 1}. {option.name}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  Provider: {option.provider}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  {option.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Range:</span>{" "}
                  {formatCurrency(option.minAmount)} –{" "}
                  {formatCurrency(option.maxAmount)} {" | "}
                  <span className="font-semibold">Processing:</span>{" "}
                  {option.processingTime} days
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Capital Requirement Guidance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            2. Capital Requirement Guidance
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Recommended Funding Range
            </p>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              {capitalGuidance.range}
            </p>
            <p className="text-gray-700 mb-4">
              This range is calculated based on your monthly revenue of{" "}
              <span className="font-semibold">
                {formatCurrency(eligibility.monthlyRevenue)}
              </span>{" "}
              and business stage to avoid over-raising or under-raising.
            </p>
          </div>
          <p className="text-gray-900 font-semibold mb-3">Use of Funds:</p>
          <ul className="space-y-2 ml-4">
            {capitalGuidance.uses.map((use, index) => (
              <li key={index} className="text-gray-700 flex">
                <span className="mr-3">•</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Funding Risks & Weak Points */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            3. Funding Risks & Weak Points
          </h2>
          <p className="text-gray-700 mb-4">
            The following areas may impact funding approval. Here's how to
            address each:
          </p>
          <div className="space-y-4">
            {fundingRisks.map((item, index) => (
              <div
                key={index}
                className="border border-red-200 bg-red-50 rounded-lg p-4"
              >
                <p className="font-semibold text-red-900 mb-2">
                  ⚠ {item.risk}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Fix:</span> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Business Strengths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            4. Business Strengths That Improve Funding Odds
          </h2>
          <p className="text-gray-700 mb-4">
            Your business has the following strengths that justify
            investor/lender confidence:
          </p>
          <div className="space-y-2 ml-4">
            {strengths.map((strength, index) => (
              <div key={index} className="flex">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <p className="text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Suggested Funding Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            5. Suggested Funding Timeline
          </h2>
          <div className="space-y-4">
            {fundingStrategy.timeline.map((phase, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4 pb-4">
                <p className="font-bold text-gray-900 mb-1">
                  Month {index + 1}: {phase.phase}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-semibold">Timeframe:</span>{" "}
                  {phase.timeframe}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-semibold">Target Amount:</span>{" "}
                  {formatCurrency(phase.amount)}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-semibold">Type:</span> {phase.type}
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  Milestones:
                </p>
                <ul className="ml-4 text-sm text-gray-700">
                  {phase.milestones.map((milestone, milestoneIndex) => (
                    <li key={milestoneIndex}>• {milestone}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Documentation Checklist */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            6. Documentation Checklist
          </h2>
          <p className="text-gray-700 mb-4">
            Prepare the following documents to support your funding
            applications:
          </p>
          <div className="space-y-2 ml-4">
            {checklist.map((doc, index) => (
              <div key={index} className="flex">
                <input
                  type="checkbox"
                  className="mr-3 mt-0.5"
                  disabled
                  readOnly
                />
                <p className="text-gray-700">{doc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Funding Fit Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            7. Funding Fit Summary
          </h2>
          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6">
            <p className="text-gray-800 leading-relaxed text-lg">
              "{getFundingFitSummary()}"
            </p>
            <p className="text-gray-600 text-sm mt-4">
              This assessment is based on your current business metrics. Update
              your profile regularly for more accurate recommendations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 mt-8 text-center text-gray-600 text-sm">
          <p>This report is generated by Joseph AI Funding Intelligence</p>
          <p className="mt-2">
            For more information visit your funding dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
