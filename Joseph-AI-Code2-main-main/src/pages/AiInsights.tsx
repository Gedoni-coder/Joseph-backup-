import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModuleHeader from "@/components/ui/module-header";
import { useConversationalMode } from "@/App";
import {
  Brain,
  Send,
  ArrowLeft,
  Paperclip,
  Mic,
  Copy,
  Share2,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
  ChevronRight,
  Search,
  X,
  Menu,
} from "lucide-react";

interface AdviceMessage {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ModuleInfo {
  id: string;
  module: string;
  moduleKey: string;
  icon: string;
  color: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "joseph";
  content: string;
  timestamp: Date;
}

const AdviceHub = () => {
  const { conversationalMode, onConversationalModeChange } =
    useConversationalMode();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const modulesList = [
    { id: "econ-forecast", name: "Economic Forecasting", icon: "📊" },
    { id: "biz-forecast", name: "Business Forecasting", icon: "📈" },
    { id: "market-analysis", name: "Market Analysis", icon: "🌍" },
    { id: "pricing-strategy", name: "Pricing Strategy", icon: "💰" },
    { id: "revenue-strategy", name: "Revenue Strategy", icon: "💵" },
    { id: "funding-loans", name: "Funding and Loan Hub", icon: "🏦" },
    { id: "inventory-supply", name: "Inventory and Supply Chain", icon: "📦" },
    { id: "policy-impact", name: "Policy and Economic Impact", icon: "⚖️" },
    { id: "business-feasibility", name: "Business Feasibility", icon: "✅" },
    { id: "tax-compliance", name: "Tax and Compliance", icon: "📋" },
    { id: "sales-intelligence", name: "Sales Intelligence", icon: "🎯" },
  ];

  const [adviceMessages, setAdviceMessages] = useState<AdviceMessage[]>([
    {
      id: "msg-1",
      moduleId: "sales-intelligence",
      moduleName: "Sales Intelligence",
      moduleIcon: "🎯",
      title: "Focus on top 3 accounts for better pipeline management",
      content:
        "Focus on the top 3 accounts in your pipeline representing 45% of potential revenue. Implement daily check-ins for these deals and assign a dedicated account manager. This approach has shown a 23% improvement in close rates.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-2",
      moduleId: "sales-intelligence",
      moduleName: "Sales Intelligence",
      moduleIcon: "🎯",
      title: "3 deals at risk - immediate rescue strategy recommended",
      content:
        "3 deals at risk detected in your pipeline. Recommended rescue strategy: Send personalized value ROI summary + decision reminder within 24 hours. Success rate: 68% for similar scenarios. Total recoverable value: $180K.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-3",
      moduleId: "revenue-strategy",
      moduleName: "Revenue Strategy",
      moduleIcon: "💵",
      title: "Reallocate budget to WhatsApp for higher engagement",
      content:
        "Your engagement score on WhatsApp is 95% vs 52% on Email. Reallocate 30% of email budget to WhatsApp campaigns. Projected additional revenue: $125K over Q2.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-4",
      moduleId: "revenue-strategy",
      moduleName: "Revenue Strategy",
      moduleIcon: "💵",
      title: "Referral customers have 42% higher lifetime value",
      content:
        "Customer retention insight: Customers acquired through referrals have 42% higher lifetime value. Create referral incentive program with 15% discount. ROI projection: 340% within 6 months.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-5",
      moduleId: "biz-forecast",
      moduleName: "Business Forecasting",
      moduleIcon: "📈",
      title: "Pipeline health declining - deal size and closure rate down",
      content:
        "Pipeline health score: 8.5/10. Two key risks identified: Deal closure rate declining and average deal size trending down. Recommend immediate intervention.",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-6",
      moduleId: "sales-intelligence",
      moduleName: "Sales Intelligence",
      moduleIcon: "🎯",
      title: "Team member performance analysis - coaching opportunity",
      content:
        "Sales rep shows potential to reach top performer status. His deal size is 23% higher than team average. Focus coaching on follow-up consistency. Expected improvement: 15% in closing ratio.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-7",
      moduleId: "econ-forecast",
      moduleName: "Economic Forecasting",
      moduleIcon: "📊",
      title: "Q2 economic trends - interest rates impact analysis",
      content:
        "Q2 projection: Based on current economic trends and interest rate environment, expect 82% of forecasted targets. Action needed: Adjust spending by 15%. Focus on sectors with high resilience (4.2x growth potential).",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-8",
      moduleId: "tax-compliance",
      moduleName: "Tax and Compliance",
      moduleIcon: "📋",
      title: "2024 tax regulations update - compliance checklist",
      content:
        "New tax regulations effective Q3: Your business needs to implement enhanced documentation for 2 key areas. Schedule compliance review this quarter. Retention probability with intervention: 78% penalty avoidance.",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-9",
      moduleId: "market-analysis",
      moduleName: "Market Analysis",
      moduleIcon: "🌍",
      title: "Market growth trending upward - 5% quarter-over-quarter",
      content:
        "Market analysis dashboard: Overall market growth improved to 5% quarter-over-quarter (+3% vs last quarter). Your market share position improved. Continue current strategy while monitoring competitor moves.",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-10",
      moduleId: "pricing-strategy",
      moduleName: "Pricing Strategy",
      moduleIcon: "💰",
      title: "Price optimization - elasticity analysis suggests 8% increase",
      content:
        "Pricing analysis: 3 product lines show pricing optimization opportunities. Combined addressable revenue increase: $8.5M. Recommended approach: Pilot price increase on highest-margin segment with 2-week test period.",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "msg-11",
      moduleId: "inventory-supply",
      moduleName: "Inventory and Supply Chain",
      moduleIcon: "📦",
      title: "Supply chain optimization - reduce lead times by 3 days",
      content:
        "Supply chain review: Current lead time: 12 days, industry average: 9 days. AI analysis suggests 3 key optimizations. Expected cost savings: 18%. ROI on implementation: 320% within 6 months.",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-12",
      moduleId: "funding-loans",
      moduleName: "Funding and Loan Hub",
      moduleIcon: "🏦",
      title: "Financing opportunity - $2M credit facility at favorable terms",
      content:
        "New financing option available: $2M credit facility approved at 6.2% APR. Perfect timing for expansion plans. Application deadline: 30 days. Impact: Can accelerate growth initiatives by 6 months.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting message
    const message = adviceMessages.find((m) => m.id === messageId);
    if (message) {
      setAdviceMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)),
      );
      setChatMessages([
        {
          id: "init-1",
          role: "joseph",
          content: message.content,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(
      () => {
        const josephResponses = [
          "That's an excellent observation. Based on the current metrics, I recommend prioritizing this approach for optimal results.",
          "I've analyzed your input and cross-referenced it with the data. This aligns well with the recommended strategy.",
          "Great question. The data strongly supports this direction. Would you like me to provide more detailed implementation steps?",
          "I see what you're getting at. This is consistent with the trends we're observing. Let me help you with the next steps.",
          "Excellent thinking. This complements the existing insights perfectly. Shall I create a specific action plan?",
        ];

        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "joseph",
          content:
            josephResponses[Math.floor(Math.random() * josephResponses.length)],
          timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, response]);
        setIsTyping(false);
      },
      1000 + Math.random() * 500,
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = adviceMessages.filter((m) => !m.isRead).length;
  const selectedMessage = adviceMessages.find(
    (m) => m.id === selectedMessageId,
  );

  // Filter messages based on selected module and search query
  const filteredMessages = adviceMessages.filter((message) => {
    const matchesModule =
      !selectedModuleFilter || message.moduleId === selectedModuleFilter;
    const matchesSearch =
      !searchQuery ||
      message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.moduleName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // ===== DETAIL/CHAT VIEW =====
  if (selectedMessageId && selectedMessage) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <ModuleHeader
          icon={<Brain className="h-6 w-6" />}
          title="Advice Hub"
          description="Repository of AI-powered advice and recommendations from Joseph AI"
          isConnected={true}
          lastUpdated={new Date()}
          connectionLabel="Live"
          conversationalMode={conversationalMode}
          onConversationalModeChange={onConversationalModeChange}
        />

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSelectedMessageId(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 line-clamp-1">
                <span className="text-lg sm:text-xl flex-shrink-0">
                  {selectedMessage.moduleIcon}
                </span>
                <span className="text-xs sm:text-sm truncate">
                  {selectedMessage.title}
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                [{selectedMessage.moduleName}] •{" "}
                {formatTime(selectedMessage.timestamp)}
              </p>
            </div>
          </div>
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 text-xs sm:text-sm flex-shrink-0"
          >
            🟢 Live
          </Badge>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6">
          <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-6">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "joseph" && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-xs sm:max-w-xl ${message.role === "user" ? "order-first" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.role === "joseph" && (
                      <div className="flex items-center gap-1 ml-1 sm:ml-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors hidden sm:block">
                          <Copy className="h-3 w-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors hidden sm:block">
                          <Share2 className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                      U
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 sm:gap-4">
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t bg-white p-3 sm:p-6 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 sm:gap-3 items-end">
              <div className="flex-1">
                <div className="relative border border-gray-200 rounded-2xl bg-white shadow-sm">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask Joseph..."
                    className="w-full p-3 sm:p-4 pr-16 sm:pr-20 resize-none border-0 focus:ring-0 focus:outline-none rounded-2xl text-sm sm:text-base"
                    rows={1}
                    style={{
                      minHeight: "44px",
                      maxHeight: "200px",
                      height: "auto",
                    }}
                  />

                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 hidden sm:flex"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 hidden sm:flex"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex-shrink-0 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LIST/INBOX VIEW =====
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ModuleHeader
        icon={<Brain className="h-6 w-6" />}
        title="Advice Hub"
        description="Repository of AI-powered advice and recommendations from Joseph AI"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
        conversationalMode={conversationalMode}
        onConversationalModeChange={onConversationalModeChange}
      />

      {/* Module Circles Section */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sm:py-2.5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-gray-900">
                Updates
              </h2>
              <p className="text-xs text-gray-600 leading-tight">
                {unreadCount === 0 ? "All read" : `${unreadCount} new`}
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>

          {/* Module Status Circles */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
            {modulesList.map((module) => {
              const moduleMessages = adviceMessages.filter(
                (m) => m.moduleId === module.id,
              );
              const unreadInModule = moduleMessages.filter((m) => !m.isRead);
              const hasUnread = unreadInModule.length > 0;

              // Color mapping for modules
              const colorMap: { [key: string]: string } = {
                "econ-forecast": "from-blue-400 to-blue-600",
                "biz-forecast": "from-cyan-400 to-cyan-600",
                "market-analysis": "from-green-400 to-green-600",
                "pricing-strategy": "from-yellow-400 to-yellow-600",
                "revenue-strategy": "from-orange-400 to-orange-600",
                "funding-loans": "from-purple-400 to-purple-600",
                "inventory-supply": "from-pink-400 to-pink-600",
                "policy-impact": "from-red-400 to-red-600",
                "business-feasibility": "from-indigo-400 to-indigo-600",
                "tax-compliance": "from-teal-400 to-teal-600",
                "sales-intelligence": "from-lime-400 to-lime-600",
              };

              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModuleFilter(module.id)}
                  className="flex-shrink-0 focus:outline-none group transition-all"
                >
                  <div
                    className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer transition-all bg-gradient-to-br ${
                      colorMap[module.id] || "from-gray-400 to-gray-600"
                    } ${
                      hasUnread
                        ? "ring-2 ring-offset-1 ring-offset-white ring-yellow-400"
                        : ""
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{module.icon}</span>

                    {hasUnread && (
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-900 animate-pulse">
                        {unreadInModule.length}
                      </div>
                    )}
                  </div>

                  <p className="text-center text-xs font-medium text-gray-700 mt-0.5 truncate w-12 sm:w-13 group-hover:text-gray-900 transition-colors line-clamp-1">
                    {module.name.split(" ")[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Sidebar + Messages */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* Hamburger Menu Button (Desktop & Mobile) */}
        <div className="absolute top-4 left-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Overlay when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Module Filters */}
        <div
          className={`fixed z-40 top-0 left-0 h-full w-64 border-r border-gray-200 bg-white flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header with Close Button */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
            <h3 className="text-sm font-semibold text-gray-900">Filter</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Module Filters */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {/* All Modules Button */}
              <button
                onClick={() => setSelectedModuleFilter(null)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedModuleFilter === null
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Modules
                <span className="float-right text-xs opacity-60">
                  ({adviceMessages.length})
                </span>
              </button>

              {/* Individual Module Filters */}
              {modulesList.map((module) => {
                const moduleMessages = adviceMessages.filter(
                  (m) => m.moduleId === module.id,
                );
                const unreadInModule = moduleMessages.filter(
                  (m) => !m.isRead,
                ).length;

                return (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModuleFilter(module.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                      selectedModuleFilter === module.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>
                      <span className="mr-2">{module.icon}</span>
                      {module.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-60">
                        ({moduleMessages.length})
                      </span>
                      {unreadInModule > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5">
                          {unreadInModule}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer - Stats */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{adviceMessages.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unread</span>
              <span className="font-semibold text-blue-600">{unreadCount}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Messages List */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {/* Messages Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-2 flex-shrink-0 mt-14">
            <span className="text-xl">💡</span>
            <h3 className="font-semibold text-gray-900">Latest Advice</h3>
          </div>

          {/* Messages Content */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">No messages</p>
                <p className="text-xs text-gray-500">
                  {selectedModuleFilter
                    ? "No messages in this module"
                    : "Check back soon for updates"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMessages
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleMessageClick(message.id)}
                      className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                        !message.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      {/* Left Content */}
                      <div className="flex-1 min-w-0 flex items-start gap-2 sm:gap-3">
                        <span className="text-lg sm:text-2xl flex-shrink-0 mt-0.5">
                          {message.moduleIcon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`text-sm ${
                                !message.isRead
                                  ? "font-bold text-gray-900"
                                  : "font-medium text-gray-900"
                              } truncate`}
                            >
                              {message.title}
                            </h3>
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              [{message.moduleName}]
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Timestamp & Chevron */}
                      <div className="flex items-center gap-2 ml-auto sm:ml-4 flex-shrink-0">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTime(message.timestamp)}
                        </span>
                        <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviceHub;
