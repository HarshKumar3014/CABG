"use client";

import { useEffect, useRef } from "react";
import { gsap, queueRefresh } from "@/lib/gsap";
import { canAnimate } from "@/lib/motion-safety";
import { shipRules } from "@/content/site";

/* Each rule starts as an outline of itself and fills in as it reaches
   the middle of the screen, so the page reads one rule at a time
   instead of presenting four at once. */
export default function ShipRules() {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = el.querySelectorAll<HTMLElement>("[data-rule]");

    if (!canAnimate()) {
      rows.forEach((r) => r.style.setProperty("--fill", "100%"));
      return;
    }

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { "--fill": "0%" },
          {
            "--fill": "100%",
            ease: "none",
            scrollTrigger: { trigger: row, start: "top 80%", end: "top 40%", scrub: true },
          }
        );
        gsap.from(row.querySelector("[data-why]"), {
          autoAlpha: 0,
          x: 24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 62%" },
        });
      });
    }, el);
    queueRefresh();
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root}>
      {shipRules.map((r) => (
        <li
          key={r.rule}
          data-rule
          className="rule grid12 items-baseline py-8 first:border-t-0 md:py-10"
          style={{ ["--fill" as string]: "0%" }}
        >
          <h3
            className="text-[clamp(2.25rem,5.4vw,5rem)] font-[450] leading-[0.95] tracking-[-0.045em] md:col-span-7"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--text) var(--fill), var(--line-bright) var(--fill))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {r.rule}
          </h3>
          <p data-why className="mt-4 measure text-body text-muted md:col-span-4 md:col-start-9 md:mt-0">
            {r.why}
          </p>
        </li>
      ))}
    </ol>
  );
}
