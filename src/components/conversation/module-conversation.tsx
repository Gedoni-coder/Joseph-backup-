import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConversationMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  module: string;
  title?: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}

interface ModuleConversationProps {
  module: "market_analysis" | "pricing_strategy" | "revenue_strategy";
  moduleTitle: string;
}

export function ModuleConversation({
  module,
  moduleTitle,
}: ModuleConversationProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    createOrLoadConversation();
  }, [module]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const backendBase = (import.meta as any).env?.VITE_CHATBOT_BACKEND_URL as string | undefined;

  const apiUrl = (path: string) => {
    const base = (backendBase || 'http://localhost:8000').trim();
    if (base && /^https?:\/\//i.test(base)) return `${base.replace(/\/$/, '')}${path}`;
    return path; // fallback to relative (same-origin when served by Django)
  };

  const createOrLoadConversation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl(`/chatbot/conversations/?module=${module}`));
      if (response.ok) {
        const data = await response.json();
        const conversations = Array.isArray(data) ? data : data.results || [];
        if (conversations.length > 0) {
          setConversation(conversations[0]);
          return;
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }

    try {
      await createNewConversation();
    } catch (error) {
      console.error("Error creating conversation:", error);
      // Fallback: Create a local conversation if API fails
      const localConversation: Conversation = {
        id: Date.now().toString(),
        module,
        title: `${module.replace(/_/g, " ")} Discussion`,
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setConversation(localConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch(apiUrl("/chatbot/conversations/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module,
          title: `${moduleTitle} Discussion`,
        }),
      });
      if (response.ok) {
        const newConversation = await response.json();
        setConversation(newConversation);
        return;
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }

    // Fallback: Create a local conversation if API fails
    const localConversation: Conversation = {
      id: Date.now().toString(),
      module,
      title: `${moduleTitle} Discussion`,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setConversation(localConversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !conversation || isTyping) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date().toISOString(),
    };

    const userInput = currentInput;
    setCurrentInput("");
    setConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMessage],
          }
        : null,
    );

    setIsTyping(true);

    try {
      const response = await fetch(apiUrl("/chatbot/module-chat/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: conversation.id,
          content: userInput,
          module,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, data.assistant_message],
              }
            : null,
        );
      } else {
        // Provide fallback response if API fails
        const fallbackMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `I'm currently unable to process your request about ${moduleTitle}. Please try again in a moment.`,
          timestamp: new Date().toISOString(),
        };
        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, fallbackMessage],
              }
            : null,
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Provide fallback response on error
      const fallbackMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I encountered an error while processing your request. Please check your connection and try again.`,
        timestamp: new Date().toISOString(),
      };
      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, fallbackMessage],
            }
          : null,
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      await createNewConversation();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center p-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                alt="Joseph AI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-sm">JOSEPH</div>
              <div className="text-xs text-muted-foreground">
                {moduleTitle} Assistant
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {conversation.messages.length} messages
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className="h-8 w-8 p-0"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium">Welcome to JOSEPH</p>
                <p className="text-sm">
                  Start a conversation about {moduleTitle.toLowerCase()}
                </p>
              </div>
            </div>
          ) : (
            conversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.type === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.type === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                        alt="Joseph AI"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm border",
                    message.type === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-none border-primary/20"
                      : "bg-white border-border/50 rounded-bl-none",
                  )}
                >
                  <div className="text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={cn(
                        "text-xs flex items-center gap-1",
                        message.type === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                      You
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                    alt="Joseph AI"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="bg-white border border-border/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    JOSEPH is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Ask JOSEPH about ${moduleTitle.toLowerCase()}...`}
                disabled={isTyping}
                className="w-full min-h-[50px] max-h-[120px] p-3 border-2 border-border rounded-xl resize-none outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={1}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!currentInput.trim() || isTyping}
              className="h-[50px] w-[50px] rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg transition-all"
            >
              {isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
