"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "framer-motion";
import { useEffect, useState } from "react";

import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

export function SiteMobileDock() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDarkMode(event.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:hidden">
      <LayoutGroup>
        <nav
          className={cn(
            "pointer-events-auto flex w-full max-w-[340px] items-end justify-between gap-2 rounded-[26px] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] backdrop-blur-2xl transition-colors duration-500",
            isDarkMode
              ? "border border-white/12 bg-white/12 text-white shadow-[0_14px_36px_rgba(6,8,30,0.4)]"
              : "border border-neutral-900/10 bg-white/85 text-neutral-700 shadow-[0_12px_30px_rgba(20,24,40,0.18)]"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex flex-1 items-center justify-center transition-transform duration-200 ease-out",
                  isDarkMode ? "text-white/70" : "text-neutral-700"
                )}
              >
                <span className="sr-only">{item.title}</span>
                <span
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition-all duration-300",
                    isDarkMode
                      ? "border-white/12 bg-white/8 text-white/80"
                      : "border-neutral-900/10 bg-white/90 text-neutral-700",
                    isActive && "shadow-[0_14px_32px_rgba(99,102,241,0.28)]"
                  )}
                >
                  <AnimatePresence>
                    {isActive &&
                      [
                        <motion.span
                          key="ring"
                          layoutId="mobile-dock-active-ring"
                          className="pointer-events-none absolute inset-0 rounded-full border border-indigo-300/80 shadow-[0_0_14px_rgba(129,140,248,0.55)]"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 24,
                            mass: 0.65,
                          }}
                        />,
                        <motion.span
                          key="pulse"
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{
                            boxShadow:
                              "0 0 0 2px rgba(99, 102, 241, 0.22), 0 0 18px rgba(99, 102, 241, 0.35)",
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: [0.35, 0.75, 0.35],
                            scale: [1, 1.12, 1],
                          }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                          }}
                        />,
                      ]}
                  </AnimatePresence>
                  <Icon
                    className={cn(
                      "relative z-10 h-[17px] w-[17px]",
                      isDarkMode ? "text-white" : "text-neutral-800"
                    )}
                  />
                </span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
    </div>
  );
}

