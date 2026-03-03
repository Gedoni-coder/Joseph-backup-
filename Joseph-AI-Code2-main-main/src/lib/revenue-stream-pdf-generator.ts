import { type RevenueStream } from "@/lib/revenue-data";

interface RevenueStreamReport extends RevenueStream {
  allStreams: RevenueStream[];
  generatedDate: Date;
}

export async function generateRevenueStreamPDF(
  stream: RevenueStream,
  allStreams: RevenueStream[]
): Promise<void> {
  try {
    const { jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Create container
    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.backgroundColor = "white";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Calculate metrics
    const totalRevenue = allStreams.reduce((sum, s) => sum + s.currentRevenue, 0);
    const revenuePercentage = ((stream.currentRevenue / totalRevenue) * 100).toFixed(1);
    const allStreamsSorted = [...allStreams].sort(
      (a, b) => b.currentRevenue - a.currentRevenue
    );
    const streamRank = allStreamsSorted.findIndex((s) => s.id === stream.id) + 1;

    // Generate comparison metrics for other streams
    const topCompetitors = allStreamsSorted
      .filter((s) => s.id !== stream.id)
      .slice(0, 3)
      .map((s) => ({
        name: s.name,
        revenue: formatCurrency(s.currentRevenue),
        growth: s.growth,
      }));

    // Build recommendations based on stream performance
    const recommendations = generateRecommendations(stream, allStreams);

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <!-- Header -->
        <div style="margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 10px;">REVENUE STREAM ANALYSIS WHITEPAPER</div>
          <h1 style="margin: 0 0 10px 0; color: #1e40af; font-size: 32px; font-weight: bold;">${escapeHtml(stream.name)}</h1>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Comprehensive Analysis & Strategic Recommendations</p>
            <div style="background: #1e40af; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
              TYPE: ${escapeHtml(stream.type.replace("-", " ").toUpperCase())}
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Executive Summary</h2>
          <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; line-height: 1.8;">
            <p style="margin: 0 0 10px 0;">The ${escapeHtml(stream.name)} revenue stream is a critical component of our revenue portfolio. This stream currently contributes <strong>$${formatNumberWithCommas(stream.currentRevenue)}</strong> in annual revenue, representing <strong>${revenuePercentage}%</strong> of total organization revenue and ranking as the <strong>#${streamRank}</strong> revenue stream out of ${allStreams.length} active streams.</p>
            <p style="margin: 0;">With an expected growth rate of <strong>${stream.growth.toFixed(1)}%</strong> and healthy profit margins of <strong>${stream.margin.toFixed(1)}%</strong>, this stream demonstrates strong fundamentals and significant expansion potential. Current customer base of ${stream.customers.toLocaleString()} customers with an average revenue per customer of $${stream.avgRevenuePerCustomer.toLocaleString()} shows consistent monetization quality.</p>
          </div>
        </div>

        <!-- Current Performance Metrics -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Current Performance Metrics</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #1e40af; color: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Metric</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; text-align: right;">Current Value</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; text-align: right;">% of Total</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px; border: 1px solid #ddd;">Annual Revenue</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${formatNumberWithCommas(stream.currentRevenue)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${revenuePercentage}%</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd;">Gross Profit Margin</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${stream.margin.toFixed(1)}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">-</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 12px; border: 1px solid #ddd;">Total Customers</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${stream.customers.toLocaleString()}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">-</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd;">Avg Revenue Per Customer</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${stream.avgRevenuePerCustomer.toLocaleString()}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">-</td>
            </tr>
          </table>
        </div>

        <!-- Growth Forecast -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Growth Forecast & Projections</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #f0f4f8; padding: 20px; border-radius: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">Expected Growth Rate</div>
              <div style="font-size: 32px; font-weight: bold; color: ${stream.growth > 0 ? "#10b981" : "#ef4444"};">${stream.growth > 0 ? "+" : ""}${stream.growth.toFixed(1)}%</div>
              <div style="font-size: 12px; color: #666; margin-top: 10px;">Annual expansion rate based on market trends and historical performance.</div>
            </div>
            <div style="background: #f0f4f8; padding: 20px; border-radius: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">Forecast Revenue</div>
              <div style="font-size: 32px; font-weight: bold; color: #1e40af;">$${formatNumberWithCommas(stream.forecastRevenue)}</div>
              <div style="font-size: 12px; color: #666; margin-top: 10px;">Projected annual revenue following current growth trajectory.</div>
            </div>
          </div>
          <div style="margin-top: 20px; background: #eff6ff; padding: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #1e3a8a;"><strong>Growth Potential:</strong> Based on current trajectory, this revenue stream could reach <strong>$${formatNumberWithCommas(stream.forecastRevenue)}</strong> in the forecast period, representing a <strong>${((stream.forecastRevenue - stream.currentRevenue) / stream.currentRevenue * 100).toFixed(1)}%</strong> increase.</p>
          </div>
        </div>

        <!-- Margin Analysis -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Profitability & Margin Analysis</h2>
          <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="font-size: 48px; font-weight: bold; color: #1e40af;">${stream.margin.toFixed(1)}%</div>
              <div style="margin-left: 20px;">
                <div style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Gross Profit Margin</div>
                <div style="font-size: 13px; color: #444;">This revenue stream maintains healthy profit margins, indicating strong operational efficiency and pricing power.</div>
              </div>
            </div>
            <div style="background: white; height: 10px; border-radius: 5px; overflow: hidden;">
              <div style="width: ${stream.margin}%; height: 100%; background: linear-gradient(90deg, #10b981, #1e40af);"></div>
            </div>
          </div>
          <p style="color: #555; line-height: 1.6; margin: 0;">A ${stream.margin.toFixed(1)}% gross margin indicates that for every dollar of revenue generated, the organization retains ${(stream.margin / 100).toFixed(2)} cents after accounting for direct costs. This is a critical indicator of the stream's underlying profitability and reinvestment capacity.</p>
        </div>

        <!-- Customer Metrics -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Metrics & Economics</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #f0f4f8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #666; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">Active Customers</div>
              <div style="font-size: 28px; font-weight: bold; color: #1e40af;">${stream.customers.toLocaleString()}</div>
            </div>
            <div style="background: #f0f4f8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #666; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">Revenue Per Customer</div>
              <div style="font-size: 28px; font-weight: bold; color: #1e40af;">$${stream.avgRevenuePerCustomer.toLocaleString()}</div>
            </div>
            <div style="background: #f0f4f8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #666; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">Revenue Rank</div>
              <div style="font-size: 28px; font-weight: bold; color: #1e40af;">#${streamRank} of ${allStreams.length}</div>
            </div>
          </div>
          <p style="color: #555; line-height: 1.6; margin: 0;">With ${stream.customers.toLocaleString()} customers generating an average of $${stream.avgRevenuePerCustomer.toLocaleString()} per customer, this stream demonstrates strong unit economics. The customer base provides a stable foundation for growth initiatives.</p>
        </div>

        <!-- Competitive Comparison -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Portfolio Comparison</h2>
          <p style="color: #666; font-size: 13px; margin: 0 0 15px 0;">How this revenue stream compares to other streams in the portfolio:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #1e40af; color: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Revenue Stream</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; text-align: right;">Annual Revenue</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; text-align: right;">Growth Rate</td>
            </tr>
            <tr style="background: #eff6ff; border: 2px solid #1e40af;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #1e40af;">${escapeHtml(stream.name)} (This Stream)</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${formatNumberWithCommas(stream.currentRevenue)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: ${stream.growth > 0 ? "#10b981" : "#ef4444"};">${stream.growth > 0 ? "+" : ""}${stream.growth.toFixed(1)}%</td>
            </tr>
            ${topCompetitors
              .map(
                (competitor, index) =>
                  `<tr style="${index % 2 === 0 ? "background: #f9fafb;" : ""}">
                <td style="padding: 12px; border: 1px solid #ddd;">${escapeHtml(competitor.name)}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${competitor.revenue}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: ${competitor.growth > 0 ? "#10b981" : "#ef4444"};">${competitor.growth > 0 ? "+" : ""}${competitor.growth.toFixed(1)}%</td>
              </tr>`
              )
              .join("")}
          </table>
        </div>

        <!-- Strategic Recommendations -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Strategic Recommendations</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            ${recommendations
              .map(
                (rec, index) =>
                  `<div style="background: #f0f4f8; padding: 15px; border-left: 4px solid ${
                    rec.priority === "high"
                      ? "#ef4444"
                      : rec.priority === "medium"
                        ? "#f59e0b"
                        : "#10b981"
                  }; border-radius: 4px;">
              <div style="font-size: 13px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">${rec.priority.toUpperCase()} PRIORITY</div>
              <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">${escapeHtml(rec.title)}</div>
              <div style="font-size: 12px; color: #666; line-height: 1.6;">${escapeHtml(rec.description)}</div>
            </div>`
              )
              .join("")}
          </div>
        </div>

        <!-- Key Insights -->
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 20px; color: #1e40af; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Key Insights & Opportunities</h2>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 10px; color: #444; line-height: 1.6;"><strong>Revenue Position:</strong> This stream ranks #${streamRank} in the portfolio and accounts for ${revenuePercentage}% of total revenue, making it a cornerstone revenue source.</li>
            <li style="margin-bottom: 10px; color: #444; line-height: 1.6;"><strong>Growth Trajectory:</strong> With projected growth of ${stream.growth.toFixed(1)}%, this stream is ${stream.growth > 15 ? "outperforming" : stream.growth > 5 ? "meeting" : "underperforming"} portfolio averages.</li>
            <li style="margin-bottom: 10px; color: #444; line-height: 1.6;"><strong>Profitability:</strong> A ${stream.margin.toFixed(1)}% margin indicates strong operational efficiency and pricing power in this market segment.</li>
            <li style="margin-bottom: 10px; color: #444; line-height: 1.6;"><strong>Customer Economics:</strong> At $${stream.avgRevenuePerCustomer.toLocaleString()} per customer, this stream demonstrates ${stream.avgRevenuePerCustomer > 2000 ? "premium" : "accessible"} pricing positioning.</li>
            <li style="margin-bottom: 0; color: #444; line-height: 1.6;"><strong>Expansion Potential:</strong> With ${stream.customers.toLocaleString()} customers, there is significant capacity for both customer growth and upsell initiatives.</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 11px; color: #999; text-align: center;">
          <p style="margin: 0 0 5px 0;">Revenue Stream Analysis Whitepaper</p>
          <p style="margin: 0 0 5px 0;">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
          <p style="margin: 0;">Joseph AI - Revenue Strategy & Analysis Platform</p>
        </div>
      </div>
    `;

    container.innerHTML = htmlContent;

    // Convert to PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    const filename = `Revenue_Stream_${stream.name.replace(/\s+/g, "_")}_Whitepaper.pdf`;
    pdf.save(filename);

    document.body.removeChild(container);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate revenue stream PDF");
  }
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

function generateRecommendations(
  stream: RevenueStream,
  allStreams: RevenueStream[]
): Array<{
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}> {
  const recommendations = [];
  const avgGrowth = allStreams.reduce((sum, s) => sum + s.growth, 0) / allStreams.length;
  const avgMargin = allStreams.reduce((sum, s) => sum + s.margin, 0) / allStreams.length;

  // Growth-based recommendations
  if (stream.growth > avgGrowth * 1.2) {
    recommendations.push({
      title: "Accelerate Growth Investments",
      description:
        "This stream is outperforming portfolio averages. Consider increasing marketing and product investment to capitalize on momentum.",
      priority: "high",
    });
  } else if (stream.growth < avgGrowth * 0.8) {
    recommendations.push({
      title: "Revenue Acceleration Initiative",
      description:
        "Growth is lagging portfolio averages. Implement targeted initiatives to improve customer acquisition and retention.",
      priority: "high",
    });
  }

  // Margin-based recommendations
  if (stream.margin > avgMargin) {
    recommendations.push({
      title: "Optimize Pricing Strategy",
      description:
        "Strong margins present an opportunity to expand market share or increase profitability through strategic price optimization.",
      priority: "medium",
    });
  } else if (stream.margin < avgMargin * 0.9) {
    recommendations.push({
      title: "Improve Operational Efficiency",
      description:
        "Margins are below portfolio average. Analyze cost structure and identify opportunities to improve operational efficiency.",
      priority: "high",
    });
  }

  // Customer-based recommendations
  if (stream.customers < 500) {
    recommendations.push({
      title: "Expand Customer Acquisition",
      description:
        "The customer base is relatively small. Develop targeted acquisition campaigns to expand the addressable market.",
      priority: "medium",
    });
  } else {
    recommendations.push({
      title: "Maximize Customer Lifetime Value",
      description:
        "With a substantial customer base, focus on retention, upsell, and cross-sell initiatives to maximize lifetime value.",
      priority: "medium",
    });
  }

  // ARPC-based recommendations
  if (stream.avgRevenuePerCustomer > 3000) {
    recommendations.push({
      title: "Premium Market Development",
      description:
        "High ARPC indicates a premium segment. Expand product offerings and services targeted at this valuable customer segment.",
      priority: "low",
    });
  }

  // Add a final strategic recommendation
  recommendations.push({
    title: "Quarterly Performance Review",
    description:
      "Establish a quarterly review cadence to monitor KPIs, assess market conditions, and adjust strategy as needed.",
    priority: "low",
  });

  return recommendations;
}
