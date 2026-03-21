import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply theme immediately to prevent flash
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

initializeTheme();

// Suppress recharts defaultProps warnings (library uses deprecated React pattern)
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const firstArg = String(args[0] || "");
  const secondArg = String(args[1] || "");

  // Filter out recharts defaultProps warnings for XAxis and YAxis
  if (
    firstArg.includes("defaultProps") &&
    (secondArg === "XAxis" || secondArg === "YAxis")
  ) {
    return;
  }

  originalWarn.apply(console, args);
};

/**
 * Auto-login with test user (development mode only)
 * This allows the frontend to authenticate without a login UI in dev environment
 */
async function initializeAuth() {
  // Don't auto-login if there's already a valid token in storage
  const existingToken = localStorage.getItem("authToken");
  if (existingToken) {
    return;
  }

  // In production, this would be skipped entirely
  if (import.meta.env.PROD) {
    return;
  }

  try {
    const response = await fetch("/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "testuser123"
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        console.log("✓ Auto-authenticated with test user");
      }
    } else {
      console.warn("⚠️  Auto-authentication failed. Run: python seed_test_user.py");
    }
  } catch (error) {
    console.error("⚠️  Auto-authentication error:", error);
  }
}

// Initialize authentication before rendering
initializeAuth().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});

