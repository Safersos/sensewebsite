"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(24px)" }}
          transition={{
            duration: 0.55,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="pointer-events-auto will-change-[opacity,transform,filter]"
          style={{ minHeight: "100vh" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


