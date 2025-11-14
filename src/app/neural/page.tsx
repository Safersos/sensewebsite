"use client";

import { useState, useEffect } from "react";
import ShaderBackground from "@/components/ui/shader-background";
import { DraggableDivider } from "@/components/neural/draggable-divider";
import { AppMarketplace } from "@/components/neural/app-marketplace";
import { ChatInterface } from "@/components/neural/chat-interface";

export default function NeuralPage() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Load saved position on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem("neural-divider-position");
    if (saved) {
      const savedWidth = parseFloat(saved);
      setLeftWidth(savedWidth);
    }
  }, []);

  const rightWidth = 100 - leftWidth;

  const handleDrag = (width: number) => {
    setLeftWidth(width);
  };

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden">
      <ShaderBackground />
      
      {/* Left Section - App Marketplace */}
      <AppMarketplace leftWidth={leftWidth} isDragging={isDragging} />

      {/* Draggable Divider */}
      <DraggableDivider 
        onDrag={handleDrag} 
        initialLeftWidth={leftWidth}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />

      {/* Right Section - Chat Interface */}
      <ChatInterface rightWidth={rightWidth} isDragging={isDragging} />
    </main>
  );
}


