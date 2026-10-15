"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* Runs at a slow constant crawl, then takes its speed and lean from how
   fast the page is moving — so it answers the reader rather than just
   looping at them. */
export default function Marquee({
  items,
  baseSpeed = 0.35,
}: {
  items: string[];
  baseSpeed?: number;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const half = el.scrollWidth / 2;
      const wrap = gsap.utils.wrap(-half, 0);
      let offset = 0;
      let velocity = 0;
      let direction = 1;

      const setX = gsap.quickSetter(el, "x", "px");
      const skew = gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3" });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          direction = self.direction;
          velocity = Math.min(Math.abs(self.getVelocity()) / 220, 22);
        },
      });

      const tick = (_t: number, delta: number) => {
        const step = (baseSpeed + velocity) * direction * (delta / 16.67);
        offset = wrap(offset - step);
        setX(offset);
        skew(gsap.utils.clamp(-9, 9, -velocity * direction * 0.4));
        velocity *= 0.92;
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    }, el);

    return () => ctx.revert();
  }, [baseSpeed]);

  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-6" aria-hidden>
      <div ref={track} className="flex w-max items-center gap-10 will-change-transform">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-10">
            <span className="text-h3 whitespace-nowrap text-muted-dim">{item}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-accent-dim" />
          </span>
        ))}
      </div>
    </div>
  );
}
