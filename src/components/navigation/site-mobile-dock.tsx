"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

export function SiteMobileDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 md:hidden">
      <nav className="pointer-events-auto flex w-full max-w-[420px] items-center justify-between gap-2 rounded-[26px] border border-white/15 bg-white/10 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_18px_48px_rgba(6,8,30,0.45)] backdrop-blur-2xl">
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
                "group relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] transition-all duration-200 ease-out",
                isActive
                  ? "translate-y-[-6px] bg-white/15 text-white shadow-[0_12px_32px_rgba(8,10,30,0.45)]"
                  : "translate-y-0 text-white/70"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-all duration-200",
                  isActive
                    ? "bg-white text-neutral-900 shadow-[0_10px_24px_rgba(8,10,30,0.35)]"
                    : "bg-white/10 text-white/80"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[9px] tracking-[0.36em] text-white/70 group-hover:text-white md:hidden">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


