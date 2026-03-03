import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChatMessage,
  ModuleContext,
  EconomicTool,
  moduleContexts,
  economicTools,
  generateContextualResponse,
  smartSuggestions,
} from "../lib/chatbot-data";
import { generateAIResponse } from "../lib/ai";
import { extractUrls, fetchWebPageText } from "../lib/web-scraper";

export function useChatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messagesByContext, setMessagesByContext] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentContext, setCurrentContext] = useState<ModuleContext>(
    moduleContexts[0],
  );
  const [selectedTool, setSelectedTool] = useState<EconomicTool | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);

  // Get messages for current context
  const messages = messagesByContext[currentContext.id] || [];

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "timestamp">, contextId?: string) => {
      const targetContext = contextId || currentContext.id;
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      setMessagesByContext((prev) => ({
        ...prev,
        [targetContext]: [...(prev[targetContext] || []), newMessage],
      }));
    },
    [currentContext.id],
  );

  // Frontend action executor for Joseph's commands
  const executeFrontendActions = useCallback(
    (actions: any[]) => {
      if (!Array.isArray(actions)) return;
      actions.forEach((action) => {
        const type = (action?.type || action?.name || "").toString();
        switch (type) {
          case "navigate": {
            const to = action?.to || action?.route;
            if (typeof to === "string" && to.trim()) navigate(to);
            break;
          }
          case "open_tool": {
            const toolId = action?.tool || action?.toolId;
            if (typeof toolId === "string") {
              const tool = economicTools.find((t) => t.id === toolId);
              if (tool && tool.isAvailable) {
                setSelectedTool(tool);
                setIsToolOpen(true);
              }
            }
            break;
          }
          case "toast": {
            // Lazy inline toast using browser alert if Sonner not available here
            const msg = action?.message || action?.text || "Done";
            // eslint-disable-next-line no-alert
            alert(String(msg));
            break;
          }
          case "set_theme": {
            const theme = (action?.theme || "").toString();
            if (theme === "dark")
              document.documentElement.classList.add("dark");
            if (theme === "light")
              document.documentElement.classList.remove("dark");
            break;
          }
          case "refresh_data": {
            // Placeholder hook for future data refetch triggers
            // Could emit a custom event other hooks listen to
            window.dispatchEvent(new CustomEvent("joseph:refresh"));
            break;
          }
          default:
            break;
        }
      });
    },
    [navigate, setIsToolOpen, setSelectedTool],
  );

  // Auto-detect context based on current route
  useEffect(() => {
    const context = moduleContexts.find(
      (ctx) => ctx.route === location.pathname,
    );
    if (context && context.id !== currentContext.id) {
      setCurrentContext(context);

      // Check if this context has messages and add welcome if not
      setTimeout(() => {
        const contextMessages = messagesByContext[context.id] || [];
        if (contextMessages.length === 0) {
          addMessage(
            {
              type: "assistant",
              content: `I've switched to ${context.name} mode. I can now help you with ${context.description.toLowerCase()}. What would you like to know?`,
              context: context.id,
            },
            context.id,
          );
        }
      }, 100); // Small delay to ensure state updates
    }
  }, [location.pathname, currentContext.id, addMessage]); // Remove messagesByContext dependency

  const sendMessage = useCallback(
    async (content: string, context?: string) => {
      if (!content.trim()) return;

      const targetContext = context || currentContext.id;

      // Create user message
      const userMessage = {
        type: "user" as const,
        content: content.trim(),
        context: targetContext,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      // Add user message to state
      setMessagesByContext((prev) => ({
        ...prev,
        [targetContext]: [...(prev[targetContext] || []), userMessage],
      }));

      setCurrentInput("");
      setIsTyping(true);

      // Get current messages including the new user message
      const currentMessages = [
        ...(messagesByContext[targetContext] || []),
        userMessage,
      ];

      try {
        // SINGLE backendBase declaration at method scope
        const backendBase = (
          import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined
        )?.trim();
        // Agent command routing: prefix with /agent to give Joseph full control
        if (
          content.trim().toLowerCase().startsWith("/agent") &&
          backendBase &&
          /^https?:\/\//i.test(backendBase)
        ) {
          const clean = content.replace(/^\s*\/agent\s*/i, "");
          const url = `${backendBase.replace(/\/$/, "")}/chatbot/agent/command/`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: clean,
              context: { module: targetContext },
            }),
          });
          const data = await response.json();
          const text =
            typeof data?.result?.response === "string"
              ? data.result.response
              : JSON.stringify(data.result || data);
          // Execute any frontend actions Joseph planned
          if (Array.isArray(data?.result?.actions)) {
            executeFrontendActions(data.result.actions);
          }
          addMessage({
            type: "assistant",
            content: text,
            context: targetContext,
          });
          setIsTyping(false);
          return;
        }
        // Attempt AI response first if API key is configured
        const urls = extractUrls(content);
        let webContext: string | null = null;
        // Pull dynamic in-app knowledge for the current module
        let knowledgePack: string | null = null;
        if (backendBase && /^https?:\/\//i.test(backendBase)) {
          try {
            const queryUrl = `${backendBase.replace(/\/$/, "")}/chatbot/agent/query/`;
            const qRes = await fetch(queryUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ module: targetContext }),
            });
            if (qRes.ok) {
              const qData = await qRes.json();
              const kpis = Array.isArray(qData?.kpis) ? qData.kpis : [];
              const insights = Array.isArray(qData?.insights)
                ? qData.insights
                : [];
              const kpiLines = kpis
                .slice(0, 20)
                .map(
                  (k: any) =>
                    `- ${k.name}: ${k.current}${k.unit ? " " + k.unit : ""} (target ${k.target})`,
                );
              const insightLines = insights
                .slice(0, 10)
                .map((i: any) => `- ${i.summary}`);
              knowledgePack = [
                `Module: ${qData?.module || targetContext}`,
                kpiLines.length ? `KPIs:\n${kpiLines.join("\n")}` : "",
                insightLines.length
                  ? `Insights:\n${insightLines.join("\n")}`
                  : "",
              ]
                .filter(Boolean)
                .join("\n\n");
            }
          } catch {}
        }
        if (urls.length > 0) {
          try {
            const firstTwo = urls.slice(0, 2);
            const parts: string[] = [];
            await Promise.all(
              firstTwo.map(async (u) => {
                try {
                  const txt = await fetchWebPageText(u);
                  if (txt) {
                    parts.push(`URL: ${u}\n${txt}`);
                  }
                } catch {
                  // Individual URL fetch failed - continue with others
                }
              }),
            );
            if (parts.length) {
              webContext = parts.join("\n\n---\n\n");
            }
          } catch {
            // URL content fetching failed - continue without it
          }
        }

        const system = `You are Joseph, a Monolithic Economic AI system that supports businesses of all kinds by gathering and processing macro and micro (in-business) information across this application. The current module is "${currentContext.name}" (${currentContext.id}).
\nUse in-app knowledge (KPIs and insights) and any provided web context to ground your answer. Be precise, cite metrics you use, and tailor recommendations to the user's request and the module.`;
        const combinedContext =
          [knowledgePack, webContext].filter(Boolean).join("\n\n---\n\n") ||
          null;
        const aiText = await generateAIResponse(currentMessages, {
          system,
          webContext: combinedContext,
        });

        if (aiText) {
          const assistantMessage = {
            type: "assistant" as const,
            content: aiText,
            context: targetContext,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            tools: content.toLowerCase().includes("calculator")
              ? ["economic-calculator"]
              : content.toLowerCase().includes("forecast")
                ? ["forecast-wizard"]
                : content.toLowerCase().includes("budget")
                  ? ["budget-planner"]
                  : undefined,
          };
          setMessagesByContext((prev) => ({
            ...prev,
            [targetContext]: [...(prev[targetContext] || []), assistantMessage],
          }));
          setIsTyping(false);
          return;
        }
        // Fallback to backend if configured (avoid localhost in browser)
        if (backendBase && /^https?:\/\//i.test(backendBase)) {
          const url = `${backendBase.replace(/\/$/, "")}/chatbot/generate-response/`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: currentMessages,
              context: targetContext,
              currentData: {},
            }),
          });
          if (response.ok) {
            const data = await response.json();
            const assistantMessage = {
              type: "assistant" as const,
              content: data.response,
              context: targetContext,
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date(),
              tools: content.toLowerCase().includes("calculator")
                ? ["economic-calculator"]
                : content.toLowerCase().includes("forecast")
                  ? ["forecast-wizard"]
                  : content.toLowerCase().includes("budget")
                    ? ["budget-planner"]
                    : undefined,
            };
            setMessagesByContext((prev) => ({
              ...prev,
              [targetContext]: [
                ...(prev[targetContext] || []),
                assistantMessage,
              ],
            }));
            setIsTyping(false);
            return;
          }
        }
        // No backend or failed
        const assistantMessage = {
          type: "assistant" as const,
          content:
            "Sorry, I couldn’t reach the AI right now. Please try again in a moment.",
          context: targetContext,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          tools: content.toLowerCase().includes("calculator")
            ? ["economic-calculator"]
            : content.toLowerCase().includes("forecast")
              ? ["forecast-wizard"]
              : content.toLowerCase().includes("budget")
                ? ["budget-planner"]
                : undefined,
        };
        setMessagesByContext((prev) => ({
          ...prev,
          [targetContext]: [...(prev[targetContext] || []), assistantMessage],
        }));
      } catch {
        const assistantMessage = {
          type: "assistant" as const,
          content:
            "Sorry, I couldn’t reach the AI right now. Please try again in a moment.",
          context: targetContext,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          tools: content.toLowerCase().includes("calculator")
            ? ["economic-calculator"]
            : content.toLowerCase().includes("forecast")
              ? ["forecast-wizard"]
              : content.toLowerCase().includes("budget")
                ? ["budget-planner"]
                : undefined,
        };
        setMessagesByContext((prev) => ({
          ...prev,
          [targetContext]: [...(prev[targetContext] || []), assistantMessage],
        }));
      }

      setIsTyping(false);
    },
    [currentContext.id, messagesByContext],
  );

  const switchContext = useCallback(
    (contextId: string) => {
      const context = moduleContexts.find((ctx) => ctx.id === contextId);
      if (context) {
        setCurrentContext(context);

        // If this context has no messages yet, add a welcome message
        if (!(messagesByContext[context.id]?.length > 0)) {
          addMessage(
            {
              type: "assistant",
              content: `Welcome to ${context.name}! I can help you with ${context.description.toLowerCase()}. What questions do you have?`,
              context: context.id,
            },
            context.id,
          );
        }
      }
    },
    [addMessage, messagesByContext],
  );

  const openTool = useCallback(
    (toolId: string) => {
      const tool = economicTools.find((t) => t.id === toolId);
      if (tool && tool.isAvailable) {
        setSelectedTool(tool);
        setIsToolOpen(true);
        addMessage({
          type: "assistant",
          content: `Opening ${tool.name}... ${tool.description}`,
          context: currentContext.id,
          tools: [tool.id],
        });
      }
    },
    [currentContext.id, addMessage],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage],
  );

  const explainElement = useCallback(
    async (elementDescription: string, data?: any) => {
      try {
        setIsTyping(true);
        const history: ChatMessage[] = [
          ...(messagesByContext[currentContext.id] || []),
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: "user",
            content: `Explain this UI element: ${elementDescription}. If helpful, relate it to ${currentContext.name}.`,
            timestamp: new Date(),
            context: currentContext.id,
          },
        ];

        const system = `You are Joseph AI embedded in a web app. The user clicked an element described as: "${elementDescription}". Provide a concise explanation relevant to the current module (${currentContext.name}). If numbers or metrics are present in data, interpret them, cite the values you used. Avoid hallucinations.`;
        const webContext = data
          ? `Clicked element details (JSON):\n${JSON.stringify(data).slice(0, 6000)}`
          : undefined;
        const aiText = await generateAIResponse(history, {
          system,
          webContext: webContext || null,
        });

        const content =
          aiText ??
          `You clicked on "${elementDescription}". ${generateContextualResponse(
            `Explain ${elementDescription}`,
            currentContext.id,
            data,
          )}`;

        addMessage({
          type: "assistant",
          content,
          context: currentContext.id,
        });

        if (!isOpen) {
          setIsOpen(true);
          setIsMinimized(false);
        }
      } catch (error) {
        // Handle any errors silently
        console.debug("Error explaining element:", error);
      } finally {
        setIsTyping(false);
      }
    },
    [
      currentContext.id,
      currentContext.name,
      addMessage,
      isOpen,
      messagesByContext,
    ],
  );

  const clearChat = useCallback(() => {
    setMessagesByContext((prev) => ({
      ...prev,
      [currentContext.id]: [],
    }));
    addMessage({
      type: "assistant",
      content: `Hi! I'm Joseph, your AI economic assistant. I'm currently in ${currentContext.name} mode. How can I help you today?`,
      context: currentContext.id,
    });
  }, [currentContext, addMessage]);

  // Initialize with welcome message for current context if no messages exist
  useEffect(() => {
    const currentContextMessages = messagesByContext[currentContext.id] || [];
    if (currentContextMessages.length === 0) {
      addMessage({
        type: "assistant",
        content: `Hello! I'm Joseph, your AI economic assistant for ${currentContext.name}. I can help explain data, answer questions, and provide insights. What would you like to know?`,
        context: currentContext.id,
      });
    }
  }, [currentContext.id, currentContext.name, addMessage]); // Remove messagesByContext to prevent loops

  return {
    // State
    isOpen,
    isMinimized,
    messages,
    currentInput,
    isTyping,
    currentContext,
    selectedTool,
    isToolOpen,

    // Data
    moduleContexts,
    economicTools: economicTools.filter((tool) => tool.isAvailable),
    smartSuggestions,

    // Actions
    setIsOpen,
    setIsMinimized,
    setCurrentInput,
    sendMessage,
    switchContext,
    openTool,
    setIsToolOpen,
    handleSuggestionClick,
    explainElement,
    clearChat,
  };
}
