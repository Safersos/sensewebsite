"use client";

interface ChatInterfaceProps {
  rightWidth: number;
  isDragging?: boolean;
}

export function ChatInterface({ rightWidth, isDragging = false }: ChatInterfaceProps) {
  return (
    <div
      className={`absolute top-0 bottom-0 right-0 flex flex-col bg-white/10 backdrop-blur-md border-l border-white/10 ${
        !isDragging ? "transition-all duration-300 ease-out" : ""
      }`}
      style={{ width: `${rightWidth}%` }}
    >
      {/* Chat Header */}
      <div className="p-3 sm:p-4 border-b border-white/20">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Sense Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 neural-scrollbar-right">
        {/* Placeholder: Empty chat for now */}
        <div className="flex items-center justify-center h-full">
          <p className="text-white/50 text-sm">Start a conversation with Sense</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-white/20">
        <div className="relative">
          <textarea
            placeholder="Hi, I'm Sense, how can I help you?"
            className="w-full min-h-[60px] max-h-[200px] px-4 py-3 pr-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5 text-white"
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
