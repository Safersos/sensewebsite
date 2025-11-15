"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createSession, sendMessage } from "@/lib/api/chat";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  rightWidth: number;
  isDragging?: boolean;
}

export function ChatInterface({ rightWidth, isDragging = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsInitializing(true);
        const newSessionId = await createSession();
        setSessionId(newSessionId);
        setConnectionError(null);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        setConnectionError("Failed to connect to Sense. Please check if the backend is running.");
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    setConnectionError(null);

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call the backend API
      const reply = await sendMessage(sessionId, messageText);

      // Replace loading message with response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content: reply,
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get response from Sense";
      setConnectionError(errorMessage);

      // Replace loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content: `Error: ${errorMessage}`,
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Dynamic padding based on rightWidth - memoized to prevent re-renders
  const padding = useMemo(() => {
    if (rightWidth < 30) return "p-2";
    if (rightWidth < 40) return "p-2 sm:p-3";
    return "p-3 sm:p-4";
  }, [rightWidth]);

  // Dynamic text size based on rightWidth - memoized to prevent re-renders
  const textSize = useMemo(() => {
    if (rightWidth < 30) return "text-sm";
    if (rightWidth < 40) return "text-sm sm:text-base";
    return "text-base sm:text-lg";
  }, [rightWidth]);

  return (
    <div
      className={`absolute top-0 bottom-0 right-0 flex flex-col bg-white/10 backdrop-blur-md border-l border-white/10 ${
        !isDragging ? "transition-all duration-300 ease-out" : ""
      }`}
      style={{ width: `${rightWidth}%` }}
    >
      {/* Chat Header */}
      <div className={`${padding} border-b border-white/20 flex-shrink-0 flex items-center justify-between`}>
        <h2 className={`${textSize} font-semibold text-white truncate`}>Sense Chat</h2>
        {isInitializing && (
          <span className="text-xs text-white/50">Connecting...</span>
        )}
        {connectionError && !isInitializing && (
          <span className="text-xs text-red-300" title={connectionError}>⚠️ Connection Error</span>
        )}
        {!isInitializing && !connectionError && sessionId && (
          <span className="text-xs text-green-300">● Connected</span>
        )}
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${padding} space-y-3 sm:space-y-4 neural-scrollbar-right`}>
        {isInitializing ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-white/50 text-xs sm:text-sm">Connecting to Sense...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/50 text-xs sm:text-sm">Start a conversation with Sense</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${
                    message.role === "user"
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/90"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <p className={`${rightWidth < 30 ? "text-xs" : "text-sm sm:text-base"} whitespace-pre-wrap break-words`}>
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className={`${padding} border-t border-white/20 flex-shrink-0`}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Hi, I'm Sense, how can I help you?"
            className={`w-full min-h-[50px] sm:min-h-[60px] max-h-[200px] px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none ${
              rightWidth < 30 ? "text-xs" : "text-sm sm:text-base"
            }`}
            rows={1}
            disabled={isLoading || isInitializing || !sessionId}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
