/**
 * Collects all available app data from localStorage, state, and DOM
 * to provide comprehensive context to the chatbot
 */

export interface AppContextData {
  businessFeasibility: any[];
  courses: any[];
  quizzes: any[];
  conversationalMode: boolean;
  userSettings: Record<string, any>;
  pageContext: string;
  recentData: string;
  timestamp: string;
}

export function getAllAppData(): AppContextData {
  const context: AppContextData = {
    businessFeasibility: [],
    courses: [],
    quizzes: [],
    conversationalMode: false,
    userSettings: {},
    pageContext: "general",
    recentData: "",
    timestamp: new Date().toISOString(),
  };

  // Collect Business Feasibility data
  try {
    const feasibilityKey = "joseph_feasibility_reports";
    const feasibilityData = localStorage.getItem(feasibilityKey);
    if (feasibilityData) {
      context.businessFeasibility = JSON.parse(feasibilityData);
    }
  } catch (e) {
    console.error("Error loading feasibility data:", e);
  }

  // Collect Course data
  try {
    const coursesData = localStorage.getItem("joseph:courses");
    if (coursesData) {
      context.courses = JSON.parse(coursesData);
    }
  } catch (e) {
    console.error("Error loading courses:", e);
  }

  // Collect Quiz data
  try {
    const quizzesData = localStorage.getItem("joseph:quizzes");
    if (quizzesData) {
      context.quizzes = JSON.parse(quizzesData);
    }
  } catch (e) {
    console.error("Error loading quizzes:", e);
  }

  // Collect Conversational Mode setting
  try {
    const mode = localStorage.getItem("conversationalMode");
    context.conversationalMode = mode === "true";
  } catch (e) {
    console.error("Error loading conversational mode:", e);
  }

  // Collect signup email if available
  try {
    const email = localStorage.getItem("joseph:signupEmail");
    if (email) {
      context.userSettings.email = email;
    }
  } catch (e) {
    console.error("Error loading user email:", e);
  }

  // Get current page context from URL
  try {
    const pathname = window.location.pathname;
    if (pathname.includes("business-feasibility")) {
      context.pageContext = "business-feasibility";
    } else if (pathname.includes("business-forecast")) {
      context.pageContext = "business-forecast";
    } else if (pathname.includes("tax-compliance")) {
      context.pageContext = "tax-compliance";
    } else if (pathname.includes("pricing-strategy")) {
      context.pageContext = "pricing-strategy";
    } else if (pathname.includes("revenue-strategy")) {
      context.pageContext = "revenue-strategy";
    } else if (pathname.includes("market-competitive-analysis")) {
      context.pageContext = "market-analysis";
    } else if (pathname.includes("financial-advisory")) {
      context.pageContext = "financial-advisory";
    } else if (pathname.includes("loan-funding")) {
      context.pageContext = "loan-funding";
    } else if (pathname.includes("inventory-supply-chain")) {
      context.pageContext = "inventory-supply-chain";
    } else if (pathname.includes("policy")) {
      context.pageContext = "policy-analysis";
    } else if (pathname.includes("learn")) {
      context.pageContext = "learning";
    }
  } catch (e) {
    console.error("Error determining page context:", e);
  }

  // Collect visible page data from DOM (text content, structured data)
  try {
    const pageText = document.body.innerText.substring(0, 5000);
    const metaTags = Array.from(
      document.querySelectorAll("meta[name], meta[property]"),
    )
      .map(
        (tag) =>
          `${tag.getAttribute("name") || tag.getAttribute("property")}: ${tag.getAttribute("content")}`,
      )
      .join("\n");

    context.recentData = `Current Page Context:\n${pageText}\n\nMeta Info:\n${metaTags}`;
  } catch (e) {
    console.error("Error collecting page data:", e);
  }

  return context;
}

export function formatContextForPrompt(data: AppContextData): string {
  const sections: string[] = [];

  sections.push("=== USER CONTEXT ===");
  if (data.userSettings.email) {
    sections.push(`User Email: ${data.userSettings.email}`);
  }
  sections.push(
    `Conversational Mode: ${data.conversationalMode ? "Enabled" : "Disabled"}`,
  );
  sections.push(`Current Page: ${data.pageContext}`);

  if (data.businessFeasibility.length > 0) {
    sections.push("\n=== BUSINESS FEASIBILITY DATA ===");
    sections.push(`Total Ideas Analyzed: ${data.businessFeasibility.length}`);
    data.businessFeasibility.slice(0, 3).forEach((item: any, idx) => {
      sections.push(
        `Idea ${idx + 1}: ${item.idea} (${item.verdict}, Score: ${item.score})`,
      );
    });
  }

  if (data.courses.length > 0) {
    sections.push("\n=== LEARNING PROGRESS ===");
    sections.push(`Courses Accessed: ${data.courses.length}`);
    data.courses.slice(0, 3).forEach((course: any) => {
      sections.push(`- ${course.title}: ${course.description}`);
    });
  }

  if (data.quizzes.length > 0) {
    sections.push("\n=== QUIZ PERFORMANCE ===");
    const completed = data.quizzes.filter((q: any) => q.submitted).length;
    sections.push(`Quizzes Completed: ${completed}/${data.quizzes.length}`);
  }

  sections.push("\n=== CURRENT PAGE CONTENT ===");
  sections.push(data.recentData.substring(0, 3000));

  return sections.join("\n");
}

export function summarizeContextForQuery(data: AppContextData): string {
  const summary: string[] = [];

  if (data.businessFeasibility.length > 0) {
    summary.push(
      `User has analyzed ${data.businessFeasibility.length} business ideas`,
    );
  }

  if (data.courses.length > 0) {
    summary.push(`User is taking ${data.courses.length} courses`);
  }

  summary.push(`Currently on ${data.pageContext} page`);

  return summary.join(". ");
}
