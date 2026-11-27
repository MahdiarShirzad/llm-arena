"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Subtle enter animation per navigation. Motion is skipped entirely when the
 * visitor prefers reduced motion, and the key remounts content so the
 * animation replays on every route change.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
    >
      {children}
    </div>
  );
}
