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

createRoot(document.getElementById("root")!).render(<App />);
