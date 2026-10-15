"use client";

import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion, queueRefresh } from "@/lib/gsap";

/* template.tsx remounts on every navigation, which makes it the right
   place for a route transition. Opacity only — a transform here would
   create a containing block and change how the pinned sections inside
   resolve. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.55,
        ease: ease.soft,
        clearProps: "opacity",
        onComplete: queueRefresh,
      }
    );

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "opacity" });
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
