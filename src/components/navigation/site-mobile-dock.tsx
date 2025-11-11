"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

export function SiteMobileDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:hidden">
      <LayoutGroup>
        <nav className="pointer-events-auto flex w-full max-w-[340px] items-end justify-between gap-2 rounded-[26px] border border-white/12 bg-white/12 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_14px_36px_rgba(6,8,30,0.4)] backdrop-blur-2xl">
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
                className="group relative flex flex-1 items-center justify-center text-white/70 transition-transform duration-200 ease-out"
              >
                <span className="sr-only">{item.title}</span>
                <span
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 backdrop-blur transition-all duration-300",
                    isActive && "shadow-[0_14px_32px_rgba(99,102,241,0.25)]"
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
                          transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.65 }}
                        />,
                        <motion.span
                          key="pulse"
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{
                            boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.22), 0 0 18px rgba(99, 102, 241, 0.35)",
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
                  <Icon className="relative z-10 h-[17px] w-[17px]" />
                </span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
    </div>
  );
}


