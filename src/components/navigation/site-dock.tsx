"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

const IDLE_TIMEOUT = 4000; // 4 seconds
const ACTIVE_DURATION = 4000; // 4 seconds to stay active after scroll up

export function SiteDock() {
  const pathname = usePathname();
  const isAbout = pathname === "/about" || pathname.startsWith("/about/");
  
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false); // Ref to track hover state for timer callbacks
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (activeTimerRef.current) {
      clearTimeout(activeTimerRef.current);
      activeTimerRef.current = null;
    }
  }, []);

  // Start idle timer - only hides if not hovering
  const startIdleTimer = useCallback(() => {
    clearTimers();
    idleTimerRef.current = setTimeout(() => {
      // Check current hover state using ref (always up-to-date)
      if (!isHoveredRef.current) {
        setIsVisible(false);
      }
    }, IDLE_TIMEOUT);
  }, [clearTimers]);

  // Handle scroll events and wheel events (for non-scrollable pages)
  useEffect(() => {
    let lastActionTime = 0;
    let lastScrollProcessTime = 0;
    const ACTION_THROTTLE = 150; // Throttle to prevent rapid toggling
    const SCROLL_WHEEL_DEBOUNCE = 50; // Debounce between scroll and wheel events

    const handleScrollDirection = (isScrollingDown: boolean, source: 'scroll' | 'wheel') => {
      const now = Date.now();
      
      // If we just processed a scroll event, skip wheel events for a short time
      if (source === 'wheel' && (now - lastScrollProcessTime) < SCROLL_WHEEL_DEBOUNCE) {
        return;
      }
      
      // Throttle to prevent rapid toggling from multiple events
      if (now - lastActionTime < ACTION_THROTTLE) {
        return;
      }
      lastActionTime = now;
      
      if (source === 'scroll') {
        lastScrollProcessTime = now;
      }

      if (isScrollingDown) {
        // Scrolling down - always hide nav bar (even if hovering/interacting)
        clearTimers();
        setIsVisible(false);
        setIsHovered(false); // Reset hover state when hiding
        isHoveredRef.current = false; // Update ref
      } else {
        // Scrolling up - show nav bar and keep active for 4 seconds
        clearTimers();
        setIsVisible(true);
        setIsHovered(false); // Reset hover state (nav shown due to scroll, not hover)
        isHoveredRef.current = false; // Update ref
        
        // After ACTIVE_DURATION, start idle timer (only if not hovering)
        activeTimerRef.current = setTimeout(() => {
          startIdleTimer();
        }, ACTIVE_DURATION);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollYRef.current;
      
      // Update last scroll position
      lastScrollYRef.current = currentScrollY;

      if (scrollDelta > 0) {
        handleScrollDirection(true, 'scroll');
      } else if (scrollDelta < 0) {
        handleScrollDirection(false, 'scroll');
      }
      // If scrollDelta is 0, do nothing (might be programmatic scroll or page load)
    };

    // Handle wheel events for non-scrollable pages or scroll intent detection
    const handleWheel = (e: WheelEvent) => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 5; // Small threshold
      const isAtTop = window.scrollY <= 1;
      const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      
      // Process wheel events if:
      // 1. Page is not scrollable (no scroll events will fire), OR
      // 2. We're at top and trying to scroll up, OR
      // 3. We're at bottom and trying to scroll down
      // This ensures we detect scroll intent even when page doesn't actually scroll
      if (!isScrollable || (isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        if (e.deltaY > 10) { // Threshold to avoid small movements
          handleScrollDirection(true, 'wheel');
        } else if (e.deltaY < -10) {
          handleScrollDirection(false, 'wheel');
        }
      }
    };

    // Initialize scroll position
    lastScrollYRef.current = window.scrollY;

    // Add scroll listener (for scrollable pages)
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Add wheel listener (for non-scrollable pages and scroll intent)
    window.addEventListener("wheel", handleWheel, { passive: true });
    
    // Start initial idle timer after component mounts
    const initialTimer = setTimeout(() => {
      startIdleTimer();
    }, IDLE_TIMEOUT);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      clearTimers();
      clearTimeout(initialTimer);
    };
  }, [clearTimers, startIdleTimer]);

  // Handle nav bar hover - keeps nav visible while actively using it
  const handleMouseEnter = useCallback(() => {
    // Only keep visible if nav is already visible (don't show on hover if hidden)
    if (isVisible) {
      setIsHovered(true);
      isHoveredRef.current = true; // Update ref
      clearTimers(); // Clear timers while actively using nav
    }
  }, [isVisible, clearTimers]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    isHoveredRef.current = false; // Update ref
    // When leaving nav bar, start idle timer if nav is still visible
    if (isVisible) {
      startIdleTimer();
    }
  }, [startIdleTimer, isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
            <div className="pointer-events-auto max-w-full">
              <Dock
                className={cn(
                  "items-end px-5 py-3 backdrop-blur-2xl transition-colors duration-500",
                  isAbout
                    ? "border border-neutral-900/15 bg-white/85 shadow-[0_18px_42px_rgba(12,12,24,0.22)]"
                    : "border border-white/10 bg-white/10 shadow-[0_15px_40px_rgba(10,10,25,0.45)]"
                )}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DockItem
                      key={item.title}
                      className={cn(
                        "aspect-square rounded-2xl transition",
                        isAbout
                          ? "bg-neutral-950/5 hover:bg-neutral-950/12"
                          : "bg-white/15 hover:bg-white/25"
                      )}
                    >
                      <DockLabel
                        className={cn(
                          "border text-neutral-900",
                          isAbout
                            ? "border-neutral-900/15 bg-white/95"
                            : "border-white/20 bg-white/90 dark:border-white/20 dark:bg-white/10 dark:text-white"
                        )}
                      >
                        {item.title}
                      </DockLabel>
                      <DockIcon className="h-full w-full">
                        <Link
                          href={item.href}
                          className="flex h-full w-full items-center justify-center"
                        >
                          <Icon
                            className={cn(
                              "h-full w-full transition-colors duration-500",
                              isAbout ? "text-neutral-900" : "text-white"
                            )}
                          />
                        </Link>
                      </DockIcon>
                    </DockItem>
                  );
                })}
              </Dock>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
