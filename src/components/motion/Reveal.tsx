"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ease, queueRefresh } from "@/lib/gsap";
import { armRevealFailsafe, canAnimate, showNow } from "@/lib/motion-safety";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /* "lines" masks each line up from behind a clip — for headlines.
     "chars" is heavier and reserved for the hero.
     "block" moves the whole element, for images and rules. */
  split?: "lines" | "chars" | "block";
  delay?: number;
  stagger?: number;
  start?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className,
  split = "lines",
  delay = 0,
  stagger,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    armRevealFailsafe();

    // Reduced motion, or a tab that cannot run rAF: show it and stop.
    if (!canAnimate()) {
      showNow(el);
      return;
    }

    // If anything in here throws, the element must still end up visible.
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
    ctx = gsap.context(() => {
      if (split === "block") {
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(el, {
          yPercent: 8,
          autoAlpha: 0,
          duration: 1.1,
          delay,
          ease: ease.out,
          scrollTrigger: { trigger: el, start },
        });
        return;
      }

      const st = new SplitText(el, {
        type: split === "chars" ? "chars,words,lines" : "lines",
        linesClass: "reveal-line",
        mask: "lines",
      });

      gsap.set(el, { autoAlpha: 1 });

      const targets = split === "chars" ? st.chars : st.lines;

      gsap.from(targets, {
        yPercent: 115,
        rotate: split === "chars" ? 1.5 : 0,
        duration: split === "chars" ? 1.05 : 1.15,
        delay,
        ease: ease.out,
        stagger: stagger ?? (split === "chars" ? 0.022 : 0.09),
        scrollTrigger: { trigger: el, start },
      });

      return () => st.revert();
    }, el);

    } catch {
      showNow(el);
      return;
    }

    queueRefresh();
    return () => ctx?.revert();
  }, [split, delay, stagger, start]);

  return (
    <Tag ref={ref} className={className} data-reveal>
      {children}
    </Tag>
  );
}
