import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, TrendingUp } from "lucide-react";
import { generateAIResponse } from "@/lib/ai";
import { getAllAppData, formatContextForPrompt } from "@/lib/app-context";
import {
  ECONOMIST_SAMPLE_QUESTIONS,
  ECONOMIST_CAPABILITIES,
} from "@/lib/economist-prompts";
import type { ChatMessage } from "@/lib/chatbot-data";

export default function ChatbotTest() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm Joseph, your Expert Macro and Micro Business Economist. My mission is to help you maximize profitability and operations efficiency while minimizing losses. I analyze your business data combined with economic indicators to identify profit opportunities, cost savings, pricing optimization, and financial risks. Ask me how to increase profit margins, reduce costs, identify unprofitable operations, or protect against economic threats!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appDataReady, setAppDataReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load app context when component mounts
    const context = getAllAppData();
    setAppDataReady(true);
    console.log("App Context Loaded:", context);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const response = await generateAIResponse(history, {
        // Uses the economist system prompt automatically when system is not specified
        includeAppContext: true,
        performWebSearch: true,
      });

      if (response) {
        const assistantMessage: ChatMessage = {
          id: `a_${Date.now()}`,
          type: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        type: "assistant",
        content:
          "Sorry, I encountered an error generating a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enhanced Chatbot Test</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Joseph AI with app context and web search
              </p>
            </div>
            <Badge variant={appDataReady ? "default" : "secondary"}>
              {appDataReady ? "✓ Ready" : "Loading..."}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your business..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          Joseph's Profit-Focused Capabilities:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Identify which operations are profitable vs. loss-making</li>
          <li>✓ Optimize pricing to maximize profit margins</li>
          <li>✓ Reduce operational costs and eliminate waste</li>
          <li>✓ Analyze profitability by customer segment</li>
          <li>✓ Identify economic risks to your profitability</li>
          <li>✓ Real-time economic data and market analysis</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">
          Try asking Joseph (Focus on Profit & Loss):
        </h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• "Which of my operations are losing money?"</li>
          <li>• "What's my optimal pricing to maximize profit?"</li>
          <li>• "Where can I reduce costs without impacting quality?"</li>
          <li>• "Which customer segments are most profitable?"</li>
          <li>• "How do rising interest rates impact my profit margins?"</li>
          <li>• "What's the best way to improve my break-even point?"</li>
        </ul>
      </div>
    </div>
  );
}
