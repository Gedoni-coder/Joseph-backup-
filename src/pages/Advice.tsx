import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import {
  Lightbulb,
  Inbox,
  Star,
  Archive,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  CheckSquare,
  Square,
  ArrowLeft,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  User,
  Calendar,
  Loader2,
  HelpCircle,
  Shield,
} from "lucide-react";
import {
  listAdviceMessages,
  markAdviceAsRead,
} from "@/lib/api/advice-service";
import type { AdviceMessage } from "@/lib/api/advice-service";

const Advice = () => {
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [selectedAdvice, setSelectedAdvice] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adviceMessages, setAdviceMessages] = useState<AdviceMessage[]>([]);

  // Fetch advice messages from backend on component mount
  useEffect(() => {
    const fetchAdviceMessages = async () => {
      try {
        setIsLoading(true);
        const data = await listAdviceMessages();
        setAdviceMessages(data);
      } catch (error) {
        console.error("Failed to fetch advice messages:", error);
        setAdviceMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdviceMessages();
  }, []);

  const categories = [
    {
      id: "inbox",
      label: "Inbox",
      icon: <Inbox className="h-4 w-4" />,
      count: adviceMessages.filter((m) => !m.isRead).length,
    },
    {
      id: "starred",
      label: "Starred",
      icon: <Star className="h-4 w-4" />,
      count: 0, // Add starred support if needed
    },
    {
      id: "archived",
      label: "Archived",
      icon: <Archive className="h-4 w-4" />,
      count: 0, // Add archived support if needed
    },
  ];

  const getTypeIcon = (moduleIcon: string) => {
    switch (moduleIcon?.toLowerCase()) {
      case "shield":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "trending-up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "target":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "help-circle":
        return <HelpCircle className="h-4 w-4 text-blue-600" />;
      case "lightbulb":
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredAdvice = adviceMessages.filter((message) => {
    switch (selectedCategory) {
      case "starred":
        return false; // Add starred support if needed
      case "archived":
        return false; // Add archived support if needed
      default:
        return !message.isRead;
    }
  });

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredAdvice.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredAdvice.map((m) => m.id));
    }
  };

  if (selectedAdvice) {
    const message = adviceMessages.find((m) => m.id === selectedAdvice);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAdvice(null)}
                className="justify-start w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Advice</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-xl font-semibold truncate">
                  {message?.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Message Content */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message?.moduleIcon === "shield"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {getTypeIcon(message?.moduleIcon || "")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h3 className="font-semibold">{message?.moduleName}</h3>
                      <Badge variant="outline" className="w-fit">
                        {message?.moduleIcon}
                      </Badge>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {message ? formatTime(message.timestamp) : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getTypeIcon(message?.moduleIcon || "")}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed font-sans">
                  {message?.content}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-6 border-t">
                <Button size="sm" className="w-full sm:w-auto">
                  Apply to Plan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Discuss
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader
        icon={<Lightbulb className="h-6 w-6" />}
        title="Advice Hub"
        description="Expert advice, recommendations, and strategic guidance for your business"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Sidebar - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block md:w-56 lg:w-64 space-y-2">
            <div className="bg-white rounded-lg border p-3 sm:p-4 sticky top-20">
              <Button className="w-full mb-4">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Advice</span>
                <span className="sm:hidden">New</span>
              </Button>

              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span>{category.label}</span>
                    </div>
                    {category.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile category selector */}
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {category.icon}
                  <span className="text-xs sm:text-sm">{category.label}</span>
                  {category.count > 0 && (
                    <Badge
                      variant={
                        selectedCategory === category.id ? "default" : "secondary"
                      }
                      className="text-xs min-w-5 h-5 flex items-center justify-center rounded-full p-0"
                    >
                      {category.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={selectAllMessages}
                      className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                    >
                      {selectedMessages.length === filteredAdvice.length &&
                      filteredAdvice.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    <CardTitle className="capitalize text-base sm:text-lg">
                      {selectedCategory}
                    </CardTitle>
                  </div>

                  {selectedMessages.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs w-full sm:w-auto"
                      >
                        <Archive className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Archive ({selectedMessages.length})
                        </span>
                        <span className="sm:hidden">Archive</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    <p className="text-gray-600 font-medium">Loading advice...</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredAdvice.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !message.isRead
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={async () => {
                          try {
                            await markAdviceAsRead(message.id);
                            setSelectedAdvice(message.id);
                            // Update local state
                            setAdviceMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id ? { ...m, isRead: true } : m
                              )
                            );
                          } catch (error) {
                            console.error(
                              "Failed to mark advice as read:",
                              error
                            );
                            setSelectedAdvice(message.id);
                          }
                        }}
                      >
                        {/* Checkbox row */}
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMessageSelection(message.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                          >
                            {selectedMessages.includes(message.id) ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>

                          <div className="flex-shrink-0 hidden sm:block">
                            {getTypeIcon(message.moduleIcon)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span
                              className={`text-sm ${
                                !message.isRead ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {message.moduleName}
                            </span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {message.moduleIcon}
                            </Badge>
                          </div>
                          <div
                            className={`text-sm ${
                              !message.isRead ? "font-medium" : ""
                            } truncate`}
                          >
                            {message.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {message.content}
                          </div>
                        </div>

                        {/* Timestamp and menu */}
                        <div className="flex-shrink-0 flex items-center justify-between sm:flex-col sm:text-right gap-2">
                          <div className="text-xs text-muted-foreground sm:mb-1">
                            {formatTime(message.timestamp)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredAdvice.length === 0 && (
                  <div className="text-center py-12">
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No advice
                    </h3>
                    <p className="text-muted-foreground">
                      Your {selectedCategory} is empty. New advice will
                      appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;
