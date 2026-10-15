"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, queueRefresh } from "@/lib/gsap";

export default function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        // Lenis already smooths the scroll; a scrub lag on top of it
        // leaves the bar trailing the page it is measuring
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
    });
    queueRefresh();
    return () => ctx.revert();
  }, []);

  return (
    <span
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 block h-px bg-transparent"
    >
      <span
        ref={bar}
        className="block h-full origin-left scale-x-0 bg-accent/70"
      />
    </span>
  );
}
