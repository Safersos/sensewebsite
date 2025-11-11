"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

export function SiteMobileDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:hidden">
      <nav className="pointer-events-auto flex w-full max-w-[360px] items-center justify-between gap-1.5 rounded-[24px] border border-white/12 bg-white/12 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_16px_40px_rgba(6,8,30,0.4)] backdrop-blur-2xl">
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
                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] transition-all duration-200 ease-out",
                isActive
                  ? "translate-y-[-5px] bg-white text-neutral-900 shadow-[0_10px_28px_rgba(8,10,30,0.38)]"
                  : "translate-y-0 bg-white/6 text-white/70"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition-all duration-200",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-white/12 text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[8px] tracking-[0.32em] text-white/70 group-hover:text-white md:hidden">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


