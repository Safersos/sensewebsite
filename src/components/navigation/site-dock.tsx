"use client";

import Link from "next/link";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { navItems } from "@/components/navigation/nav-items";

export function SiteDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
      <div className="pointer-events-auto max-w-full">
        <Dock className="items-end border border-white/10 bg-white/10 px-5 py-3 shadow-[0_15px_40px_rgba(10,10,25,0.45)] backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <DockItem
                key={item.title}
                className="aspect-square rounded-2xl bg-white/15 transition hover:bg-white/25"
              >
                <DockLabel className="border-white/20 bg-white/90 text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-white">
                  {item.title}
                </DockLabel>
                <DockIcon className="h-full w-full">
                  <Link
                    href={item.href}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <Icon className="h-full w-full text-white" />
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


