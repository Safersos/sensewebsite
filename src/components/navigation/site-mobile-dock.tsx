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
                    "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white backdrop-blur transition-colors duration-300",
                    isActive && "shadow-[0_12px_30px_rgba(115,126,255,0.35)]"
                  )}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="mobile-dock-active-ring"
                        className={cn(
                          "absolute inset-0 rounded-full border border-[#c7d2fe]/70 shadow-[0_0_18px_rgba(129,140,248,0.65)]",
                          "pointer-events-none"
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: [1, 1.18, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        }}
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


