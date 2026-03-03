import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { type RevenueStream } from "./revenue-data";

interface Bottleneck {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  impact: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  projectedImpact: number;
  projectedImpactUnit: string;
  difficulty: "easy" | "medium" | "hard";
  timeframe: string;
  action: string;
}

export async function generateOptimizationPlanPDF(
  stream: RevenueStream,
  bottlenecks: Bottleneck[],
  recommendations: Recommendation[],
  selectedRecommendations: string[]
): Promise<void> {
  const selectedRecs = recommendations.filter((r) =>
    selectedRecommendations.includes(r.id)
  );
  const totalProjectedImpact = selectedRecs.reduce(
    (sum, rec) => sum + rec.projectedImpact,
    0
  );

  // Create a temporary div to hold the HTML content
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  container.style.padding = "40px";
  container.style.fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif";
  container.style.fontSize = "14px";
  container.style.color = "#1f2937";
  container.style.lineHeight = "1.6";

  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Revenue Stream Optimization Plan</h1>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Generated on ${new Date().toLocaleDateString()}</p>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;"><strong>Stream:</strong> ${stream.name} (${stream.type})</p>
    </div>

    <h2 style="color: #1e40af; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">Current Performance Metrics</h2>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Current Revenue</div>
        <div style="color: #1f2937; font-size: 20px; font-weight: bold;">$${(stream.currentRevenue / 1000000).toFixed(1)}M</div>
      </div>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Growth Target</div>
        <div style="color: #1f2937; font-size: 20px; font-weight: bold;">${stream.growth}%</div>
      </div>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Margin</div>
        <div style="color: #1f2937; font-size: 20px; font-weight: bold;">${stream.margin}%</div>
      </div>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Customers</div>
        <div style="color: #1f2937; font-size: 20px; font-weight: bold;">${stream.customers.toLocaleString()}</div>
      </div>
    </div>

    ${
      bottlenecks.length > 0
        ? `
      <h2 style="color: #1e40af; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">Performance Bottlenecks</h2>
      ${bottlenecks
        .map(
          (b) => `
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
          <div style="color: #991b1b; font-weight: bold; margin-bottom: 8px;">${b.title}</div>
          <div style="color: #7f1d1d; font-size: 14px; margin-bottom: 5px;">${b.description}</div>
          <div style="font-size: 12px; color: #7f1d1d;">Impact Area: ${b.impact}</div>
        </div>
      `
        )
        .join("")}
    `
        : ""
    }

    <h2 style="color: #1e40af; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">Selected Implementation Recommendations</h2>
    ${
      selectedRecs.length > 0
        ? `
      <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <div style="color: #047857; font-size: 14px; margin-bottom: 10px;">Total Projected Annual Impact</div>
        <div style="color: #059669; font-size: 32px; font-weight: bold;">+$${(totalProjectedImpact / 1000000).toFixed(2)}M</div>
      </div>

      ${selectedRecs
        .map(
          (r) => `
        <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
          <div style="color: #0c4a6e; font-weight: bold; margin-bottom: 8px;">${r.title}</div>
          <div style="color: #0c4a6e; font-size: 14px; margin-bottom: 8px;">${r.description}</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 12px; color: #0c4a6e;">
            <div style="background: white; padding: 8px; border-radius: 4px;">
              <div style="font-weight: bold; margin-bottom: 2px; color: #0284c7;">Projected Impact</div>
              <div>+$${(r.projectedImpact / 1000000).toFixed(2)}M</div>
            </div>
            <div style="background: white; padding: 8px; border-radius: 4px;">
              <div style="font-weight: bold; margin-bottom: 2px; color: #0284c7;">Implementation Difficulty</div>
              <div>${r.difficulty}</div>
            </div>
            <div style="background: white; padding: 8px; border-radius: 4px;">
              <div style="font-weight: bold; margin-bottom: 2px; color: #0284c7;">Timeframe</div>
              <div>${r.timeframe}</div>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    `
        : "<p style='color: #6b7280;'>No recommendations selected for implementation.</p>"
    }

    <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
      <h2 style="color: #1e40af; font-size: 20px; margin-top: 0; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">Implementation Timeline</h2>
      <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start;">
        <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">Week 1: Review & Planning</div>
          <div style="color: #6b7280; font-size: 14px;">Review selected recommendations and develop detailed implementation plan</div>
        </div>
      </div>
      <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start;">
        <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">Week 2-4: Implementation</div>
          <div style="color: #6b7280; font-size: 14px;">Execute implementation activities across all selected recommendations</div>
        </div>
      </div>
      <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start;">
        <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">Month 2-3: Monitoring</div>
          <div style="color: #6b7280; font-size: 14px;">Track progress and measure impact against projected improvements</div>
        </div>
      </div>
      <div style="display: flex; gap: 15px; margin-bottom: 0; align-items: flex-start;">
        <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">4</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">Month 3+: Optimization</div>
          <div style="color: #6b7280; font-size: 14px;">Fine-tune implementation and scale successful initiatives</div>
        </div>
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      <p>This optimization plan was automatically generated based on comparative analysis of your revenue stream performance against portfolio benchmarks.</p>
      <p>For questions or implementation support, contact your revenue strategy team.</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL("image/png");

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Save PDF
    const filename = `optimization-plan-${stream.name}-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}
