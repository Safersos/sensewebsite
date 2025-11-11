"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { navItems } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

export function SiteDock() {
  const pathname = usePathname();
  const isAbout = pathname === "/about" || pathname.startsWith("/about/");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
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
    </div>
  );
}
