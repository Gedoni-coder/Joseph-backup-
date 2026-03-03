/**
 * Document Processor
 * Extracts text from various document formats using proper libraries
 */

/**
 * Extract text from a File object
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  try {
    if (fileExtension === "pdf") {
      return await extractTextFromPDF(file);
    } else if (fileExtension === "docx") {
      return await extractTextFromDOCX(file);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      return await extractTextFromSpreadsheet(file);
    } else if (fileExtension === "csv") {
      return await extractTextFromCSV(file);
    } else if (fileExtension === "txt") {
      return await file.text();
    } else if (
      ["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension || "")
    ) {
      return await extractTextFromImage(file);
    } else {
      return await extractAsPlainText(file);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to extract text: ${errorMsg}`);
  }
}

/**
 * Extract text from PDF using pdfjs-dist
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    let pdfjs;
    try {
      pdfjs = await import("pdfjs-dist");
    } catch (importError) {
      console.warn("pdfjs-dist not available:", importError);
      return `[PDF] ${file.name}\nPDF extraction library not available. Please use a tool to extract PDF content.`;
    }

    // Set up the worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text.trim() || "No text content found in PDF";
  } catch (error) {
    console.error("PDF extraction error:", error);
    return "Unable to extract text from PDF. The file may be encrypted or corrupted.";
  }
}

/**
 * Extract text from DOCX files using mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    let mammoth;
    try {
      mammoth = await import("mammoth");
    } catch (importError) {
      console.warn("mammoth not available:", importError);
      return `[DOCX] ${file.name}\nWord document extraction library not available. Please use a tool to extract document content.`;
    }
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim() || "No text content found in Word document";
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return "Unable to extract text from Word document. The file may be corrupted.";
  }
}

/**
 * Extract text from spreadsheets (XLSX/XLS) using xlsx
 */
async function extractTextFromSpreadsheet(file: File): Promise<string> {
  try {
    let XLSX;
    try {
      XLSX = await import("xlsx");
    } catch (importError) {
      console.warn("xlsx not available:", importError);
      return `[SPREADSHEET] ${file.name}\nSpreadsheet extraction library not available. Please use a tool to extract spreadsheet content.`;
    }
    const arrayBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    let text = "";

    workbook.SheetNames.forEach((sheet) => {
      const worksheet = workbook.Sheets[sheet];
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      text += `Sheet: ${sheet}\n${csv}\n\n`;
    });

    return text.trim() || "No data found in spreadsheet";
  } catch (error) {
    console.error("Spreadsheet extraction error:", error);
    return "Unable to extract text from spreadsheet. The file may be corrupted.";
  }
}

/**
 * Extract text from CSV files using papaparse
 */
async function extractTextFromCSV(file: File): Promise<string> {
  try {
    let Papa;
    try {
      Papa = await import("papaparse");
    } catch (importError) {
      console.warn("papaparse not available:", importError);
      return `[CSV] ${file.name}\nCSV extraction library not available. Please use a tool to extract CSV content.`;
    }

    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results: any) => {
          const text = results.data
            .map((row: any[]) => row.join(", "))
            .join("\n");
          resolve(text.trim() || "No data found in CSV file");
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("CSV extraction error:", error);
    return "Unable to extract text from CSV file.";
  }
}

/**
 * Extract text from images (limited - returns guidance)
 */
async function extractTextFromImage(file: File): Promise<string> {
  return `[IMAGE DOCUMENT]
File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB
Type: ${file.type}

Note: Image text extraction requires OCR (Optical Character Recognition).

To enable full OCR functionality:
1. Install Tesseract.js: npm install tesseract.js
2. Implement browser-based OCR for image processing
3. Or upload to a server with OCR capabilities (Google Cloud Vision, AWS Textract, Azure Computer Vision)

For now, image processing is limited to metadata extraction.`;
}

/**
 * Try to extract text as plain text
 */
async function extractAsPlainText(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text.trim() || "File appears to be empty";
  } catch (error) {
    console.error("Plain text extraction error:", error);
    return "Unable to read file content. File format may not be supported.";
  }
}

/**
 * Format extracted text for display
 */
export function formatExtractedText(
  text: string,
  maxChars: number = 50000,
): {
  displayText: string;
  fullText: string;
  isTruncated: boolean;
  charCount: number;
  lineCount: number;
} {
  const isTruncated = text.length > maxChars;
  const displayText = text.substring(0, maxChars);
  const lineCount = text.split("\n").length;

  return {
    displayText,
    fullText: text,
    isTruncated,
    charCount: text.length,
    lineCount,
  };
}

/**
 * Get file type icon and label
 */
export function getFileTypeInfo(fileType: string): {
  icon: string;
  label: string;
  extractionCapability: "full" | "partial" | "server-only" | "metadata";
} {
  const lowerType = fileType.toLowerCase();

  if (lowerType.includes("pdf")) {
    return {
      icon: "📄",
      label: "PDF",
      extractionCapability: "full",
    };
  } else if (
    lowerType.includes("word") ||
    lowerType.includes("document") ||
    lowerType.includes("wordprocessingml")
  ) {
    return {
      icon: "📝",
      label: "Word Document",
      extractionCapability: "full",
    };
  } else if (
    lowerType.includes("spreadsheet") ||
    lowerType.includes("excel") ||
    lowerType.includes("sheet")
  ) {
    return {
      icon: "📊",
      label: "Spreadsheet",
      extractionCapability: "full",
    };
  } else if (lowerType.includes("csv")) {
    return {
      icon: "📊",
      label: "CSV",
      extractionCapability: "full",
    };
  } else if (lowerType.includes("text")) {
    return {
      icon: "📄",
      label: "Text File",
      extractionCapability: "full",
    };
  } else if (lowerType.startsWith("image/")) {
    return {
      icon: "🖼️",
      label: "Image",
      extractionCapability: "server-only",
    };
  } else if (lowerType === "application/json") {
    return {
      icon: "{ }",
      label: "JSON",
      extractionCapability: "full",
    };
  }

  return {
    icon: "📎",
    label: "Document",
    extractionCapability: "partial",
  };
}
