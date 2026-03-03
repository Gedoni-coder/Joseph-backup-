import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  TextRun,
} from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { BusinessPlan } from "./business-planning-types";

export async function exportBusinessPlanToDocx(
  businessPlan: BusinessPlan,
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: `${businessPlan.businessName} - Business Plan`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            bold: true,
            size: 28,
          }),

          new Paragraph({
            text: `Created: ${new Date(businessPlan.createdAt).toLocaleDateString()}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            italics: true,
          }),

          // Executive Summary
          new Paragraph({
            text: "1. Executive Summary & Company Overview",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          ...formatContent(
            businessPlan.fullDocument.executiveSummary ||
              businessPlan.steps[0].content?.content ||
              "",
          ),

          // Problem Statement
          new Paragraph({
            text: "2. Problem Statement & Value Proposition",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.problemStatement || "To be completed",
            spacing: { after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.valueProposition || "To be completed",
            spacing: { after: 100 },
          }),

          // Product/Service
          new Paragraph({
            text: "3. Product/Service Description",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.productServiceDescription ||
              "To be completed",
            spacing: { after: 100 },
          }),

          // Business Model
          new Paragraph({
            text: "4. Business Model",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: businessPlan.fullDocument.businessModel || "To be completed",
            spacing: { after: 100 },
          }),

          // Market Analysis
          new Paragraph({
            text: "5. Market Analysis",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: businessPlan.fullDocument.marketAnalysis || "To be completed",
            spacing: { after: 100 },
          }),

          // Competitive Analysis
          new Paragraph({
            text: "6. Competitive Analysis",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.competitiveAnalysis ||
              "To be completed",
            spacing: { after: 100 },
          }),

          // Operations Plan
          new Paragraph({
            text: "7. Operations Plan",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: businessPlan.fullDocument.operationsPlan || "To be completed",
            spacing: { after: 100 },
          }),

          // Financial Projections
          new Paragraph({
            text: "8. Financial Projections",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.financialProjections ||
              "To be completed",
            spacing: { after: 100 },
          }),

          // Funding Requirements
          new Paragraph({
            text: "9. Funding Requirements",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.fundingRequirements ||
              "To be completed",
            spacing: { after: 100 },
          }),

          // Go-To-Market Strategy
          new Paragraph({
            text: "10. Go-To-Market Strategy",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text:
              businessPlan.fullDocument.goToMarketStrategy || "To be completed",
            spacing: { after: 100 },
          }),

          // Footer
          new Paragraph({
            text: `---`,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: `Document generated by Joseph AI Business Planning System`,
            alignment: AlignmentType.CENTER,
            italics: true,
            size: 18,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function exportBusinessPlanToPdf(
  businessPlan: BusinessPlan,
): Promise<void> {
  const htmlContent = generateHtmlContent(businessPlan);

  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.width = "210mm";
  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Convert to JPEG instead of PNG for better compatibility with jsPDF
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(`${businessPlan.businessName}-business-plan.pdf`);
  } catch (error) {
    console.error("PDF export error:", error);
    // Fallback: try downloading as DOCX instead
    try {
      const blob = await exportBusinessPlanToDocx(businessPlan);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${businessPlan.businessName}-business-plan.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("Fallback: DOCX export successful");
    } catch (fallbackError) {
      console.error("Fallback DOCX export also failed:", fallbackError);
      throw fallbackError;
    }
  } finally {
    document.body.removeChild(element);
  }
}

export async function downloadBusinessPlan(
  businessPlan: BusinessPlan,
  format: "docx" | "pdf" | "word",
): Promise<void> {
  if (format === "pdf") {
    await exportBusinessPlanToPdf(businessPlan);
  } else if (format === "docx" || format === "word") {
    const blob = await exportBusinessPlanToDocx(businessPlan);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${businessPlan.businessName}-business-plan.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

function formatContent(content: string): Paragraph[] {
  if (!content)
    return [new Paragraph({ text: "Content to be completed", italics: true })];

  const lines = content.split("\n");
  return lines.map(
    (line) =>
      new Paragraph({
        text: line,
        spacing: { after: 100 },
      }),
  );
}

function generateHtmlContent(businessPlan: BusinessPlan): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          h1 { color: #1e40af; text-align: center; margin-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
          p { margin: 10px 0; }
          .meta { text-align: center; color: #666; font-size: 12px; margin-bottom: 30px; }
          .section { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>${businessPlan.businessName} - Business Plan</h1>
        <div class="meta">
          <p>Created: ${new Date(businessPlan.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>1. Executive Summary & Company Overview</h2>
          <p>${escapeHtml(businessPlan.fullDocument.executiveSummary || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>2. Problem Statement & Value Proposition</h2>
          <p><strong>Problem:</strong> ${escapeHtml(businessPlan.fullDocument.problemStatement || "To be completed")}</p>
          <p><strong>Value Proposition:</strong> ${escapeHtml(businessPlan.fullDocument.valueProposition || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>3. Product/Service Description</h2>
          <p>${escapeHtml(businessPlan.fullDocument.productServiceDescription || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>4. Business Model</h2>
          <p>${escapeHtml(businessPlan.fullDocument.businessModel || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>5. Market Analysis</h2>
          <p>${escapeHtml(businessPlan.fullDocument.marketAnalysis || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>6. Competitive Analysis</h2>
          <p>${escapeHtml(businessPlan.fullDocument.competitiveAnalysis || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>7. Operations Plan</h2>
          <p>${escapeHtml(businessPlan.fullDocument.operationsPlan || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>8. Financial Projections</h2>
          <p>${escapeHtml(businessPlan.fullDocument.financialProjections || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>9. Funding Requirements</h2>
          <p>${escapeHtml(businessPlan.fullDocument.fundingRequirements || "To be completed")}</p>
        </div>

        <div class="section">
          <h2>10. Go-To-Market Strategy</h2>
          <p>${escapeHtml(businessPlan.fullDocument.goToMarketStrategy || "To be completed")}</p>
        </div>

        <hr />
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          Document generated by Joseph AI Business Planning System
        </p>
      </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
