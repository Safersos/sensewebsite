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
                    "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 backdrop-blur transition-colors duration-200",
                    isActive ? "bg-white text-neutral-900 shadow-[0_10px_28px_rgba(10,10,30,0.28)]" : "text-white"
                  )}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="mobile-dock-active-ring"
                        className={cn(
                          "absolute inset-0 rounded-full border border-[#a5b4fc] shadow-[0_0_14px_rgba(129,140,248,0.55)]",
                          "scale-110"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 340, damping: 22, mass: 0.6 }}
                      />
                    )}
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


