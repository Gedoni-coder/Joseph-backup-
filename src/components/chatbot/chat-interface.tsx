import React, { useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Send,
  User,
  Loader2,
  Trash2,
  Clock,
} from "lucide-react";
import { ChatMessage, ModuleContext } from "../../lib/chatbot-data";
import { cn } from "../../lib/utils";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentInput: string;
  isTyping: boolean;
  currentContext: ModuleContext;
  smartSuggestions: string[];
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onClearChat: () => void;
  className?: string;
}

export function ChatInterface({
  messages,
  currentInput,
  isTyping,
  currentContext,
  smartSuggestions,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
  onClearChat,
  className,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      onSendMessage(currentInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File upload handling
  useEffect(() => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (!fileInput) return;

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (!files || files.length === 0) return;

      const attachmentPreview = document.getElementById('attachmentPreview');
      if (!attachmentPreview) return;

      attachmentPreview.classList.remove('hidden');
      attachmentPreview.innerHTML = '';

      Array.from(files).forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'flex items-center gap-3 p-3 bg-muted/50 border border-border/50 rounded-lg';

        const fileIcon = file.type.startsWith('image/') ? '🖼️' :
                        file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? '📊' : '📄';

        previewItem.innerHTML = `
          <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span class="text-lg">${fileIcon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">${file.name}</div>
            <div class="text-xs text-muted-foreground">${formatFileSize(file.size)}</div>
          </div>
          <button class="text-destructive hover:text-destructive/80 p-1" onclick="this.parentElement.remove(); if(!document.getElementById('attachmentPreview').children.length) document.getElementById('attachmentPreview').classList.add('hidden');">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;

        attachmentPreview.appendChild(previewItem);
      });
    };

    fileInput.addEventListener('change', handleFileUpload);
    return () => fileInput.removeEventListener('change', handleFileUpload);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn("flex flex-col h-full relative", className)}>
      {/* Chat Header - Made Sticky */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-border/50 bg-muted/30 backdrop-blur-md shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center p-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                alt="Joseph AI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-medium text-sm">Joseph AI</div>
              <div className="text-xs text-muted-foreground">
                {currentContext.name} Assistant
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearChat}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear chat history</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0 p-3 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.type === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1.5">
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
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ml-auto border-primary/20 rounded-br-md"
                    : "bg-white border-border/50 rounded-bl-md shadow-md"
                )}
              >
                <div className="text-sm leading-relaxed">{message.content}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={cn(
                      "text-xs flex items-center gap-1",
                      message.type === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {formatTime(message.timestamp)}
                  </div>
                  {message.tools && message.tools.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Tools: {message.tools.length}
                    </Badge>
                  )}
                </div>
              </div>

              {message.type === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1.5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                    alt="Joseph AI"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="bg-white border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    Joseph is analyzing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Smart Suggestions */}
      {/* Removed the smart suggestions box as per user request */}
      {/* {messages.length > 0 && !isTyping && (
        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {smartSuggestions.slice(0, 4).map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => onSuggestionClick(suggestion)}
                disabled={isTyping}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )} */}

      {/* Input Area (always at bottom - permanently fixed) */}
      <div className="mt-auto p-3 border-t shrink-0 bg-white/95 backdrop-blur-sm z-20 shadow-lg">
        {/* Attachment Preview */}
        <div id="attachmentPreview" className="mb-3 hidden">
          {/* Attachment previews will be dynamically added here */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={currentInput}
                onChange={(e) => {
                  onInputChange(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Joseph about ${currentContext.name.toLowerCase()}...`}
                disabled={isTyping}
                className="w-full min-h-[50px] max-h-[120px] p-3 pr-20 border-2 border-border rounded-xl resize-none outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  id="micButton"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <path d="M12 19v4"/>
                    <path d="M8 23h8"/>
                  </svg>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!currentInput.trim() || isTyping}
              className="h-[50px] w-[50px] rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg transition-all duration-200"
            >
              {isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Quick Suggestions */}
          {/* Removed the quick suggestions as per user request */}
          {/* <div className="flex flex-wrap gap-2">
            {smartSuggestions.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-8 rounded-full hover:bg-primary/10 hover:border-primary/50"
                onClick={() => onSuggestionClick(suggestion)}
                disabled={isTyping}
              >
                <span className="mr-1">💡</span>
                {suggestion}
              </Button>
            ))}
          </div> */}
        </form>

        {/* Hidden File Input */}
        <input
          type="file"
          id="fileInput"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif"
        />
      </div>
    </div>
  );
}
