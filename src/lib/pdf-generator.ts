/**
 * PDF Generation utility for Market Analysis Reports
 * Uses jsPDF and html2canvas for converting report content to PDF
 */

export interface ReportData {
  id: string;
  title: string;
  summary: string;
  dateGenerated: Date;
  author: string;
  confidence: number;
  keyMetrics: Array<{
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }>;
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}

export async function generateReportPDF(report: ReportData): Promise<void> {
  try {
    // Dynamically import jsPDF to avoid build issues
    const { jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Create a temporary container with the report content
    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.backgroundColor = "white";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Build HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <!-- Header -->
        <div style="margin-bottom: 40px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
          <h1 style="margin: 0 0 10px 0; color: #1e40af; font-size: 28px;">${escapeHtml(report.title)}</h1>
          <p style="margin: 0; color: #666; font-size: 14px;">${escapeHtml(report.summary)}</p>
        </div>

        <!-- Meta Information -->
        <div style="margin-bottom: 30px; background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Generated:</strong> ${report.dateGenerated.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
            <span><strong>Author:</strong> ${escapeHtml(report.author)}</span>
          </div>
          <div>
            <strong>Confidence Level:</strong> ${report.confidence}%
            <div style="width: 100%; height: 6px; background: #ddd; margin-top: 4px; border-radius: 3px;">
              <div style="width: ${report.confidence}%; height: 100%; background: #1e40af; border-radius: 3px;"></div>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e40af; margin: 0 0 15px 0;">Key Metrics</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              ${report.keyMetrics
                .map(
                  (metric) =>
                    `<td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; text-align: center;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${escapeHtml(metric.label)}</div>
                  <div style="font-size: 18px; font-weight: bold; color: #1e40af;">${escapeHtml(metric.value)}</div>
                  <div style="font-size: 11px; color: #999; margin-top: 4px;">${metric.trend}</div>
                </td>`
                )
                .join("")}
            </tr>
          </table>
        </div>

        <!-- Key Insights -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e40af; margin: 0 0 15px 0;">Key Insights</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${report.insights
              .map(
                (insight) =>
                  `<li style="margin-bottom: 8px; color: #444; line-height: 1.6;">${escapeHtml(insight)}</li>`
              )
              .join("")}
          </ul>
        </div>

        <!-- Strategic Recommendations -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e40af; margin: 0 0 15px 0;">Strategic Recommendations</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${report.recommendations
              .map(
                (recommendation) =>
                  `<li style="margin-bottom: 8px; color: #444; line-height: 1.6;">${escapeHtml(recommendation)}</li>`
              )
              .join("")}
          </ul>
        </div>

        <!-- Next Steps -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e40af; margin: 0 0 15px 0;">Next Steps</h2>
          <ol style="margin: 0; padding-left: 20px;">
            ${report.nextSteps
              .map(
                (step) =>
                  `<li style="margin-bottom: 8px; color: #444; line-height: 1.6;">${escapeHtml(step)}</li>`
              )
              .join("")}
          </ol>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #999; text-align: center;">
          <p style="margin: 0;">Joseph AI Market Analysis Platform</p>
          <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    container.innerHTML = htmlContent;

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF, handling multiple pages if necessary
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Save the PDF
    const filename = `Market_Analysis_Report_${report.id}_${new Date().getTime()}.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
}

/**
 * Escape HTML special characters to prevent injection
 */
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
