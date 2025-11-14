"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface DraggableDividerProps {
  onDrag: (leftWidth: number) => void;
  initialLeftWidth?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const COLORS = [
  "rgb(59, 130, 246)", // blue
  "rgb(16, 185, 129)", // green
  "rgb(249, 115, 22)", // orange
  "rgb(168, 85, 247)", // purple
  "rgb(236, 72, 153)", // pink
];

export function DraggableDivider({ onDrag, initialLeftWidth = 50, onDragStart, onDragEnd }: DraggableDividerProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile to adjust touch handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth color animation - rotate colors smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 800); // Smooth rotation every 800ms

    return () => clearInterval(interval);
  }, []);

  // Load from localStorage on mount - only run once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem("neural-divider-position");
    if (saved) {
      const savedWidth = parseFloat(saved);
      setLeftWidth(savedWidth);
      onDrag(savedWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Save to localStorage - only save when dragging ends to avoid excessive writes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDragging) return; // Don't save while dragging
    
    localStorage.setItem("neural-divider-position", leftWidth.toString());
  }, [leftWidth, isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
    onDragStart?.();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    setIsDragging(true);
    onDragStart?.();
  };

  useEffect(() => {
    if (!isDragging) return;

    const updateWidth = (clientX: number) => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const containerRect = parent.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const x = clientX - containerRect.left;
      const newLeftWidth = (x / containerWidth) * 100;

      // Constrain between 20% and 80%
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(constrainedWidth);
      onDrag(constrainedWidth);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateWidth(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging
      if (e.touches.length > 0) {
        updateWidth(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.();
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      onDragEnd?.();
    };

    // Mouse events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Touch events
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, onDrag]);

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 bottom-0 cursor-col-resize touch-none z-50 flex items-center justify-center ${
        !isDragging ? "transition-all duration-300 ease-out" : ""
      }`}
      style={{ left: `${leftWidth}%`, transform: "translateX(-50%)" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Wider invisible area for easier dragging - larger on mobile for touch */}
      <div className="absolute inset-0 w-12 sm:w-8 -translate-x-1/2" style={{ touchAction: 'none' }} />
      {/* Visual line */}
      <div className="h-full w-1 bg-white/20 relative" />
      {/* Animated dots handle */}
      <div className="absolute flex flex-col gap-1.5 items-center justify-center pointer-events-none bg-white/5 rounded-full px-2 py-1">
        {COLORS.map((baseColor, index) => {
          const adjustedIndex = (index + colorIndex) % COLORS.length;
          const color = COLORS[adjustedIndex];
          return (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: color,
                scale: [1, 1.25, 1],
                opacity: [0.6, 1, 0.6],
                boxShadow: [`0 0 6px ${color}`, `0 0 12px ${color}`, `0 0 6px ${color}`],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.15,
                ease: [0.4, 0, 0.6, 1], // Smooth ease-in-out
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
